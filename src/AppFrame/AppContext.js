import React from 'react';
import PushMessaging from './PushMessaging'
import ApplicationStore from './ApplicationStore'

const defaultState = {
  user: null,
  appBarContentNode: null,
  appBarActionsNode: null,
  bannerNode: null,
  store: null
}

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const AppContext = React.createContext({
  ...defaultState,
  setUser: (user) => { },
  setAppBarContentNode: () => { },
  setAppBarActionsNode: () => { },
  setBannerNode: (value) => { },
});


export class AppContextManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ...defaultState }
    this.store = ApplicationStore.create()
    this.PushMessaging = new PushMessaging({setPushMessagingEnabled: this.store.setPushNotificationsAllowed })
  }

  setAppBarContentNode = (ref) => {
    this.setState(state => {
      if (ref !== state.appBarContentNode) {
        return { appBarContentNode: ref }
      }
    })
  }
  setAppBarActionsNode = (ref) => {
    this.setState(state => {
      if (ref !== state.appBarActionsNode) {
        return { appBarActionsNode: ref }
      }
    })
  }
  
  setBannerNode = (value) => {
    this.setState({ bannerNode: value })
  }
  setUser = (value) => {
    this.setState({user : value })
  }

  getContext = () => {
    
    return {
      ...this.state, ...{
        store: this.store,
        PushMessaging: this.PushMessaging,
        setUser: this.setUser,
        setAppBarContentNode: this.setAppBarContentNode,
        setAppBarActionsNode: this.setAppBarActionsNode,
       setBannerNode: this.setBannerNode
      }
    }
  }

  render() {
    return (
      <AppContext.Provider value={this.getContext()}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContext