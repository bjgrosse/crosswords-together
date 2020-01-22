import { types } from "mobx-state-tree";

const AppBar = types.model("AppBar", {
  hideAppBar: false,
  showMenu: false,
  showBackButton: false
});

export const AppFrameStore = types
  .model("ApplicationStore", {
    appBar: types.maybe(AppBar),
    snackBarMessage: types.maybe(types.string),
    pushNotificationsAllowed: false
  })
  .actions(self => {
    function setAppBar(bar) {
      self.appBar = AppBar.create(bar);
    }

    function setPushNotificationsAllowed(value) {
      self.pushNotificationsAllowed = value;
    }

    function setSnackBarMessage(value) {
      self.snackBarMessage = value;
    }

    function closeSnackBar() {
      self.snackBarMessage = undefined;
    }

    return {
      setAppBar,
      setPushNotificationsAllowed,
      setSnackBarMessage,
      closeSnackBar
    };
  })
  .views(self => ({}));

export default AppFrameStore;
