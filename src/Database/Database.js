import firebase from "firebase";
const getCurrentUserId = () => firebase.auth().currentUser.uid;

class Deferred {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.reject = reject;
      this.resolve = resolve;
    });
  }
}

function retrieveAndListen(ref, listenForChanges, prepRecord) {
  let handle = new Deferred();

  ref.onSnapshot(
    snapshot => {
      let singleDoc = snapshot.data !== undefined;

      let result;

      if (singleDoc) {
        result = {
          ...snapshot.data(),
          ...{ id: snapshot.id }
        };

        if (prepRecord) {
          result = prepRecord(result);
        }
      } else {
        result = snapshot.docs.map(doc => ({
          ...doc.data(),
          ...{ id: doc.id }
        }));
        if (prepRecord) {
          result = result.map(r => prepRecord(r));
        }
      }

      // If this is our initial response
      // then resolve the promise that is waiting
      if (handle) {
        handle.resolve(result);
        handle = null;

        // Otherwise, call the change listener
      } else {
        if (listenForChanges) listenForChanges(result);
      }
    },
    error => {
      if (handle) {
        handle.reject(error);
        handle = null;
      } else {
        throw error;
      }
    }
  );

  return handle.promise;
}

export default {
  getCurrentUserId: getCurrentUserId,
  getCurrentUser: () => firebase.auth().currentUser,
  saveFCMToken: token => {
    console.log("saving fcm token");
    return firebase.functions().httpsCallable("saveFcmToken")({
      userId: getCurrentUserId(),
      token: token
    });
  },
  getUser: async (id, listenForChanges) => {
    let ref = await firebase
      .firestore()
      .collection("users")
      .doc(id);
    return retrieveAndListen(ref, listenForChanges);
  },
  saveUser: data => {
    console.log("saving user: ", data);
    return firebase
      .firestore()
      .collection("users")
      .doc(getCurrentUserId())
      .update(data);
  },
  getPuzzleTemplate: async id => {
    console.log("Getting template", id);
    const doc = await firebase
      .firestore()
      .collection("puzzle-templates")
      .doc(id)
      .get();
    return {
      ...doc.data(),
      ...{ id: doc.id, dateAdded: doc.data().dateAdded.toDate() }
    };
  },
  getPuzzle: async (id, listenForChanges) => {
    console.log("Getting puzzle", id);
    let ref = firebase
      .firestore()
      .collection("puzzles")
      .doc(id);
    let doc = await ref.get();
    if (listenForChanges) {
      ref.onSnapshot(doc => listenForChanges(doc.data()));
    }
    return { ...doc.data(), ...{ id: doc.id } };
  },
  getInvitation: async id => {
    let doc = await firebase
      .firestore()
      .collection("invitations")
      .doc(id)
      .get();
    return { ...doc.data(), ...{ id: doc.id } };
  },
  getNewPuzzleId: () =>
    firebase
      .firestore()
      .collection("puzzles")
      .doc().id,
  getMyPuzzles: async listenForChanges => {
    console.log("Getting my puzzles");
    const ref = firebase
      .firestore()
      .collection("puzzles")
      .where("playerIds", "array-contains", getCurrentUserId());

    return retrieveAndListen(ref, listenForChanges, r => (r = { ...r }));
  },
  getMyTemplates: listenForChanges => {
    const ref = firebase
      .firestore()
      .collection("puzzle-templates")
      .where("ownerId", "==", getCurrentUserId());

    return retrieveAndListen(
      ref,
      listenForChanges,
      r => (r = { ...r, dateAdded: r.dateAdded.toDate() })
    );
  },
  getPublicTemplates: listenForChanges => {
    const ref = firebase
      .firestore()
      .collection("puzzle-templates")
      .where("public", "==", true);

    return retrieveAndListen(
      ref,
      listenForChanges,
      r => (r = { ...r, dateAdded: r.dateAdded.toDate() })
    );
  },
  saveSquareValue: (puzzleId, rowIdx, cellIdx, value, percentComplete) => {
    console.log("saving square: ", rowIdx, cellIdx, value);
    let data = { lastActivityDate: Date.now() };
    data[`squares.${rowIdx}|${cellIdx}`] = {
      value: value,
      userId: getCurrentUserId()
    };
    data.percentComplete = percentComplete;

    return firebase
      .firestore()
      .collection("puzzles")
      .doc(puzzleId)
      .update(data);
  },
  savePuzzle: (id, data, listenForChanges) => {
    console.log("saving puzzle: ", data);
    const ref = firebase
      .firestore()
      .collection("puzzles")
      .doc(id);

    ref.onSnapshot(snapshot => {
      listenForChanges(snapshot.data());
    });

    return ref.set(data);
  },
  saveTemplate: (templateId, data, onGotId) => {
    console.log("saving template: ", templateId, data);
    let ref;

    if (!templateId) {
      ref = firebase
        .firestore()
        .collection("puzzle-templates")
        .doc();
    } else {
      ref = firebase
        .firestore()
        .collection("puzzle-templates")
        .doc(templateId);
    }

    if (ref.id !== templateId && onGotId !== undefined) {
      onGotId(ref.id);
    }
    return ref.set(data);
  },
  addPlayer: (puzzleId, email) => {
    let data = {
      puzzleId: puzzleId,
      recipientEmail: email,
      senderId: getCurrentUserId()
    };

    return firebase
      .firestore()
      .collection("invitations")
      .add(data);
  },
  createInvitationLink: async puzzleId => {
    let response = await firebase
      .functions()
      .httpsCallable("createInvitationLink")({
      puzzleId: puzzleId,
      userId: getCurrentUserId()
    });
    return response.data;
  },
  connectInvitation: (id, puzzleId) => {
    return firebase.functions().httpsCallable("connectInvitation")({
      id: id,
      puzzleId: puzzleId,
      acceptingUserId: getCurrentUserId()
    });
  },
  acceptInvitation: id => {
    return firebase.functions().httpsCallable("acceptInvitation")({
      id: id,
      acceptingUserId: getCurrentUserId()
    });
  },
  updatePlayerColor: (id, puzzleId, color) => {
    return firebase.functions().httpsCallable("updatePlayerColor")({
      id: id,
      puzzleId: puzzleId,
      color: color
    });
  },
  leaveGame: id => {
    return firebase.functions().httpsCallable("leaveGame")({
      id: id,
      userId: getCurrentUserId()
    });
  },
  getUsedTemplateIds: async listenForChanges => {
    const ref = firebase
      .firestore()
      .collection("users")
      .doc(getCurrentUserId())
      .collection("usedTemplateIds");
    return retrieveAndListen(ref, listenForChanges, r => r.id);
  },

  saveCompletedWord: (id, puzzleId, value) => {
    console.log("saving word", id, value);
    return firebase.functions().httpsCallable("updateCompletedWord")({
      id: id,
      userId: getCurrentUserId(),
      puzzleId: puzzleId,
      value: value
    });
  }
};
