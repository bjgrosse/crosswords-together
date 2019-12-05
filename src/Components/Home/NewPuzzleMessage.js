import React from 'react';
import { Div } from 'UI/StyledComponents/StyledComponents';
import { LightContainer, Button } from 'UI/MaterialComponents/MaterialComponents';
import { Typography } from '@material-ui/core';
import useNavigateTo from 'Utility/useNavigateTo'

const NewPuzzleMessage = props => {

   return (
       <LightContainer flex alignCenter p={[2,2,3]} justifyCenter>
           <Div ><Typography variant="h6" fontWeight="bold">Ready for a new puzzle?</Typography></Div>
           <Button variant="contained" color="secondary" ml={[2,2,3]} onClick={useNavigateTo("/start")}>Start</Button>
       </LightContainer>
    );
}
export default NewPuzzleMessage;
