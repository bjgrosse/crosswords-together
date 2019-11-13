import { types, flow } from 'mobx-state-tree'
import db from '../Database/Database'

const Player = types.model('Player', {
    id: types.maybe(types.string),
    name: types.string,
    color: 'Grey',
    pending: false,
    invitationId: types.maybe(types.string)
})

const Puzzle = types.model('Puzzle', {
    id: types.identifier,
    ownerId: types.string,
    title: types.string,
    players: types.array(Player),
    percentComplete: 0
}).actions(self => ({ 
     acceptInvitation: () => {
        return db.acceptInvitation(self.pendingInvitationId);
    }
    
})).views((self)=> ({
    get pendingInvitationId() {
        let playerRecord = self.players.find(x=> x.id === db.getCurrentUserId())
        
        if (playerRecord && playerRecord.pending) {
            return playerRecord.invitationId
        }
    }
}))

const Template = types.model('Template', {
    id: types.string,
    title: types.string,
    ownerId: types.string,
    public: false,
    source: types.maybe(types.string),
    notes: types.maybe(types.string),
    size: types.string,
    level: types.string,
    dateAdded: types.Date
})


const PuzzlesStore = types.model('PuzzlesStore', {
    puzzles: types.array(Puzzle),
    myTemplates: types.array(Template),
    publicTemplates: types.array(Template),
    initialized: false
}).actions(self => {

    function mapTemplateData(data) {
        return data.map(x => Template.create(x))
    }
    function mapPuzzleData(data) {
        return data.map(x => Puzzle.create(x))
    }
    const fetch = flow(function* (id) {
        if (self.initialized) return


        yield Promise.all([fetchPuzzles(), fetchMyTemplates(), fetchPublicTemplates()])
        self.initialized = true;
    })

    const fetchPuzzles = flow(function* () {
        let data = yield db.getMyPuzzles() //(data => mapPuzzleData(data))
        self.puzzles  = mapPuzzleData(data);
    })
    const fetchMyTemplates = flow(function* () {
        let templateData = yield db.getMyTemplates(data => self.myTemplates = mapTemplateData(data))
        self.myTemplates = mapTemplateData(templateData);
    })
    const fetchPublicTemplates = flow(function* () {
        let templateData = yield db.getPublicTemplates(data => self.publicTemplates = mapTemplateData(data))
        self.publicTemplates = mapTemplateData(templateData);
    })

    return { fetch }
}).views(self => ({
    get pendingInvitations() {
        return self.puzzles.filter(x => x.pendingInvitationId)
    },
    get activePuzzles() {
        return self.puzzles.filter(x => !x.pendingInvitationId)
    },
    get templates() {
        return self.myTemplates.concat(self.publicTemplates)
    }
}))

export default PuzzlesStore;