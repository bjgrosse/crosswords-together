import database from '../Database/Database'
import PuzzleStore from './PuzzleStore'

jest.mock('../Database/Database')

const testPuzzle = {
    id: 'test',
    ownerId: 'player1',
    title: 'Title',
    templateId: 'testTemplateId',
    playerIds: ['player1', 'player2'],
    players: [{ id: 'player1', name: 'Player 1' }, { id: 'player2', name: 'Player 2' }],
    squares: {
        "0|1": {value: "T", userId: "player1"},
        "0|2": {value: "E", userId: "player1"},
        "0|3": {value: "S", userId: "player1"},
    }
}

const testTemplate = {
    id: 'testTemplateId',
    ownerId: 'testOwnerId',
    title: 'Title',
    squares: '~0000|00000|00000|00000|0000~',
    size: '5x6',
    dateAdded: Date.now(),
    level: 'easy',
    cluesAcross: {
        1: '1 across',
        5: '5 across',
        6: '6 across',
        7: '7 across',
        8: '8 across'
    },
    cluesDown: {
        1: '1 down',
        2: '2 down',
        3: '3 down',
        4: '4 down'
    }
}


database.getPuzzle.mockResolvedValue(testPuzzle);
database.getPuzzleTemplate.mockResolvedValue(testTemplate);
database.getCurrentUserId.mockReturnValue('player1')
database.saveCompletedWord.mockResolvedValue(undefined);

jest.useFakeTimers()

test.only('word completion', async () => {

    database.saveCompletedWord.mockClear()

    let store = PuzzleStore.create();
    await store.fetch('test')
    let puzzle = store.puzzle;
    console.log(puzzle.wordsAcross()[0].cells)

    let word = puzzle.wordsDown()[3];
    store.puzzle.selectWord(word)

    // Writing this cell will complete 
    // 1 across.
    puzzle.selectCell(word.cells[0])
    puzzle.setCellValue("T")

    expect(database.saveCompletedWord.mock.calls.length).toBe(0)
    // AFter times, should have seen one call to saveCompletedWord
    jest.runAllTimers();
    expect(database.saveCompletedWord.mock.calls.length).toBe(1)

    
    puzzle.selectCell(word.cells[1])
    puzzle.setCellValue("E")
    
    puzzle.selectCell(word.cells[2])
    puzzle.setCellValue("S")

    expect(database.saveCompletedWord.mock.calls.length).toBe(1)
   
    puzzle.selectCell(word.cells[3])
    puzzle.setCellValue("T")

    
    expect(database.saveCompletedWord.mock.calls.length).toBe(1)
    jest.runAllTimers();
    expect(database.saveCompletedWord.mock.calls.length).toBe(2)


})

test('should fetch puzzle', async () => {

    let store = PuzzleStore.create();
    await store.fetch('test')

    expect(store.puzzle.wordsAcross()[0].clue).toBe(testTemplate.cluesAcross[1])
})