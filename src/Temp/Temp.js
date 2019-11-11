import React, { useContext, useState, useEffect } from 'react';
import AppBarConfig from '../AppFrame/AppBarConfig'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { Div } from '../StyledComponents'

export const TestPage1 = props => {
    //let [showMoreData ]
    let history = useHistory()

    return (
        <>
            <div>Test page 1<Button >Go page 2</Button></div>

            <AppBarConfig
                content="Test Page 1"
                actions={
                    <>
                        <Button>1</Button>
                        <Button onClick={() => history.push('/test2')}>2</Button>
                        <Button>3</Button>
                    </>
                }
            />
        </>
    );
}

export const TestPage2 = props => {
    return (
        <>
            <div>Test page 2</div>
            <AppBarConfig content={<Button>Test Page 2</Button>} />
        </>
    );
}
export default TestPage1;