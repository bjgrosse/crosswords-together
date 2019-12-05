import React, { useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { observer } from 'mobx-react'
import PuzzleStore from 'Stores/PuzzleStore'
import AppContext from 'AppFrame/AppContext'
import Button from '@material-ui/core/Button';
import Puzzle from '../CrosswordPuzzle/CrosswordPuzzle'
import LoadingContainer from 'AppFrame/LoadingContainer';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import AppDialog from 'AppFrame/AppDialog'
import AppFrameConfig from 'AppFrame/AppFrameConfig'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Div } from 'UI/StyledComponents/StyledComponents'
import { IconButton } from 'UI/MaterialComponents/MaterialComponents'
import { AppBarTitle } from 'Theme/AppFrameComponents'


const EditTemplate = props => {

    const titleRef = useRef()
    const notesRef = useRef()
    const sourceRef = useRef()
    const levelRef = useRef()
    const storeRef = useRef()

    const history = useHistory()

    const isInitialized = useRef()

    let { id, rows, columns } = useParams()
    const [loadingPromise, setLoadingPromise] = useState()
    const [editInfoOpen, setEditInfoOpen] = useState(false)
    const [title, setTitle] = useState('New puzzle')
    const [source, setSource] = useState()
    const [notes, setNotes] = useState()
    const [level, setLevel] = useState('easy')
    const [puzzle, setPuzzle] = useState()

    const infoValue = useRef([title, source, notes])

    const appContext = useContext(AppContext)

    const handleSave = () => {
        let store = storeRef.current;
        let data = { title: title, source: source || '', notes: notes || '', level: level }

        let promise = puzzle.saveTemplate(data).then(() => {
            appContext.popContextBar();

            if (props.onSaved) {
                props.onSaved(puzzle.template)
            } else {
                history.push("/")
            }
        })
        setLoadingPromise(promise);
    }

    function handleEditInfoClick() {
        setEditInfoOpen(true)
    }

    function handleCancelEditInfo() {
        setEditInfoOpen(false)
    }

    function handleSaveInfo() {
        setTitle(titleRef.current.value)
        setSource(sourceRef.current.value)
        setNotes(notesRef.current.value)
        setLevel(levelRef.current.value)
        setEditInfoOpen(false)
    }


    useEffect(() => {
        let store = PuzzleStore.create();

        //
        // We either have a template id coming to us in the route
        if (id) {
            setLoadingPromise(store.fetchFromTemplate(id).then(()=> setPuzzle(store.puzzle)))

            // Or we should have the dimensions for a new template
            // in the location state
        } else {
            store.createNewPuzzle(Number(rows), Number(columns))
            setPuzzle(store.puzzle)
        }
    }, [])

    // useEffect(() => {
    //     if (!isInitialized.current) {
    //         isInitialized.current = true
    //         appContext.pushContextBar({ items: [saveButton] })
    //     } else {
    //         //appContext.updateContextBar({ text: titleInput(title.value), items: [saveButton] })
    //     }
    // }, [title])

    return (
        <>
            <LoadingContainer isLoadingPromise={loadingPromise}>
                {puzzle ?
                    // <Div flex column>
                    <Puzzle puzzle={puzzle} />

                    // </Div>
                    :
                    <div />
                }
            </LoadingContainer>
            {editInfoOpen &&
                <AppDialog
                    handleCancel={handleCancelEditInfo}
                    handleSave={handleSaveInfo}
                    open={true}
                    title="Edit new puzzle info">
                    <TextField label="Title" inputRef={titleRef} defaultValue={title} fullWidth />
                    <TextField label="Source" inputRef={sourceRef} defaultValue={source} fullWidth />
                    <TextField label="Notes" inputRef={notesRef} defaultValue={notes} fullWidth />
                    <FormControl>
                        <InputLabel htmlFor="select-level">Level</InputLabel>
                        <Select
                            native
                            inputRef={levelRef}
                            defaultValue={level}
                            inputProps={{
                                name: 'level',
                                id: 'select-level',
                            }}
                        >
                            <option value="beginner">beginner</option>
                            <option value="easy">easy</option>
                            <option value="medium">medium</option>
                            <option value="hard">hard</option>
                            <option value="expert">expert</option>
                        </Select>
                    </FormControl>
                </AppDialog>
            }
            <AppFrameConfig
                appBarContent={
                    <AppBarTitle>
                        {title}
                        <IconButton size="small" onClick={handleEditInfoClick} ><EditIcon size="small" /></IconButton>
                    </AppBarTitle>
                }
                appBarActions={
                    <Button onClick={handleSave} mr={[.5, 1]}>Save</Button>
                }
            />
        </>
    );
}

export default EditTemplate;