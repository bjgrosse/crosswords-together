import React from 'react';

const defaultState = {
  contextBar: null,
  user: null,
  appBarContentNode: null,
  appBarActionsNode: null
}

// Make sure the shape of the default value passed to
// createContext matches the shape that the consumers expect!
export const AppContext = React.createContext({
  ...defaultState,
  pushContextBar: (bar) => { },
  updateContextBar: (bar) => { },
  popContextBar: () => { },
  setAppBarContentNode: () => {},
  setAppBarActionsNode: () => {}
});


export class AppContextManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {contextBars: [], }
  }

  pushContextBar = (info) => {
    this.setState(state => { return { contextBars: state.contextBars.concat([info]) } });
  }
  updateContextBar = (info) => {
    this.setState(state => {
      let newList = state.contextBars.slice(0);
      newList[state.contextBars.length] = info;
      return { contextBars: newList }
    });
  }
  popContextBar = (info) => {
    this.setState(state => { return { contextBars: state.contextBars.slice(0, -1) } });
  }
  setAppBarContentNode = (ref) => {
    this.setState( state => {
      if (ref !== state.appBarContentNode) {
        return {appBarContentNode: ref}
      }       
    })
  }
  setAppBarActionsNode = (ref) => {
    this.setState( state => {
      if (ref !== state.appBarActionsNode) {
        return {appBarActionsNode: ref}
      }       
    })
  }

  getContext = () => {
    return {...this.state, ...{
      contextBar: this.state.contextBars[this.state.contextBars.length-1],
      user: this.props.user,
      pushContextBar: this.pushContextBar,
      updateContextBar: this.updateContextBar,
      popContextBar: this.popContextBar,
      setAppBarContentNode: this.setAppBarContentNode,
      setAppBarActionsNode: this.setAppBarActionsNode }
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