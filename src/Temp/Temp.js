import React, { useContext, useState, useEffect } from 'react';
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { Div } from '../UI/StyledComponents'

export const TestPage1 = props => {
    //let [showMoreData ]
    let history = useHistory()

    return (
        <>
            <Div full>Test page 1<Button >Go page 2</Button></Div>

            {/* <AppFrameConfig
                appBarContent="Test Page 1"
                appBarActions={
                    <>
                        <Button>1</Button>
                        <Button onClick={() => history.push('/test2')}>2</Button>
                        <Button>3</Button>
                    </>
                }
            /> */}
        </>
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