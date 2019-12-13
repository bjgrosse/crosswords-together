import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/messaging";

import firebaseConfig from "./firebaseConfig";

firebase.initializeApp(firebaseConfig);
