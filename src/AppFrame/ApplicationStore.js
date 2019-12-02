import { types, flow, getParentOfType } from 'mobx-state-tree'


const AppBar = types.model('AppBar', {
    hideAppBar: false,
    showMenu: false,
    showBackButton: false
})

export const ApplicationStore = types.model('ApplicationStore', {
    appBar: types.maybe(AppBar),
    snackBarMessage: types.maybe(types.string),
    pushNotificationsAllowed: false,
    showScrum: false
}).actions(self => {
    function setAppBar(bar) {
        self.appBar = AppBar.create(bar)
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
    
    function setShowScrum(value) {
        self.showScrum = value
    }
    return {
        setAppBar,
        setPushNotificationsAllowed,
        setSnackBarMessage,
        closeSnackBar,
        setShowScrum
    }
}).views(self => ({

}))

export default ApplicationStore

