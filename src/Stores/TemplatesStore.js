import { types, flow, getParentOfType } from 'mobx-state-tree'
import db from '../Database/Database'

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

const ALL = 'all'

const TemplatesStore = types.model('TemplatesStore', {
    myTemplates: types.array(Template),
    publicTemplates: types.array(Template),
    initialized: false,
    filterSources: types.array(types.string),
    filterLevels: types.array(types.string)
}).extend(self => {

    let usedTemplateIds = [];

    const afterCreate = ()=> {
        if (self.filterSources.length === 0){
            self.filterSources.push(ALL)
        }
        if (self.filterLevels.length === 0){
            self.filterLevels.push(ALL)
        }
    }
    function mapTemplateData(data) {
        return data.map(x => Template.create(x))
    }
    const fetch = flow(function* (id) {
        console.log("fetch")
        if (self.initialized) return
        yield Promise.all([fetchUsedTemplateIds(), fetchMyTemplates(), fetchPublicTemplates()])
        self.initialized = true;
    })
    const fetchUsedTemplateIds = flow(function* () {
        let usedTemplateIds = yield db.getUsedTemplateIds()
    })
    const fetchMyTemplates = flow(function* () {
        let templateData = yield db.getMyTemplates(self.updateMyTemplates)
        self.myTemplates = mapTemplateData(templateData);
    })
    const fetchPublicTemplates = flow(function* () {
        let templateData = yield db.getPublicTemplates(self.updatePublicTemplates)
        self.publicTemplates = mapTemplateData(templateData);
    })

    const updatePublicTemplates = (data) => {
        self.publicTemplates = mapTemplateData(data);
    }
    const updateMyTemplates = (data) => {
        self.myTemplates = mapTemplateData(data);
    }

    let actions = { afterCreate, fetch, updateMyTemplates, updatePublicTemplates }

    let views = {

        get templates() {
            return self.myTemplates.concat(self.publicTemplates.filter(x => x.ownerId !== db.getCurrentUserId()))
        },
        get levels() {
            return [ALL, 'beginner', 'easy', 'medium', 'hard', 'expert']
        },
        get sources() {
            let result = [...new Set(self.templates.map(x => x.source))]
            result.unshift(ALL)
            return result
        },
        get filteredTemplates() {
            return self.templates.filter(x => {
                return (self.filterLevels.includes(ALL) || self.filterLevels.includes(x.level)) &&
                    (self.filterSources.includes(ALL) || self.filterSources.includes(x.source)) &&
                    !usedTemplateIds.includes(x.id)
            })
        }
    }

    return {actions: actions, views: views}
}
)

export default TemplatesStore;