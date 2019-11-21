import { types, flow, getParentOfType } from 'mobx-state-tree'


const AppBar = types.model('AppBar', {
    hideAppBar: false,
    showMenu: false,
    showBackButton: false
})

export const ApplicationStore = types.model('ApplicationStore', {
    appBars: types.array(AppBar),
    snackBarMessage: types.maybe(types.string),
    pushNotificationsAllowed: false
}).actions(self => {
    function pushAppBar(bar) {
        self.appBars.push(bar)
    }

    function popAppBar(bar) {
        self.appBars.pop()
    }

    function setPushNotificationsAllowed (value){
        self.pushNotificationsAllowed = value
    }

    function setSnackBarMessage(value) {
        self.snackBarMessage = value
    }

    function closeSnackBar() {
        self.snackBarMessage = undefined
    }
    return {
        pushAppBar,
        popAppBar,
        setPushNotificationsAllowed,
        setSnackBarMessage,
        closeSnackBar
    }
}).views(self => ({
    get appBar() {
        if (self.appBars.length === 0){
            return null
        }

        return self.appBars[self.appBars.length - 1]
    }
}))

export default ApplicationStore

