import firebase from 'firebase';
const getCurrentUserId = () => firebase.auth().currentUser.uid

class Deferred {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.reject = reject
            this.resolve = resolve
        })
    }
}

function retrieveAndListen(ref, listenForChanges, prepRecord) {
    let handle = new Deferred()

    ref.onSnapshot((snapshot) => {            
        let result = snapshot.docs.map((doc) => ({ ...doc.data(), ...{ id: doc.id } }));

        if (prepRecord) {
            result = result.map(r => prepRecord(r))
        }
        // If this is our initial response
        // then resolve the promise that is waiting
        if (handle) {
            handle.resolve(result)
            handle = null;

            // Otherwise, call the change listener
        } else {
            listenForChanges(result)
        }
    }, (error) => {
        if (handle) {
            handle.reject(error)
            handle = null;
        } else {
            throw error;
        }
    })

    return handle.promise;
}

export default {
    getCurrentUserId: getCurrentUserId,
    getCurrentUser: () => firebase.auth().currentUser,
    getPuzzleTemplate: async (id) => {
        console.log("Getting template", id);
        const doc = await firebase.firestore().collection("puzzle-templates").doc(id).get();
        return { ...doc.data(), ...{ id: doc.id, dateAdded: doc.data().dateAdded.toDate() } };
    },
    getPuzzle: async (id, listenForChanges) => {
        console.log("Getting puzzle", id);
        let ref = firebase.firestore().collection("puzzles").doc(id);
        let doc = await ref.get();
        if (listenForChanges) { ref.onSnapshot((doc) => listenForChanges(doc.data())) };
        return { ...doc.data(), ...{ id: doc.id } };
    },
    getInvitation: async (id) => {
        let doc = await firebase.firestore().collection("invitations").doc(id).get();
        return { ...doc.data(), ...{ id: doc.id } };
    },
    getNewPuzzleId: () => (firebase.firestore().collection("puzzles").doc().id),
    getMyPuzzles: async () => {

        console.log("Getting my puzzles");
        const querySnapshot = await firebase.firestore().collection("puzzles")
            .where("playerIds", "array-contains", getCurrentUserId()).get();
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), ...{ id: doc.id } }));
    },
    getMyTemplates: (listenForChanges) => {

        const ref = firebase.firestore().collection("puzzle-templates")
            .where("ownerId", "==", getCurrentUserId())

        return retrieveAndListen(ref, listenForChanges, r => r = {...r, dateAdded: r.dateAdded.toDate() })
    },
    getPublicTemplates: (listenForChanges) => {

        const ref = firebase.firestore().collection("puzzle-templates")
            .where("public", "==", true) //.where("ownerId", "!==", getCurrentUserId())

        return retrieveAndListen(ref, listenForChanges, r => r = {...r, dateAdded: r.dateAdded.toDate() })
    },
    saveSquareValue: (puzzleId, rowIdx, cellIdx, value, percentComplete) => {
        console.log("saving square: ", rowIdx, cellIdx, value);
        let data = {};
        data[`squares.${rowIdx}|${cellIdx}`] = { value: value, userId: getCurrentUserId() }
        data.percentComplete = percentComplete;
        
        return firebase.firestore().collection("puzzles").doc(puzzleId).update(data);
    },
    savePuzzle: (id, data) => {
        console.log("saving puzzle: ", data);
        return firebase.firestore().collection("puzzles").doc(id).set(data);
    },
    saveTemplate: (templateId, data, onGotId) => {
        console.log("saving template: ", templateId, data);
        let ref;

        if (!templateId) {
            ref = firebase.firestore().collection("puzzle-templates").doc()
        } else {
            ref = firebase.firestore().collection("puzzle-templates").doc(templateId)
        }

        if (ref.id !== templateId && onGotId !== undefined) {
            onGotId(ref.id)
        }
        return ref.set(data);
    },
    addPlayer: (puzzleId, email) => {
        let data = {
            puzzleId: puzzleId,
            recipientEmail: email,
            senderId: getCurrentUserId(),
        };

        return firebase.firestore().collection("invitations").add(data);
    },
    acceptInvitation: (id) => {
        return firebase.functions().httpsCallable("acceptInvitation")({ id: id, acceptingUserId: getCurrentUserId() })
    }

};