import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react'
import Button from '@material-ui/core/Button';
import SetDimensionsDialog from './SetDimensionsDialog'
import Puzzle from '../CrosswordPuzzle/CrosswordPuzzle'
import PuzzleStore from '../Stores/CrosswordPuzzleStore';
import AppContext from '../AppFrame/AppFrameContext';
import LoadingContainer from '../AppFrame/LoadingContainer';
import AppDialog from '../AppFrame/AppDialog';
import EditTemplate from './EditTemplate';




const CreateNewTemplate = observer(props => {

    const [dialogOpen, setDialogOpen] = useState(true)
    const [dimensions, setDimensions] = useState()
    const history = useHistory();

    function handleSaveDimensions(rows, columns) {
        history.push(`/new-template/${rows}/${columns}`)
        setDialogOpen(false)
    }

    function handleCancel() {        
        setDialogOpen(false)
        props.handleCancel()
    }   


    // if (dimensions) {
    //     return (
    //         <AppDialog contextBar={contextBar}>
    //             <EditTemplate rows={dimensions[0]} columns={dimensions[1]} />
    //         </AppDialog>
    //     )
    // }

    return (
        <div>
            <SetDimensionsDialog open={dialogOpen} handleSave={handleSaveDimensions} handleCancel={handleCancel} />
        </div>
    );
})
export default CreateNewTemplate;