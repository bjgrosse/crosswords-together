import React from 'react';
import { Div } from '../UI/StyledComponents/StyledComponents';
import { LightContainer, Button } from '../UI/StyledComponents/MaterialComponents';
import { Typography } from '@material-ui/core';

const NewPuzzleMessage = props => {
   return (
       <LightContainer flex alignCenter p={[2,2,3]} justifyCenter>
           <Div ><Typography variant="h6" fontWeight="bold">Ready for a new puzzle?</Typography></Div>
           <Button variant="contained" color="secondary" ml={[2,2,3]}>Start</Button>
       </LightContainer>
    );
}
export default NewPuzzleMessage;
