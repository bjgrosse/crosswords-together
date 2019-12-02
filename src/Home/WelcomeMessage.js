import React, { useContext, useState, useEffect } from 'react';
import { Div } from '../UI/StyledComponents/StyledComponents';
import { LightContainer, Button } from '../UI/StyledComponents/MaterialComponents';
import { Typography } from '@material-ui/core';
import useNavigateTo from '../Utility/useNavigateTo'

const WelcomeMessage = props => {
    return (
        <LightContainer column alignCenter p={[2, 2, 3]}>
            <Typography variant="h6" align="center">
                <Div >Start a puzzle,</Div>
                <Div>invite a friend,</Div>
                <Div fontStyle="italic">(or several!)</Div>
                <Div>solve it together!</Div>
            </Typography>
            <Button variant="contained" color="secondary" mt={[2, 2, 3]} onClick={useNavigateTo("/start")}>Start</Button>
        </LightContainer>
    );
}
export default WelcomeMessage;
