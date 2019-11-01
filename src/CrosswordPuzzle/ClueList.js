import React, { Fragment, useState, useContext, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import PuzzleContext from '../CrosswordPuzzle/CrosswordPuzzleContext';
import LoadingContainer from '../AppFrame/LoadingContainer';
import {Paper, Div} from '../StyledComponents';

import TextField from '@material-ui/core/TextField';

const ClueListItem = styled(ListItem)`
    && {
        display: table-row;
        vertical-align: top;
        padding: 0px;
    }
`
const WordNumber = styled.div`
    display: table-cell;
    padding-right: 10px;
    font-weight: bold;
    text-align: left;
    align-self: start;
    padding-left: 5px;
`

const WordClue = styled.div`
    display: table-cell;    
    text-align: left;
`
const Clue = observer(props => {

    let { puzzle } = useContext(PuzzleContext);
    let ref = useRef(null)

    useEffect(() => {
        if (props.item.isSelected) {
            ref.current.scrollIntoView(false);
        }
    });

    return (
        <ClueListItem ref={ref} button
            selected={props.item.isSelected}
            key={props.item.number}
            onClick={() => puzzle.selectWord(props.item)}>
            <WordNumber>{props.item.number}</WordNumber>
            <WordClue>{props.item.clue}</WordClue>
        </ClueListItem>
    )
})

const Container = styled(Div)`
    justify-Items: left;
    width: 50%;
    overflow: hidden;
    margin-right: 10px;
`
const ClueList = styled(Paper)`
    position: relative;
`

const ScrollBox = styled(Div)`
    overflow-y: auto;
    padding-bottom: 100px;
    position: absolute;
    left: 3px;
    right: 3px;
    bottom: 3px;
    top: 3px;
`

const Header = styled.div`
    display: flex;
    flex-flow: row nowrap;
    padding: 5px 15px;
    align-items: center;
    font-weight: bold;
    text-align: left;
    color: gray;
`

export default observer(props => {
    const [words, updateWords] = useState(props.words);
    const [dialog, updateDialog] = useState({ isDialogOpen: false });

    const handleClickOpen = () => {
        let data = Object.entries(words).map((x) => `${x[0]} ${x[1]}`).join('\n');
        updateDialog({ isDialogOpen: true, cluesListEdited: data });

    };
    const handleSave = () => {
        let words = {};
        for (const line of dialog.cluesListEdited.split('\n')) {
            if (line.trim === '') continue;

            let num = line.trim().split(' ', 1)[0];
            if (Number(num) != num) {
                updateDialog({ ...dialog, ...{ error: 'Invalid word number: ' + num } })
                return;
            } else {
                words[num] = line.substr(num.length).trim();
            }
        }
        updateDialog({ ...dialog, ...{ isLoading: true } });
        props.handleSave(props.title, words).then(() => {
            updateDialog({ isDialogOpen: false });
            updateWords(words);
        }).catch((err) => {
            updateDialog({ ...dialog, ...{ isLoading: false, error: 'Failed to save. Please try again.' } })
        });
    };
    const handleClose = () => {
        updateDialog({ isDialogOpen: false });
    };

    const handleListChange = (event) => {
        updateDialog({ isDialogOpen: true, cluesListEdited: event.target.value });
    };

    console.log(words)
    return (
        <>
            <Container column>
                <Header>
                    <div>{props.title}</div>
                    {props.canEdit ?
                        <IconButton
                            aria-label={`edit ${props.title} list`}
                            className="ClueList__EditButton"
                            size="small"
                            onClick={handleClickOpen}>
                            <EditIcon />
                        </IconButton>
                        :
                        null
                    }

                </Header>
                <ClueList grow>
                    <ScrollBox>
                        {words.map((x) => (
                            <Clue item={x} />
                        ))}
                    </ScrollBox>
                </ClueList>
            </Container>
            <Dialog
                fullWidth="true"
                open={dialog.isDialogOpen}
                onClose={handleClose}
                aria-labelledby="dialog-title">
                <LoadingContainer isLoading={dialog.isLoading} message="Saving...">
                    <DialogTitle id="dialog-title">Edit {props.title} clue list</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            error={dialog.error ? true : false}
                            margin="dense"
                            id="clue_list"
                            helperText={dialog.error}
                            value={dialog.cluesListEdited}
                            onChange={handleListChange}
                            multiline
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                    </Button>
                        <Button onClick={handleSave} color="primary">
                            Save
                    </Button>
                    </DialogActions>
                </LoadingContainer>
            </Dialog>
        </>
    )
})