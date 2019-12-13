import React, { useState } from "react";

import AppFrameConfig from "./AppFrameConfig";
import { Div } from "../UI/StyledComponents";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";

import * as firebase from "firebase/app";
import "firebase/auth";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

// const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  emailProvider: new firebase.auth.EmailAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider()
};

const Login = props => {
  const [loggedIn, setLoggedIn] = useState();
  const isPortrait = useMediaQuery("(orientation: portrait)");

  const onLoggedIn = () => {
    setLoggedIn(true);
  };

  // Configure FirebaseUI.
  let uiConfig = {
    credentialHelper: "none",

    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: () => {}
    }
  };

  uiConfig = { ...uiConfig, ...props.firebaseUiConfig };

  let message = props.children;

  return (
    <AppFrameConfig hideAppBar>
      <Div flex column={isPortrait} full flexCenter>
        <Div flex column={isPortrait} justifyEnd grow>
          <Div maxWidth="256px" maxHeight="256px">
            <img width="100%" src="/logo.svg" />
          </Div>
        </Div>
        {isPortrait && (
          <Div flex row alignCenter alignCenter={isPortrait}>
            <Div mt={2} maxWidth="300px">
              <Typography variant="h6" color="primary" align="center">
                It's more fun together!
              </Typography>
              {message}
            </Div>
          </Div>
        )}
        <Div
          flex
          grow
          column
          alignStart
          justifyStart
          ml={!isPortrait ? 2 : 0}
          minWidth={40}
        >
          <Div flex column fullHeight>
            {!isPortrait && (
              <Div column alignCenter maxWidth="300px">
                <Typography variant="h6" color="textPrimary" align="center">
                  It's more fun together!
                </Typography>
                {message}
              </Div>
            )}
            <Div relative full>
              <Div absolute fullWidth height={80}>
                <Div absolute center width={40} height={40}>
                  <CircularProgress color="primary" />
                </Div>
              </Div>
              <Div relative width="auto">
                <StyledFirebaseAuth
                  uiConfig={uiConfig}
                  firebaseAuth={firebase.auth()}
                />
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
    </AppFrameConfig>
  );
};
export default Login;
