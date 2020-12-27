import { types, flow, getParentOfType, destroy, clone } from "mobx-state-tree";

const Card = types
  .model("ApplicationStore", {
    body: types.string
  })
  .actions(self => {
    const moveLeft = () => {
      let column = getParentOfType(self, Column);
      column.moveCardLeft(self);
    };

    return { moveLeft };
  })
  .views(self => ({
    get canMoveLeft() {
      let board = getParentOfType(self, Board);
      let column = getParentOfType(self, Column);
      return board.columns.indexOf(column) > 0;
    }
  }));
const Column = types
  .model("ApplicationStore", {
    name: types.string,
    color: types.string,
    cards: types.array(Card)
  })
  .actions(self => {
    const moveCardLeft = card => {
      let board = getParentOfType(self, Board);

      let newCard = clone(card);
      destroy(self.cards[self.cards.indexOf(card)]);
      board.columns[board.columns.indexOf(self) - 1].addCard(newCard);
    };

    const addCard = card => {
      self.cards.push(card);
    };
    return { moveCardLeft, addCard };
  });

const Board = types.model("ApplicationStore", {
  columns: types.array(Column)
});

const ApplicationStore = types
  .model("ApplicationStore", {
    board: types.maybe(Board)
  })
  .actions(self => {
    const loadData = data => {
      self.board = Board.create(data);
    };

    return { loadData };
  });
export default ApplicationStore;
