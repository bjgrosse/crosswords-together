import { types, flow } from 'mobx-state-tree'
import db from '../Database/Database'

const PuzzleClue = types.model('PuzzleClue', {
    number: types.integer,
    value: types.string,
})

const PuzzleTemplate = types.model('PuzzleTemplate', {
    id: types.string,
    title: types.string,
    ownerId: types.string,
    notes: types.string,
    cluesAcross: types.array(PuzzleClue),
    cluesDown: types.array(PuzzleClue)
}).actions(self => ({
    fetch: flow(function* fetchPuzzleTemplate(id) {
        self.state = "loading"

        try {
            let template = yield db.getPuzzleTemplate(id)

            self.id = template.id
            self.title = template.title
            self.ownerId = template.ownerId
            self.notes = template.notes
            // cluesAcross = template.

        } catch (error) {
            console.error("Failed to fetch projects", error)
            self.state = "error"
        }
    })

}))

const Cell = types.model('Cell', {
    id: types.identifier,
    rowIdx: types.integer,
    cellIdx: types.integer,
    value: types.maybeNull(types.string),
    isBlocked: false,
    number: types.maybeNull(types.number),
    isSelected: false,
    isFocused: false,
    horizontalWord: types.maybeNull(types.string),
    verticalWord: types.maybeNull(types.string),
    userId: types.maybeNull(types.string),
    selectedDirectly: false
}).actions(self => {
    function update(data) {
        self.value = data.value;
        self.user = data.userId;
    }

    return { update }
})

const Row = types.model('Row', {
    cells: types.array(Cell)
})

const Word = types.model('Word', {
    id: types.identifier,
    number: types.number,
    clue: types.string,
    isSelected: false,
    cells: types.array(types.reference(Cell))
}).actions(self => {
    function setSelected(value) {
        self.isSelected = value
        self.cells.forEach(x => x.isSelected = value);
    }

    return { setSelected }
})


const Player = types.model('Player', {
    id: types.identifier,
    name: types.string,
    color: 'Grey',
    pending: false,
    invitationId: types.maybe(types.string)
})

const Invitation = types.model('Invitation', {
    id: types.identifier,
    accepted: false,
    declined: false,
    senderId: types.string,
    puzzleId: types.string
})

const Puzzle = types.model('Puzzle', {
    id: types.identifier,
    ownerId: types.string,
    title: types.string,
    squares: types.array(Row),
    focusedCell: types.maybe(types.reference(Cell)),
    words: types.map(Word),
    selectedWord: types.maybe(types.reference(Word)),
    players: types.array(Player),
    pendingInvitationId: types.maybe(types.string)
}).actions(self => {
    function selectCell(cell, selectedDirectly) {
        if (cell.isBlocked) return

        if (self.focusedCell && self.focusedCell !== cell) {
            self.focusedCell.isFocused = false;
        }

        if (selectedDirectly) {
            let newSelectedWord;
            let currentWordId = self.selectedWord ? self.selectedWord.id : null
            // Only change the selected word if we're selecting a cell that's already focused
            // indicating the user wants to toggle directions, or the cell is outside the current word
            if (cell.isFocused || (cell.horizontalWord !== currentWordId && cell.verticalWord !== currentWordId)) {
                if (cell.horizontalWord && currentWordId !== cell.horizontalWord) {
                    newSelectedWord = cell.horizontalWord;
                } else {
                    newSelectedWord = cell.verticalWord;
                }
            }

            if (newSelectedWord) {
                let word = self.words.get(newSelectedWord)
                if (self.selectedWord) self.selectedWord.setSelected(false);
                word.setSelected(true);
                self.selectedWord = word;
            }
        }
        cell.isFocused = true;
        cell.selectedDirectly = selectedDirectly;
        self.focusedCell = cell;
    }

    function selectWord(word) {
        if (self.selectedWord) self.selectedWord.setSelected(false);
        word.setSelected(true);
        self.selectedWord = word;
        self.selectCell(word.cells[0], false);
    }

    function setCellValue(value) {
        let { rowIdx, cellIdx } = self.focusedCell;
        self.focusedCell.value = value;
        db.saveSquareValue(self.id, rowIdx, cellIdx, value);
    }


    function addPlayer(email) {
        db.addPlayer(self.id, email);
    }

    return {
        selectCell,
        selectWord,
        setCellValue,
        addPlayer
    }
}).views(self => ({
    wordsByDirection(dir) {
        let result = [];
        self.words.forEach(word => {
            if (word.id.startsWith(dir)) {
                result.push(word);
            }
        })
        return result
    },
    wordsAcross() {
        return self.wordsByDirection('h')
    },
    wordsDown() {
        return self.wordsByDirection('v')
    }
}))

function CreatePuzzleSquares(puzzle, template) {
    let data = template.squares;
    let rows = []
    let rowIdx = -1;
    let words = {};

    const processWord = (word, cell) => {
        if (word) {
            if (!words[word]) {
                let num = parseInt(word.substr(1))
                let clue;

                if (word.startsWith('h')) {
                    clue = template.cluesAcross[num];
                } else {
                    clue = template.cluesDown[num];
                }
                words[word] = { id: word, number: num, clue: clue, cells: [] }
            }

            words[word].cells.push(cell.id)
        }
    }

    for (const line of data.split('|')) {

        rowIdx++;
        let cells = [];
        let cellIdx = -1;
        for (const item of line) {
            cellIdx++;

            let value = null;

            if (puzzle && puzzle.squares) {
                value = puzzle.squares[rowIdx + '|' + cellIdx];
            }
            cells.push({
                id: `${rowIdx}|${cellIdx}`,
                rowIdx: rowIdx,
                cellIdx: cellIdx,
                value: value ? value.value : null,
                isBlocked: item === '~',
                number: null,
                isSelected: false,
                isFocused: false,
                horizontalWord: null,
                verticalWord: null
            });
        }

        if (cells.length > 0) {
            rows.push(cells);
        }
    }

    let wordIdx = 0;
    rowIdx = -1;
    for (const row of rows) {
        rowIdx++;

        let cellIdx = -1;

        for (const cell of row) {
            cellIdx++;

            if (!cell.isBlocked) {

                // If this is the first open cell in the row,
                // and it is followed by an open cell,
                // then it starts a new horizonal word
                if ((cellIdx === 0 || row[cellIdx - 1].isBlocked) && cellIdx < row.length - 1 && !row[cellIdx + 1].isBlocked) {
                    cell.number = wordIdx + 1
                    cell.horizontalWord = 'h' + cell.number
                } else if (cellIdx > 0 && !row[cellIdx - 1].isBlocked) {
                    cell.horizontalWord = row[cellIdx - 1].horizontalWord;
                }


                // If this is the first open cell in the row,
                // and it is followed by an open cell,
                // then it starts a new vertical word
                if ((rowIdx === 0 || rows[rowIdx - 1][cellIdx].isBlocked) && rowIdx < rows.length - 1 && !rows[rowIdx + 1][cellIdx].isBlocked) {
                    cell.number = cell.number || wordIdx + 1
                    cell.verticalWord = 'v' + cell.number
                } else if (rowIdx > 0 && !rows[rowIdx - 1][cellIdx].isBlocked) {
                    cell.verticalWord = rows[rowIdx - 1][cellIdx].verticalWord;
                }

                processWord(cell.horizontalWord, cell)
                processWord(cell.verticalWord, cell)

                wordIdx = cell.number || wordIdx;
            }
        }
    }

    return [rows.map(row => Row.create({ cells: row.map(cell => Cell.create(cell)) })), words];
}


const PuzzleStore = types.model('PuzzleStore', {
    puzzle: types.maybe(Puzzle)
}).actions(self => {
    const fetch = flow(function* (id) {

        let puzzleData = yield db.getPuzzle(id, self.updatePuzzle)
        let templateData = yield db.getPuzzleTemplate(puzzleData.templateId)
        let [squares, words] = CreatePuzzleSquares(puzzleData, templateData)
        let puzzle = Puzzle.create({
            id: id,
            ownerId: puzzleData.ownerId,
            title: templateData.title,
            squares: squares,
            words: words,
            players: puzzleData.players.map(x => Player.create(x))
        })

        self.puzzle = puzzle;

        // The action will return a promise that resolves to the returned value
        // (or rejects with anything thrown from the action)
        return puzzle
    })

    function updatePuzzle(puzzleData) {
        if (!self.puzzle) return;

        for (const cellId in puzzleData.squares) {
            let [rowIdx, cellIdx] = cellId.split("|");
            console.log("updating cell: ", rowIdx, cellIdx)
            self.puzzle.squares[rowIdx].cells[cellIdx].update(puzzleData.squares[cellId]);
        }
    }
    return { fetch, updatePuzzle }
})


export default PuzzleStore;