import firebase from 'firebase';
const currentUserId = function () {
    return firebase.auth().currentUser.uid
}
export default {
    getPuzzleTemplate: async (id) => {
        console.log("Getting template", id);
        const doc = await firebase.firestore().collection("puzzle-templates").doc(id).get();
        return doc.data();
    },
    getPuzzle: async (id, listenForChanges) => {
        console.log("Getting puzzle", id);
        let doc = firebase.firestore().collection("puzzles").doc(id);
        if (listenForChanges) { doc.onSnapshot((doc) => listenForChanges(doc.data())) };
        const doc_2 = await doc.get();
        return doc_2.data();
    },
    getMyPuzzles: async () => {
        const querySnapshot = await firebase.firestore().collection("puzzles")
            .where("playerIds", "array-contains", currentUserId()).get();
        return querySnapshot.docs.map((doc) => ({ ...doc.data(), ...{ id: doc.id } }));
    },
    saveSquareValue: (puzzleId, rowIdx, cellIdx, value) => {
        console.log("saving square: ", rowIdx, cellIdx, value);
        let data = {};
        data[`squares.${rowIdx}|${cellIdx}`] = { value: value, userId: currentUserId() }
        return firebase.firestore().collection("puzzles").doc(puzzleId).update(data);
    },
    saveClueList: (templateId, list, clues) => {
        console.log("saving clue list: ", templateId, list);
        let data = {};
        data[`clues${list}`] = clues;
        return firebase.firestore().collection("puzzle-templates").doc(templateId).update(data);
    },
    addPlayer: (puzzleId, email) => {
        let data = {
            puzzleId: puzzleId,
            recipientEmail: email,
            senderId: currentUserId(),
        };
       
        return firebase.firestore().collection("invitations").add(data);
    }

};