import { types, flow, getParentOfType } from 'mobx-state-tree'
import db from '../Database/Database'
import { thisExpression } from '@babel/types'
import colors from '../common/colors'

const GetRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)]
}
const TemplateSquare = types.model('TemplateSquare', {
    isBlocked: false,
    value: types.maybe(types.string)
})
const TemplateRow = types.model('TemplateRow', {
    cells: types.array(TemplateSquare)
})
const PuzzleTemplate = types.model('PuzzleTemplate', {
    id: types.string,
    title: types.string,
    ownerId: types.string,
    public: false,
    notes: types.maybe(types.string),
    cluesAcross: types.map(types.string),
    cluesDown: types.map(types.string),
    squares: types.maybe(types.array(types.array(TemplateRow))),
    dateAdded: types.Date,
    size: types.string
})

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
    selectedDirectly: false,
    scrollTo: false
}).actions(self => {
    function update(data) {
        self.value = data.value;
        self.userId = data.userId;
    }
    return { update }
}).views(self => ({
    get playerColor() {
        let result
        if (self.userId) {
            let parent = getParentOfType(self, Puzzle);
            let player = parent.players.find(x => x.id === self.userId)
            result = player ? player.color : null
        }

        return result
    }
}))

const Word = types.model('Word', {
    id: types.identifier,
    number: types.number,
    clue: types.maybe(types.string),
    isSelected: false,
    cells: types.array(types.reference(Cell))
}).actions(self => {
    function setSelected(value) {
        self.isSelected = value
        self.cells.forEach(x => x.isSelected = value);
    }
    function setClue(value) {
        self.clue = value
    }
    return { setSelected, setClue }
}).views(self => ({
    get isCompleted() {
        return !self.cells.find(x=>!x.value)
    }
}))


const Player = types.model('Player', {
    id: types.maybe(types.string),
    name: types.string,
    color: 'Grey',
    pending: false,
    invitationId: types.maybe(types.string)
}).views(self => ({
    get isCurrentUser() {
        return self.id === db.getCurrentUserId();
    }
}))

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
    notes: types.maybe(types.string),
    editMode: false,
    isNew: false,
    squares: types.array(types.array(Cell)),
    focusedCell: types.maybe(types.reference(Cell)),
    words: types.map(Word),
    selectedWord: types.maybe(types.reference(Word)),
    players: types.array(Player),
    template: PuzzleTemplate
}).actions(self => {
    function selectCell(cell, selectedDirectly, preferVertical) {
        if (cell.isBlocked) return

        if (self.focusedCell && self.focusedCell !== cell) {
            self.focusedCell.isFocused = false;
            self.focusedCell.valueJustSet = false;
        }

        if (selectedDirectly) {
            let newSelectedWord;
            let currentWordId = self.selectedWord ? self.selectedWord.id : null
            // Only change the selected word if we're selecting a cell that's already focused
            // indicating the user wants to toggle directions, or the cell is outside the current word
            if (cell.isFocused || !currentWordId || (cell.horizontalWord !== currentWordId && cell.verticalWord !== currentWordId)) {
                // If we have the horizontal word already selected, or we're instructed to 
                // select the vertical word by default and we don't already have the vertical word selected..
                if (currentWordId == cell.horizontalWord || !cell.horizontalWord || (preferVertical && currentWordId !== cell.verticalWord)) {
                    newSelectedWord = cell.verticalWord;

                } else {
                    newSelectedWord = cell.horizontalWord;
                }
            }

            if (newSelectedWord) {
                let word = self.words.get(newSelectedWord)
                if (self.selectedWord) self.selectedWord.setSelected(false);
                word.setSelected(true);
                word.selectedDirectly = false;
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
        word.selectedDirectly = true;
        self.selectedWord = word;
        word.cells[0].scrollTo = true;
        self.selectCell(word.cells[0], false);
    }

    function setCellValue(value) {
        let { rowIdx, cellIdx } = self.focusedCell;
        if (value !== self.focusedCell.value) {
            self.focusedCell.value = value;
            self.focusedCell.valueJustSet = true 
            self.focusedCell.userId = db.getCurrentUserId();

            // Only save cell value if we're not in template editing mode
            if (!self.editMode) {
                db.saveSquareValue(self.id, rowIdx, cellIdx, value, self.getPercentComplete());
            }
        }
    }

    const startPuzzle = flow(function* () {
        let data = {
            templateId: self.template.id,
            ownerId: self.ownerId,
            title: self.template.title,
            players: self.players.map(x => ({ id: x.id, name: x.name, color: x.color })),
            playerIds: self.players.map(x => x.id)
        }

        yield db.savePuzzle(self.id, data)

        self.isNew = false;
    })

    function toggleCellBlocked(cell) {
        if (self.selectedWord) {
            if (self.focusedCell) {
                self.focusedCell.isFocused = false;
                self.focusedCell = undefined;
            }

            self.selectedWord.setSelected(false);
            self.selectedWord = undefined;
        }
        cell.isBlocked = !cell.isBlocked;
        self.initializeWords();

    }
    function addPlayer(email) {
        db.addPlayer(self.id, email);
    }

    function saveTemplate(data) {
        const cluesAcross = {}
        const cluesDown = {}
        for (const word of self.wordsAcross()) {
            cluesAcross[word.number] = word.clue;
        }
        for (const word of self.wordsDown()) {
            cluesDown[word.number] = word.clue;
        }



        let templateData = {
            title: self.template.title,
            notes: self.template.notes,
            ownerId: self.template.ownerId,
            public: self.template.public,
            cluesAcross: cluesAcross,
            cluesDown: cluesDown,
            dateAdded: self.template.dateAdded,
            size: self.template.size,
            squares: self.squares.map(row => row.map(cell => cell.isBlocked ? "~" : cell.value || "0").join('')).join('|')
        }

        templateData = { ...templateData, ...data }
        console.log("saving template", templateData)
        return db.saveTemplate(self.template.templateId, templateData, id => { self.template.id = id });

    }

    function initializeWords() {
        let words = {};
        let template = self.template
        let rows = self.squares

        const processWord = (word, cell) => {
            if (word) {
                if (!words[word]) {
                    let num = word.substr(1)
                    let clue;

                    if (word.startsWith('h')) {
                        clue = template.cluesAcross.get(num) || '';
                    } else {
                        clue = template.cluesDown.get(num) || '';
                    }
                    words[word] = { id: word, number: parseInt(num), clue: clue, cells: [] }
                }

                words[word].cells.push(cell.id)
            }
        }

        let wordIdx = 0;
        let rowIdx = -1;
        for (const row of rows) {
            rowIdx++;

            let cellIdx = -1;

            for (const cell of row) {
                cellIdx++;

                if (!cell.isBlocked) {
                    cell.number = null;

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
                } else {
                    cell.number = null
                }
            }
        }

        self.words = words;
    }

    return {
        selectCell,
        selectWord,
        setCellValue,
        toggleCellBlocked,
        addPlayer,
        initializeWords,
        saveTemplate,
        startPuzzle
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
    },
    get canManagePlayers() {
        return self.isNew === false && self.ownerId === db.getCurrentUserId()
    },
    get canInvitePlayers() {
        return self.isNew === false && !self.pendingInvitationId
    },
    getPercentComplete() {
        const countCells = (shouldCount) => {
            return self.squares.reduce((total, row) => (
                total + row.reduce((total, cell) => total + (shouldCount(cell) ? 1 : 0), 0)
            ), 0)
        }
        let total = countCells(cell => !cell.isBlocked)
        let completed = countCells(cell => cell.value)
        return completed / total * 100
    },
    get pendingInvitationId() {
        let playerRecord = self.players.find(x => x.id === db.getCurrentUserId())

        if (playerRecord && playerRecord.pending) {
            return playerRecord.invitationId
        }
    }
}))


function CreatePuzzleSquares(puzzle, template) {
    let data = template.squares;
    let rows = []
    let rowIdx = -1;

    for (const line of data) {

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
                isBlocked: item.isBlocked,
                number: null,
                isSelected: false,
                isFocused: false,
                horizontalWord: null,
                verticalWord: null,
                userId: value ? value.userId : null,
            });
        }

        if (cells.length > 0) {
            rows.push(cells);
        }
    }

    return rows //.map(row => Row.create({ cells: row.map(cell => Cell.create(cell)) }))
}


const PuzzleStore = types.model('PuzzleStore', {
    puzzle: types.maybe(Puzzle),
    invitation: types.maybe(Invitation)
}).actions(self => {
    function createNewPuzzle(rowCount, columnCount) {
        let rows = [...Array(rowCount)].map(() => (
            [...Array(columnCount)].map(() => ({}))
        ))

        let templateData = {
            id: '',
            title: '',
            notes: '',
            ownerId: db.getCurrentUserId(),
            squares: rows,
            size: `${rowCount}x${columnCount}`,
            dateAdded: Date.now(),
            cluesAcross: {},
            cluesDown: {}
        }

        let template = PuzzleTemplate.create(templateData)
        let puzzleData = {
            id: '',
            title: '',
            editMode: true,
            ownerId: db.getCurrentUserId(),
            template: template,
            squares: CreatePuzzleSquares({}, templateData)
        }

        let puzzle = Puzzle.create(puzzleData)
        puzzle.initializeWords();

        self.puzzle = puzzle
    }

    const loadTemplateData = async (id) => {
        let templateData = await db.getPuzzleTemplate(id)

        if (typeof templateData.squares === 'string') {
            let rows = []
            for (const line of templateData.squares.split('|')) {
                let row = []
                for (const item of line) {
                    row.push({ isBlocked: item === '~' })
                }
                rows.push(row);
            }
            templateData.squares = rows;
        }

        return templateData
    }

    const fetchFromTemplate = flow(function* (id) {

        let user = db.getCurrentUser()
        let puzzleData = {
            id: db.getNewPuzzleId(),
            ownerId: db.getCurrentUserId(),
            players: [{ id: user.uid, name: user.displayName, color: GetRandomColor() }]
        }

        let templateData = yield loadTemplateData(id)

        let puzzle = Puzzle.create({
            id: id,
            ownerId: puzzleData.ownerId,
            title: templateData.title,
            isNew: true,
            squares: CreatePuzzleSquares(puzzleData, templateData),
            players: puzzleData.players.map(x => Player.create(x)),
            template: PuzzleTemplate.create(templateData)
        })

        puzzle.initializeWords();

        self.puzzle = puzzle;

        // The action will return a promise that resolves to the returned value
        // (or rejects with anything thrown from the action)
        return puzzle
    })

    const fetch = flow(function* (id) {

        let puzzleData = yield db.getPuzzle(id, self.updatePuzzle)

        let templateData = yield loadTemplateData(puzzleData.templateId)

        // templateData.squares = templateData.squares.map()

        let puzzle = Puzzle.create({
            id: id,
            ownerId: puzzleData.ownerId,
            title: templateData.title,
            squares: CreatePuzzleSquares(puzzleData, templateData),
            players: puzzleData.players.map(x => Player.create(x)),
            template: PuzzleTemplate.create(templateData)
        })

        puzzle.initializeWords();

        if (puzzle.pendingInvitationId && !self.invitation) {
            yield self.fetchInvitation(puzzle.pendingInvitationId)
        }

        self.puzzle = puzzle;

        // The action will return a promise that resolves to the returned value
        // (or rejects with anything thrown from the action)
        return puzzle
    })

    const fetchInvitation = flow(function* (id) {
        self.invitation = Invitation.create({ ...yield db.getInvitation(id), id: id });

        if (!self.puzzle) {
            yield self.fetch(self.invitation.puzzleId)
        }

    })

    function updatePuzzle(puzzleData) {
        if (!self.puzzle) return;
        console.log("updating from database")
        for (const cellId in puzzleData.squares) {
            let [rowIdx, cellIdx] = cellId.split("|");
            console.log("updating cell: ", rowIdx, cellIdx)
            self.puzzle.squares[rowIdx][cellIdx].update(puzzleData.squares[cellId]);
        }

        self.puzzle.players = puzzleData.players.map(x => Player.create(x))
    }

    function acceptInvitation() {
        db.acceptInvitation(self.invitation.id);
        self.invitation.accepted = true;
    }

    return { createNewPuzzle, fetch, fetchFromTemplate, updatePuzzle, fetchInvitation, acceptInvitation }
})

export default PuzzleStore;