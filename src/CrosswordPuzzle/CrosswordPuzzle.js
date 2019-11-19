import React from 'react';
import { observer } from "mobx-react";
import Split from 'react-split';
import MediaQuery from 'react-responsive';
import Debounce from 'lodash.debounce';
import Fab from '@material-ui/core/Fab';
import KeyboardIcon from '@material-ui/icons/Keyboard';

import { Div, Paper } from '../UI/StyledComponents';

import PuzzleBoard from './PuzzleBoard';
import Keyboard from './Keyboard';
import ClueLists from './ClueLists';

import './CrosswordPuzzle.css';

import { safeHandlerWarn } from '../Utility/useSafeHandler'
import HideScrollBars from '../UI/HideScrollBars/HideScrollBars';


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

    getUpdatedSquares(squares, func) {
        return squares.map((row) => {
            return row.map((cell) => {
                return { ...cell, ...func(cell) }
            });
        });
    }

    handleKeyDown = safeHandlerWarn(this, function (e) {
        // Only handle this keystroke if it's coming from the "body"
        // which indicates we're not in an input control somewhere
        if (e.srcElement && e.srcElement.nodeName !== 'BODY') return;

        const { puzzle } = this.props;
        if (!puzzle.selectedWord || !puzzle.focusedCell) return;

        let x = puzzle.focusedCell.cellIdx;
        let y = puzzle.focusedCell.rowIdx;
        let newX = x; let newY = y;
        let focusedCell = puzzle.focusedCell

        let direction = puzzle.selectedWord.id.charAt(0);
        let move = 0;
        let setValue;
        let clearValue;
        let clearTargetCell;
        let selectedDirectly;

        // if we're entering a letter
        if (e.key.length === 1 && e.key.match('[a-zA-Z0-9]')) {
            setValue = e.key.toUpperCase();
            // flag that we should try to move focus to the next square
            move++;
        } else {
            switch (e.key) {
                case 'ArrowLeft':
                    move--;
                    selectedDirectly = true;
                    break;

                case 'ArrowRight':
                    move++;
                    selectedDirectly = true;
                    break;

                case 'Backspace':

                    if (focusedCell.value && (focusedCell.selectedDirectly || focusedCell.valueJustSet)) {
                        clearValue = true;
                    } else {
                        move--;
                        selectedDirectly = true;
                        clearTargetCell = true;
                    }
                    break;
                case 'Delete':
                    move++;
                    selectedDirectly = true;
                    clearValue = true;
                    break;
            }
        }

        if (move !== 0) {
            if (direction === 'h') {
                if (x + move >= 0 && x + move < puzzle.squares[y].length && !puzzle.squares[y][x + move].isBlocked) {
                    newX = x + move;
                }
            } else {
                if (y + move >= 0 && y + move < puzzle.squares.length && !puzzle.squares[y + move][x].isBlocked) {
                    newY = y + move;
                }
            }
        }

        if (clearValue || setValue) {
            puzzle.setCellValue(clearValue ? null : setValue);
        }

        let newCell = puzzle.squares[newY][newX];
        if (!newCell.isFocused) {
            puzzle.selectCell(newCell, selectedDirectly)

            if (clearTargetCell) {
                puzzle.setCellValue(null)
            }
        }
    })

    closeKeyboard = () => this.setState({ isKeyboardOpen: false });

    render() {
        const { puzzle } = this.props
        const noticePopover = this.props.noticePopover && this.props.noticePopover();
        const puzzleBoard = <PuzzleBoard puzzle={this.props.puzzle} />;
        const keyboardFab = !this.state.isKeyboardOpen && puzzle.selectedWord && <Fab className="KeyboardButton" color="primary" size="medium" aria-label="keyboard" onClick={(e) => this.setState({ isKeyboardOpen: !this.state.isKeyboardOpen, keyboardButtonElement: e.currentTarget })} ><KeyboardIcon /></Fab>
        const showKeyboard = puzzle.selectedWord && this.state.isKeyboardOpen;

        const keyboard = showKeyboard &&
            <Keyboard handleKeyDown={this.handleKeyDown} closeKeyboard={this.closeKeyboard} />

        return (
            <>
                <MediaQuery orientation='portrait'>
                    <>
                        <Split direction="vertical" minSize={[150, 200]} style={{
                            display: 'flex',
                            flexFlow: 'column nowrap',
                            width: '100%',
                            height: '100%',
                            alignContent: 'stretch'
                        }}>
                            <Div scroll grow minHeight='150px' relative p="5px" m="-5px">
                                {puzzleBoard}
                                {noticePopover}
                            </Div>
                            <Div column zIndex={2}>

                                <ClueLists puzzle={puzzle} />
                                {showKeyboard && <Div height="125px" />}
                                <Div style={{ position: 'fixed', width: '100%', bottom: '0px', left: '50%', transform: 'translateX(-50%)' }}>
                                    {keyboard}
                                </Div>
                                {keyboardFab}
                            </Div>
                        </Split>
                    </>

                </MediaQuery>

                <MediaQuery orientation='landscape'>
                    <>
                        <Split direction="horizontal" sizes={[66, 34]} style={{
                            display: 'flex',
                            width: '100%',
                            height: '100%',
                            alignContent: 'stretch'
                        }}>
                            <Div grow px={[0, 0, 1, 2]} relative minWidth='330px'>
                                <>
                                    <Div scroll hideScrollBars fullHeight pl="5px" ml="-5px" pt="5px" mt="-5px"  pb="5px" mb="-5px"  pr={[1, 1, 2]}>
                                        {/* <Div as={HideScrollBars} scrollVisible full> */}
                                        {puzzleBoard}
                                        {keyboard && <div style={{ height: '150px' }} />}
                                        {/* </Div> */}
                                    </Div>
                                    <Div style={{ position: 'absolute', width: '100%', maxWidth: '400px', bottom: '0px', left: '50%', transform: 'translateX(-50%)' }}>
                                        {keyboard}
                                    </Div>
                                    {keyboardFab}

                                    {noticePopover}
                                </>
                            </Div>

                            <ClueLists puzzle={puzzle} />
                        </Split>
                    </>
                </MediaQuery>

            </>


        )
    }
}

export default observer(Page);