import { types, flow, getParentOfType } from "mobx-state-tree";
import db from "../Database/Database";

const Player = types
  .model("Player", {
    id: types.maybe(types.string),
    name: types.string,
    color: "Grey",
    pending: false,
    invitationId: types.maybe(types.string)
  })
  .actions(self => ({
    setDisplayName: name => {
      self.name = name;
    }
  }));

const Puzzle = types
  .model("Puzzle", {
    id: types.identifier,
    ownerId: types.string,
    title: types.string,
    players: types.array(Player),
    percentComplete: 0
  })
  .actions(self => ({
    delete: () => {
      getParentOfType(self, PuzzlesStore).removePuzzle(self);
      return db.leaveGame(self.id);
    }
  }))
  .views(self => ({
    get pendingInvitationId() {
      let playerRecord = self.players.find(x => x.id === db.getCurrentUserId());

      if (playerRecord && playerRecord.pending) {
        return playerRecord.invitationId;
      }

      return null;
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

const PuzzlesStore = types
  .model("PuzzlesStore", {
    puzzles: types.array(Puzzle),
    myTemplates: types.array(Template),
    publicTemplates: types.array(Template),
    initialized: false
  })
  .actions(self => {
    function mapPuzzleData(data) {
      data.sort((x, y) => {
        if (x.percentComplete < 100 && y.percentComplete === 100) {
          return -1;
        } else if (y.percentComplete < 100 && x.percentComplete === 100) {
          return 1;
        } else {
          if (x.lastActivityDate > y.lastActivityDate || !y.lastActivityDate) {
            return -1;
          } else {
            return 1;
          }
        }
      });
      return data.map(x => Puzzle.create(x));
    }
    const fetch = flow(function*(id) {
      if (self.initialized) return;

      yield Promise.all([fetchPuzzles()]);
      self.initialized = true;
    });

    const fetchPuzzles = flow(function*() {
      let data = yield db.getMyPuzzles(self.updatePuzzles);
      self.puzzles = mapPuzzleData(data);
    });

    const updatePuzzles = data => {
      self.puzzles = mapPuzzleData(data);
    };
    const removePuzzle = puzzle => {
      self.puzzles.remove(puzzle);
    };

    const reset = () => {
      self.initialized = false;
      self.puzzles = [];
    };

    const updateUserName = name => {
      if (self.puzzles) {
        const currentUserId = db.getCurrentUserId();
        for (const puzzle of self.puzzles) {
          puzzle.players.forEach(player => {
            if (player.id === currentUserId) {
              player.setDisplayName(name);
            }
          });
        }
      }
    };

    return {
      fetch,
      updatePuzzles,
      removePuzzle,
      reset,
      updateUserName
    };
  })
  .views(self => ({
    get pendingInvitations() {
      return self.puzzles.filter(x => x.pendingInvitationId);
    },
    get activePuzzles() {
      return self.puzzles.filter(x => !x.pendingInvitationId);
    },
    get templates() {
      return self.myTemplates.concat(
        self.publicTemplates.filter(x => x.ownerId !== db.getCurrentUserId())
      );
    }
  }));

export default PuzzlesStore;
