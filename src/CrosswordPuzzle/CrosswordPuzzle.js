import React, { Fragment } from 'react';
import { observer } from "mobx-react";
import ResizePanel from 'react-resize-panel';
import MediaQuery from 'react-responsive';
import Debounce from 'lodash.debounce';
import Fab from '@material-ui/core/Fab';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import PuzzleContext from '../CrosswordPuzzle/CrosswordPuzzleContext';

import { Div } from '../StyledComponents';

import PuzzleBoard from './PuzzleBoard';
import Keyboard from './Keyboard';
import ClueList from './ClueList';

import './CrosswordPuzzle.css';


class Page extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            puzzle: props.puzzle,
            isSideBarExpanded: false,
            focusedSquareElement: null,
            isKeyboardOpen: true
        }
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeyDown, false);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
    }


  
    // saveClueList = (list, clues) => {
    //     return db.saveClueList(this.props.templateId, list, clues);
    // }

    setFocusedSquareRef = (element) => {
        // if we don't currently have a focused square or we have a focused square 
        // in a new word, then display the keyboard in the right position immediatley
        if (!this.state.focusedSquareElement || this.state.selectedWord !== this.state.keyboardSelectedWord) {
            this.setState({ focusedSquareElement: element, keyboardSelectedWord: this.state.selectedWord })
        } else {
            // otherwise, debounce it so that the keyboard doesn't keep moving as the user
            // is typing
            this.setFocusedSquareRefDelayed(element);
        }

    }

    setFocusedSquareRefDelayed = Debounce((element) => this.setState({ focusedSquareElement: element, keyboardSelectedWord: this.state.selectedWord }), 1000);

    clickSquare = (square) => {

        this.props.puzzle.selectCell(square);
        return;

        if (square.isBlocked) return;
        let selectedWord = this.state.selectedWord;

        // Only change the selected word if we're selecting a cell that's already focused
        // indicating the user wants to toggle directions, or the cell is outside the current word
        if (square.isFocused || (square.horizontalWord !== selectedWord && square.verticalWord !== selectedWord)) {
            if (square.horizontalWord && this.state.selectedWord !== square.horizontalWord) {
                selectedWord = square.horizontalWord;
            } else {
                selectedWord = square.verticalWord;
            }
        }


        let squares = this.getUpdatedSquares(this.state.puzzle.squares, (cell) => ({ isSelected: cell.horizontalWord === selectedWord || cell.verticalWord === selectedWord, isFocused: cell.rowIdx === square.rowIdx && cell.cellIdx === square.cellIdx }));

        this.setState({
            squares: squares,
            selectedWord: selectedWord,
            focusedSquareCellIdx: square.cellIdx,
            focusedSquareRowIdx: square.rowIdx
        });
    }

    getUpdatedSquares(squares, func) {
        return squares.map((row) => {
            return row.map((cell) => {
                return { ...cell, ...func(cell) }
            });
        });
    }

    handleKeyDown = (e) => {

        // Only handle this keystroke if it's coming from the "body"
        // which indicates we're not in an input control somewhere
        if (e.srcElement && e.srcElement.nodeName !== 'BODY') return;

        const { puzzle } = this.context;
        if (!puzzle.selectedWord || !puzzle.focusedCell) return;

        let x = puzzle.focusedCell.cellIdx;
        let y = puzzle.focusedCell.rowIdx;
        let newX = x; let newY = y;

        let direction = puzzle.selectedWord.id.charAt(0);
        let move = 0;
        let setValue;
        let clearValue;

        // if we're entering a letter
        if (e.key.length === 1 && e.key.match('[a-zA-Z0-9]')) {
            setValue = e.key.toUpperCase();
            // flag that we should try to move focus to the next square
            move++;
        } else {
            switch (e.key) {
                case 'ArrowLeft':
                    move--;
                    break;

                case 'ArrowRight':
                    move++;
                    break;

                case 'Backspace':
                    move--;
                    clearValue = true;
                    break;
                case 'Delete':
                    move++;
                    clearValue = true;
                    break;
            }
        }

        if (move !== 0) {
            if (direction === 'h') {
                if (x + move >= 0 && x + move < puzzle.squares[y].cells.length && !puzzle.squares[y].cells[x + move].isBlocked) {
                    newX = x + move;
                }
            } else {
                if (y + move >= 0 && y + move < puzzle.squares.length && !puzzle.squares[y + move].cells[x].isBlocked) {
                    newY = y + move;
                }
            }
        }

        if (clearValue || setValue) {
            puzzle.setCellValue(clearValue ? null : setValue);
        }
        
        let newCell = puzzle.squares[newY].cells[newX];
        if (!newCell.isFocused) {
            puzzle.selectCell(newCell, true)
        }
    }

    closeKeyboard = () => this.setState({ isKeyboardOpen: false });

    render() {
        const { puzzle } = this.context
        console.log(this.state.isKeyboardOpen, this.state.selectedWord);
        const wordLists = [
            { title: "Across", words: puzzle.wordsAcross() },
            { title: "Down", words: puzzle.wordsDown() }
        ]
        const noticePopover = this.props.noticePopover && this.props.noticePopover();
        const puzzleBoard = <PuzzleBoard puzzle={this.props.puzzle} clickSquare={this.clickSquare} focusedSquareRef={this.setFocusedSquareRef} />;
        const keyboardFab = !this.state.isKeyboardOpen && puzzle.selectedWord && <Fab className="KeyboardButton" color="secondary" size="medium" aria-label="keyboard" onClick={(e) => this.setState({ isKeyboardOpen: !this.state.isKeyboardOpen, keyboardButtonElement: e.currentTarget })} ><KeyboardIcon /></Fab>

        const keyboard = puzzle.selectedWord && this.state.isKeyboardOpen &&
            <Keyboard handleKeyDown={this.handleKeyDown} closeKeyboard={this.closeKeyboard} />

        const clues = isPortrait => (
            <ResizePanel direction={isPortrait ? 'n' : 'w'} >
                <Div className="PuzzleClueBar">
                    {wordLists.map(list => <ClueList key={list.title} title={list.title} words={list.words} handleSave={this.saveClueList} canEdit={this.state.isTemplateOwner} />)}
                </Div>
            </ResizePanel >)
        return (
            <MediaQuery orientation='portrait'>
                {(isPortrait) => (
                    <>
                        <div className="PuzzlePageContainer">

                            {isPortrait ?
                                <>
                                    <Div scroll grow minHeight='150px'>
                                        {puzzleBoard}
                                        {noticePopover}
                                    </Div>
                                    <Div column >

                                        {clues(isPortrait)}
                                        {keyboard}
                                        {keyboardFab}
                                    </Div>

                                </>
                                :
                                <>
                                    <Div className="PuzzleBoardContainer" minWidth='360px'>
                                        <>
                                            <Div scroll grow={1}>
                                                {puzzleBoard}
                                                {keyboard && <div style={{ height: '100px' }} />}
                                            </Div>
                                            <div style={{ position: 'absolute', width: 'auto', bottom: '0px', left: '50%', transform: 'translateX(-50%)' }}>
                                                {keyboard}
                                            </div>
                                            {keyboardFab}
                                            
                                            {noticePopover}
                                        </>
                                    </Div>
                                    {clues(isPortrait)}
                                </>
                            }


                        </div>

                    </>
                )}

            </MediaQuery>
        )
    }
}

Page.contextType = PuzzleContext;

export default observer(Page);