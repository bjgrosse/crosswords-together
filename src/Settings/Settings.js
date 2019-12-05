
import React, { useContext, useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import { AppContext } from '../AppFrame/AppContext';
import { Div } from '../UI/StyledComponents';

const component = props => {
    const context = useContext(AppContext)
    const displayName = useState()
    return (
        <Div>
            <Div tableRow>
                <Div tableCell>
                    Display name
                </Div>
                <Div tableCell>
                    <TextField />
                </Div>
            </Div>

        </Div>
    );
}
export default component;