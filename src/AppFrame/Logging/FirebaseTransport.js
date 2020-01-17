import firebase from "firebase";
const Transport = require("winston-transport");

export default class FirebaseTransport extends Transport {
  constructor(opts) {
    super(opts);
  }

  log(info, callback) {
    setImmediate(() => {
      this.emit("logged", info);
    });

    try {
      //let date = Date.now()
      let ref = firebase
        .firestore()
        .collection("logs")
        .doc(); //.doc(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`).collection("logs").doc()
      ref.set({
        ...info,
        uid: firebase.auth().currentUser
          ? firebase.auth().currentUser.uid
          : null
      });
    } catch (error) {
      this.emit("warn", error);
    }

    callback();
  }
}
