import React, { Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'

import AppBar from './AppBar';
import Login from './Login'
import { AppContext, AppContextManager } from './AppFrameContext';
import './AppFrame.css';
import '../Theme/Theme.css';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Div } from "../StyledComponents"
import { AppRoot, AppCanvas, PageContainer, LoadingContainer } from "../StyledComponents/AppFrameComponents"

//const firebaseDb = firebase.database();




class AppFrame extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      user: null,
      currentPage: null,
      contextBars: []
    }

    this.handlePopState = this.handlePopState.bind(this);
  }




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
    console.log(event)
  }

  logout = () => {
    if (this.state.user) {
      firebase.auth().signOut(); //.then(()=> this.props.history.push('/login'));
      return <div>Logging out...</div>;

    } else {
      return <Redirect to="/login" />
    }
  }

  handleBack = (context) => {
    if (context.contextBars.length > 1) {
      this.props.history.goBack()
    } else {
      this.props.history.push("/")
    }
    
  }


  render() {

    if (this.state.isLoading) {
      return (

        <AppRoot>
          <LoadingContainer><CircularProgress /></LoadingContainer>
        </AppRoot>
      )
    } else {
      return (
        <AppContextManager user={this.state.user}>
          <AppRoot>
            <AppCanvas>
              <AppContext.Consumer>
                {context =>
                  <AppBar
                    contextBar={context.contextBar}
                    setContentNodeRef={context.setAppBarContentNode}
                    setActionsNodeRef={context.setAppBarActionsNode}
                    handleBack={this.handleBack}
                    menuItems={this.props.menuItems} />
                }
              </AppContext.Consumer>
              <Div grow relative>
                <PageContainer >
                  <Switch>
                    <Fragment>
                      {this.props.getRoutes()}
                      <Route path='/login' >
                        {this.state.user ?
                          <Redirect to="/" />
                          :
                          <Login />
                        }
                      </Route>
                      <Route path='/logout' render={this.logout} />
                    </Fragment>

                  </Switch>
                </PageContainer>
              </Div>
            </AppCanvas>
          </AppRoot>
        </AppContextManager>
      );
    }
  }
}

export default withRouter(AppFrame);

