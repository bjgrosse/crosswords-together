import React from "react";
import PushMessaging from "./PushMessaging";
import AppFrameStore from "./AppFrameStore";
import ApplicationStore from "Stores/ApplicationStore";
import { withRouter } from "react-router-dom";

const defaultState = {
  appBarContentNode: null,
  appBarActionsNode: null,
  bannerNode: null,
  appFrameStore: null
};

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const AppContext = React.createContext({
  ...defaultState,
  setAppBarContentNode: () => {},
  setAppBarActionsNode: () => {},
  setBannerNode: value => {}
});

export const AppContextManager = withRouter(
  class AppContextManager extends React.Component {
    constructor(props) {
      super(props);
      this.state = { ...defaultState };
      this.appFrameStore = AppFrameStore.create();
      this.appStore = ApplicationStore.create();
      this.PushMessaging = new PushMessaging({
        setPushMessagingEnabled: this.appFrameStore.setPushNotificationsAllowed
      });
    }

    setAppBarContentNode = ref => {
      this.setState(state => {
        if (ref !== state.appBarContentNode) {
          return { appBarContentNode: ref };
        }
      });
    };
    setAppBarActionsNode = ref => {
      this.setState(state => {
        if (ref !== state.appBarActionsNode) {
          return { appBarActionsNode: ref };
        }
      });
    };

    setBannerNode = value => {
      this.setState({ bannerNode: value });
    };

    handleGoBack = () => {
      if (window.history.state && window.history.state.appBarCanGoBack) {
        this.props.history.goBack();
      } else {
        this.props.history.push("/");
      }
    };

    getContext = () => {
      return {
        ...this.state,
        ...{
          appFrameState: this.appFrameStore,
          appState: this.appStore,
          PushMessaging: this.PushMessaging,
          setAppBarContentNode: this.setAppBarContentNode,
          setAppBarActionsNode: this.setAppBarActionsNode,
          setBannerNode: this.setBannerNode,
          goBack: this.handleGoBack
        }
      };
    };

    render() {
      return (
        <AppContext.Provider value={this.getContext()}>
          {this.props.children}
        </AppContext.Provider>
      );
    }
  }
);

export default AppContext;
