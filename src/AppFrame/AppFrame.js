import React, { Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

import AppBar from './AppBar';
import { AppContext } from './AppFrameContext';
import './AppFrame.css';
import '../Theme/Theme.css';

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../firebaseConfig';

import CircularProgress from '@material-ui/core/CircularProgress';


const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
//const firebaseDb = firebase.database();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
  emailProvider: new firebase.auth.EmailAuthProvider(),
  facebookProvider: new firebase.auth.FacebookAuthProvider()
};


class AppFrame extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      user: null,
      currentPage: null
    }

    this.uiconfig = { ...this.uiConfig, ...props.firebaseUiConfig }
    this.handlePopState = this.handlePopState.bind(this);
  }


  

  // Configure FirebaseUI.
  uiConfig = {
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

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => {
        this.setState({ user: user, isLoading: false });
      }
    );
    window.onpopstate = this.handlePopState;
  }

  // Make sure we un-register Firebase observers when the component unmounts.
  componentWillUnmount() {
    this.unregisterAuthObserver();
    window.onpopstate = null;
  }

  handlePopState(event) {

  }

  logout = () => {
    if (this.state.user) {
      firebase.auth().signOut(); //.then(()=> this.props.history.push('/login'));
      return <div>Logging out...</div>;

    } else {
      return <Redirect to="/login" />
    }
  }

  setContextBar = (info) => {
    this.setState({ contextBar: info });
  }

  getContext = () => {
    return {
      contextBar: this.state.contextBar,
      user: this.state.user,
      setContextBar: this.setContextBar
    }
  }

  render() {

    if (this.state.isLoading) {
      return (
        <div className="App__LoadingContainer"><CircularProgress /></div>
      )
    } else {
      let user = this.state.user;
      return (
        <AppContext.Provider value={this.getContext()}>
          <div className="App">
            <AppBar menuItems={this.props.menuItems} />
            <Switch>
              <Fragment>
                {this.props.getRoutes()}
                <Route path='/login' >
                  {this.state.user ?
                    <Redirect to="/" />
                    :
                    <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
                  }
                </Route>
                <Route path='/logout' render={this.logout} />
              </Fragment>
            </Switch>
          </div>
        </AppContext.Provider>
      );
    }
  }
}

export default withRouter(AppFrame);

