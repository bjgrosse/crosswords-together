import React, { useContext, useState, useEffect } from 'react';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


import firebaseConfig from '../firebaseConfig';

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

const providers = {
    googleProvider: new firebase.auth.GoogleAuthProvider(),
    emailProvider: new firebase.auth.EmailAuthProvider(),
    facebookProvider: new firebase.auth.FacebookAuthProvider()
  };

const Login = props => {

    // Configure FirebaseUI.
    let uiConfig = {
        credentialHelper: 'none',

        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID
        ],
        callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => false
        }
    };

    uiConfig = { ...uiConfig, ...props.firebaseUiConfig }


    return (
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    );
}
export default Login;