import { types, flow, getParentOfType } from "mobx-state-tree";
import db from "../Database/Database";
import { observable } from "mobx";

const Filter = types
  .model("Filter", {
    title: types.string,
    selected: types.array(types.string),
    items: types.array(types.string),
    valuePath: types.string,
    populateItems: false
  })
  .actions(self => ({
    toggleFilter(value) {
      let list = self.selected;

      if (value === ALL) {
        self.selected = [ALL];
        return;
      }

      if (list.includes(value)) {
        list.remove(value);
      } else {
        list.push(value);
      }

      if (list.includes(ALL) && list.length > 1) {
        list.remove(ALL);
      } else if (list.length === 0) {
        list.push(ALL);
      }
    }
  }))
  .views(self => ({
    match(item) {
      return (
        self.selected.includes(ALL) ||
        self.selected.includes(item[self.valuePath])
      );
    }
  }));

const Template = types.model("Template", {
  id: types.string,
  title: types.string,
  ownerId: types.string,
  public: false,
  source: types.maybe(types.string),
  notes: types.maybe(types.string),
  size: types.string,
  level: types.string,
  dateAdded: types.Date
});

const ALL = "all";

const TemplatesStore = types
  .model("TemplatesStore", {
    myTemplates: types.array(Template),
    publicTemplates: types.array(Template),
    usedTemplateIds: types.array(types.string),
    initialized: false,
    filters: types.array(Filter)
  })
  .extend(self => {
    const afterCreate = () => {
      self.filters.push({
        title: "Levels",
        valuePath: "level",
        selected: [ALL],
        items: [ALL, "beginner", "easy", "medium", "hard", "expert"]
      });
      self.filters.push({
        title: "Sources",
        valuePath: "source",
        selected: [ALL],
        populateItems: true
      });
      self.filters.push({
        title: "Sizes",
        valuePath: "size",
        selected: [ALL],
        populateItems: true
      });
    };
    function mapTemplateData(data) {
      return data.map(x => Template.create(x));
    }
    const fetch = flow(function*(id) {
      console.log("fetch");
      if (self.initialized) return;
      yield Promise.all([
        fetchUsedTemplateIds(),
        fetchMyTemplates(),
        fetchPublicTemplates()
      ]);
      populateFilters();
      self.initialized = true;
    });
    const fetchUsedTemplateIds = flow(function*() {
      self.usedTemplateIds = yield db.getUsedTemplateIds(
        self.updateUsedTemplateIds
      );
    });
    const fetchMyTemplates = flow(function*() {
      let templateData = yield db.getMyTemplates(self.updateMyTemplates);
      self.myTemplates = mapTemplateData(templateData);
    });
    const fetchPublicTemplates = flow(function*() {
      let templateData = yield db.getPublicTemplates(
        self.updatePublicTemplates
      );
      self.publicTemplates = mapTemplateData(templateData);
    });

    const updatePublicTemplates = data => {
      self.publicTemplates = mapTemplateData(data);
      populateFilters();
    };
    const updateUsedTemplateIds = data => {
      self.usedTemplateIds = data;
    };
    const updateMyTemplates = data => {
      self.myTemplates = mapTemplateData(data);
      populateFilters();
    };

    function populateFilters() {
      for (let filter of self.filters) {
        if (filter.populateItems) {
          let result = [
            ...new Set(self.templates.map(x => x[filter.valuePath]))
          ];
          result.unshift(ALL);
          filter.items = result;
        }
      }
    }

    let actions = {
      afterCreate,
      fetch,
      updateMyTemplates,
      updatePublicTemplates,
      updateUsedTemplateIds
    };

    let views = {
      get templates() {
        return self.myTemplates.concat(
          self.publicTemplates.filter(x => x.ownerId !== db.getCurrentUserId())
        );
      },
      get filteredTemplates() {
        let result = self.templates.filter(x => {
          return (
            self.filters.every(filter => filter.match(x)) &&
            !self.usedTemplateIds.includes(x.id)
          );
        });
        result.sort((x, y) => (x.dateAdded > y.dateAdded ? -1 : 0));
        return result;
      }
    };

    return { actions: actions, views: views };
  });

export default TemplatesStore;
