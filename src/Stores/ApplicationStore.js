import { types } from 'mobx-state-tree'


const User = types.model('User', {
    displayName: types.string,
    email: types.string,
    preferredColors: types.maybe(types.array(types.string))
})


const ApplicationStore = types.model('ApplicationStore', {
    user: types.maybe(User)
})


export default ApplicationStore;