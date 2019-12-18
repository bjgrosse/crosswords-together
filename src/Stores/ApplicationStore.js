import { types, flow } from "mobx-state-tree";
import GetTheme from "Theme/Theme";
import db from "Database";
import PuzzlesStore from "./PuzzlesStore";

const User = types.model("User", {
  displayName: types.maybe(types.string),
  email: types.maybe(types.string),
  preferredColors: types.maybe(types.array(types.string)),
  isAdmin: false
});

const GetUseLightTheme = function() {
  const setting = window.localStorage.getItem("useLightTheme");

  if (setting === null) {
    return !window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return setting === "1";
};

const ApplicationStore = types
  .model("ApplicationStore", {
    user: types.maybe(User),
    useLightTheme: GetUseLightTheme(),
    puzzlesStore: types.maybe(PuzzlesStore)
  })
  .actions(self => {
    function afterCreate() {
      self.puzzlesStore = PuzzlesStore.create();
    }

    const updateUser = userData => {
      self.user = User.create(userData);
    };

    const setUser = flow(function*(user) {
      if (!user) {
        self.user = undefined;
        if (self.puzzlesStore) self.puzzlesStore.reset();
      } else {
        self.updateUser(yield db.getUser(user.uid, self.updateUser));
      }
    });

    const saveSettings = flow(function*(settings) {
      const nameChanged = settings.displayName !== self.user.displayName;
      self.user = { ...self.user, ...settings };

      if (self.puzzlesStore && nameChanged) {
        self.puzzlesStore.updateUserName(self.user.displayName);
      }

      yield db.saveUser(settings);
    });

    const setUseLightTheme = value => {
      self.useLightTheme = value;
      window.localStorage.setItem("useLightTheme", value ? "1" : "0");
    };

    return { setUser, saveSettings, setUseLightTheme, updateUser, afterCreate };
  })
  .views(self => ({
    get Theme() {
      return GetTheme(self.useLightTheme);
    },

    get Test() {
      return self.useLightTheme ? "yes" : "no";
    }
  }));

export default ApplicationStore;
