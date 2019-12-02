import React, { useContext, useState, useEffect } from 'react';
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import { useHistory } from 'react-router-dom'
import { Div } from '../UI/StyledComponents'
import AddIcon from '@material-ui/icons/AddCircle';
import { IconChip, Chip } from '@material-ui/core';




export const TestPage1 = props => {
    //let [showMoreData ]
    let history = useHistory()

    return (
<Div column alignStart>
    <Chip>Default</Chip>
    <Chip color="primary">Primary</Chip>
    <Chip color="secondary" startIcon={<AddIcon />}>Secondary</Chip>
    <Chip color="primary" startIcon={<AddIcon />}>Primary</Chip>
    <Chip color="secondary">Secondary</Chip>
    <Chip color="primary" variant="contained">Primary</Chip>
    <Chip color="secondary" variant="contained">Secondary</Chip>
    <Chip color="primary" variant="contained" startIcon={<AddIcon />}>Primary</Chip>
    <Chip color="secondary" dense variant="contained" startIcon={<AddIcon />}>Secondary</Chip>
</Div>
    );
}

export const TestPage2 = props => {
    return (
        <>
            <div>Test page 2</div>
            <AppFrameConfig appBarContent={<Chip>Test Page 2</Chip>} />
        </>
    );
}
export default TestPage1;