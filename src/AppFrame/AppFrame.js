import React from "react";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { observer } from "mobx-react";

import * as firebase from "firebase/app";
import "firebase/auth";

import { AppContext } from "./AppContext";

import { AppRoot, AppCanvas, PageContainer } from "Theme/AppFrameComponents";
import { Div } from "UI/StyledComponents";
import Placeholder from "UI/Placeholder";
import AppSnackBar from "./AppSnackBar";
import LoadingContainer from "./LoadingContainer";
import AppBar from "./AppBar";
import Login from "../Components/Login/Login";

import posed from "react-pose";

const RouteContainer = posed(PageContainer)({
  enter: {
    x: 0,
    opacity: 1
  },
  exit: {
    x: -300,
    opacity: 0
  }
});

class AppFrame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    };

    this.bannerRef = React.createRef();
    this.handlePopState = this.handlePopState.bind(this);
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.context.appState.setUser(firebase.auth().user);
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      this.setState({ isLoading: true });
      this.context.appState
        .setUser(user)
        .then(() => this.setState({ isLoading: false }));
    });
    window.onpopstate = this.handlePopState;
  }

  componentWillUnmount() {
    if (this.unregisterAuthObserver) {
      this.unregisterAuthObserver();
    }
  }

  handlePopState(event) {}

  logout = () => {
    if (this.context.appState.user) {
      firebase.auth().signOut();
      return <div>Logging out...</div>;
    } else {
      return <Redirect to="/" />;
    }
  };

  render() {
    let context = this.context;
    if (this.state.isLoading) {
      return (
        <AppRoot>
          <LoadingContainer isLoading={true} />
        </AppRoot>
      );
    } else {
      let routes = [
        <Route key="login" path="/login">
          {this.context.user ? <Redirect to="/" /> : <Login />}
        </Route>,
        <Route key="logout" path="/logout" render={this.logout} />
      ];

      routes.push(this.props.getRoutes());

      //catch all
      routes.push(
        <Route key="catchall">
          <Login />
        </Route>
      );

      return (
        <AppRoot>
          <>
            <AppCanvas>
              <>
                <AppBar
                  config={context.appFrameState.appBar}
                  setContentNodeRef={context.setAppBarContentNode}
                  setActionsNodeRef={context.setAppBarActionsNode}
                  handleBack={this.context.goBack}
                  menuItems={this.props.menuItems}
                />

                <Placeholder onDomNodeLoaded={context.setBannerNode} />

                <Div grow relative>
                  <RouteContainer key={this.props.location.key}>
                    <Switch>{routes}</Switch>
                  </RouteContainer>
                </Div>
              </>
            </AppCanvas>
            <AppSnackBar />
          </>
        </AppRoot>
      );
    }
  }
}

AppFrame.contextType = AppContext;

export default withRouter(observer(AppFrame));
