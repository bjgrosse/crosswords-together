import React, { useContext, useState, useEffect } from 'react';
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import { useHistory } from 'react-router-dom'
import { Div } from '../UI/StyledComponents'
import AddIcon from '@material-ui/icons/AddCircle';
import { IconButton, Button } from '../UI/StyledComponents/MaterialComponents';



export const TestPage1 = props => {
    //let [showMoreData ]
    let history = useHistory()

    return (
<Div column alignStart>
    <Button>Default</Button>
    <Button color="primary">Primary</Button>
    <Button color="secondary" startIcon={<AddIcon />}>Secondary</Button>
    <Button color="primary" startIcon={<AddIcon />}>Primary</Button>
    <Button color="secondary">Secondary</Button>
    <Button color="primary" variant="contained">Primary</Button>
    <Button color="secondary" variant="contained">Secondary</Button>
    <Button color="primary" variant="contained" startIcon={<AddIcon />}>Primary</Button>
    <Button color="secondary" dense variant="contained" startIcon={<AddIcon />}>Secondary</Button>
</Div>
    );
}

export const TestPage2 = props => {
    return (
        <>
            <div>Test page 2</div>
            <AppFrameConfig appBarContent={<Button>Test Page 2</Button>} />
        </>
    );
}
export default TestPage1;