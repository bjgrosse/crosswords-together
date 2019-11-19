import React, { Fragment } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { observer } from 'mobx-react'

import AppBar from './AppBar';
import Login from './Login'
import { AppContext } from './AppContext';
import './AppFrame.css';
import '../Theme/Theme.css';

import * as firebase from 'firebase/app';
import 'firebase/auth';

import CircularProgress from '@material-ui/core/CircularProgress';

import Snackbar from '@material-ui/core/Snackbar';
import { Div } from "../UI/StyledComponents"
import Placeholder from "../UI/Placeholder"
import { AppRoot, AppCanvas, PageContainer, AppBanner, LoadingContainer } from "../UI/StyledComponents/AppFrameComponents"
import AppSnackBar from './AppSnackBar'
import PushMessaging from './PushMessaging'

import posed, { PoseGroup } from 'react-pose'

const RouteContainer = posed(PageContainer)({
  enter: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -300,
    opacity: 0
  }
})



class AppFrame extends React.Component {


  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }

    this.bannerRef = React.createRef();
    this.handlePopState = this.handlePopState.bind(this);
  }


  // Listen to the Firebase Auth state and set the local state.
  componentDidMount() {
    this.context.setUser(firebase.auth().user)
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => {
        this.setState({ isLoading: false });
        this.context.setUser(user)
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
    if (this.context.user) {
      firebase.auth().signOut(); //.then(()=> this.props.history.push('/login'));
      return <div>Logging out...</div>;

    } else {
      return <Redirect to="/" />
    }
  }

  handleBack = () => {
    if (this.context.store.appBars.length > 1) {
      this.props.history.goBack()
    } else {
      this.props.history.push("/")
    }

  }


  render() {
    let context = this.context
    if (this.state.isLoading) {
      return (

        <AppRoot>
          <LoadingContainer><CircularProgress /></LoadingContainer>
        </AppRoot>
      )
    } else {
      let routes = [
        <Route path='/login' >
          {this.context.user ?
            <Redirect to="/" />
            :
            <Login />
          }
        </Route>,
        <Route path='/logout' render={this.logout} />
      ]

      routes.push(this.props.getRoutes())

      //catch all
      routes.push(<Route><Login /></Route>)

      return (
        <AppRoot>
          <>
            <AppCanvas>
              <>
                <AppBar
                  config={context.store.appBar}
                  setContentNodeRef={context.setAppBarContentNode}
                  setActionsNodeRef={context.setAppBarActionsNode}
                  handleBack={this.handleBack}
                  menuItems={this.props.menuItems} />

                <Placeholder onDomNodeLoaded={context.setBannerNode} />
                <Div grow relative>
                  <RouteContainer key={this.props.location.key}>

                    <Switch>
                      {routes}
                    </Switch>
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

AppFrame.contextType = AppContext

export default withRouter(observer(AppFrame));

