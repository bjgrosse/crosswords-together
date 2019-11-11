import React, {  useState,  useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import styled from 'styled-components';
import { observer } from 'mobx-react';

import LoadingContainer from '../AppFrame/LoadingContainer';
import { Paper, Div, SubTitle2 } from '../StyledComponents';

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
const Clue = observer(props => {

    let ref = useRef(null)

    useEffect(() => {
        if (props.item.isSelected) {
            ref.current.scrollIntoView(false);
        }
    });

    return (
        <ClueListItem ref={ref} button
            disableRipple
            selected={props.item.isSelected}
            key={props.item.number}
            onClick={() => props.handleSelect(props.item)}>
            <WordNumber>{props.item.number}</WordNumber>
            <Div tableCell fontSize={['0.9rem', '1rem', '1.2rem']}>{props.item.clue}</Div>
        </ClueListItem>
    )
})

const Container = styled(Div)`
    justify-Items: left;
`
const ClueList = styled(Paper)`
    position: relative;
`

const ScrollBox = styled(Div)`
    overflow-y: auto;
    position: absolute;
    left: 3px;
    right: 3px;
    bottom: 3px;
    top: 3px;
`

export default observer(props => {
    const [dialog, updateDialog] = useState({ isDialogOpen: false, isLoading: false });

    const handleClickOpen = () => {
        let data = props.words.map((x) => `${x.number} ${x.clue}`).join('\n');
        updateDialog({ isDialogOpen: true, cluesListEdited: data });

    };
    const handleSave = () => {
        let lastWord;
        for (const line of dialog.cluesListEdited.split('\n')) {
            if (line.trim() === '') continue;

            let num = line.trim().split(' ', 1)[0];
            if (Number(num).toString() !== num) {
                lastWord.setClue(lastWord.clue + ' ' + line.trim())
            } else {
                let word = props.words.find(x => x.number === Number(num))

                if (!word) {
                    updateDialog({ ...dialog, error: 'Invalid word number: ' + num })
                    return;
                }
                lastWord = word;
                word.setClue(line.substr(num.length).trim());
            }
        }

        handleClose();
        // store.handleSave(props.title, words).then(() => {
        //     updateDialog({ isDialogOpen: false });
        //     updateWords(words);
        // }).catch((err) => {
        //     updateDialog({ ...dialog, ...{ isLoading: false, error: 'Failed to save. Please try again.' } })
        // });
    };
    const handleClose = () => {
        updateDialog({ isDialogOpen: false });
    };

    const handleListChange = (event) => {
        updateDialog({ isDialogOpen: true, cluesListEdited: event.target.value });
    };

    return (
        <>
            <Container column grow >
                {props.showTitle &&
                    <SubTitle2>
                        {props.title}
                    </SubTitle2>
                }
                <ClueList grow relative>
                    <ScrollBox>
                        {props.words.map((x) => (
                            <Clue key={x.number} item={x} handleSelect={props.handleSelectWord} />
                        ))}
                    </ScrollBox>

                    {props.canEdit ?
                        <Div absolute topRight >
                            <IconButton
                                aria-label={`edit ${props.title} list`}
                                size="small"
                                onClick={handleClickOpen}>
                                <EditIcon />
                            </IconButton>
                        </Div>
                        :
                        null
                    }
                </ClueList>
            </Container>
            <Dialog
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
                        <Button onClick={handleClose} color="secondary">
                            Cancel
                    </Button>
                        <Button onClick={handleSave} color="secondary">
                            Save
                    </Button>
                    </DialogActions>
                </LoadingContainer>
            </Dialog>
        </>
    )
})