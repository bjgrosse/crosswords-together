import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components'
import { Div } from 'UI/StyledComponents/StyledComponents';

const Part1 = styled(Div).attrs(props => ({
    color: "primary.main",
    fontSize: ["1.1rem", "1.2rem", "1.3rem", "1.5rem"],
    fontWeight: "bold",
    ml: [.5,.75,1,1],
}))`
    display: inline-block;
    letter-spacing: 0.15em;
    vertical-align: middle;

`


const Part2 = styled(Div).attrs(props => ({
    fontSize: ["1.2rem", "1.3rem", "1.4rem", "1.6rem"],
    fontWeight: "700",
    ml: [.5,.75,1,1],
    px: [.5,.75,1,1],
    pb: [.2,.3,.4,.5]
}))`
    display: inline-block;
    color: white;
    background: linear-gradient(to bottom, #bad4ff -10%, #337fff 50%);
    border-radius: 5px;
    letter-spacing: 0.15em;
    border: 1px solid #0043b6;
    vertical-align: middle;
`
const InlineLogo = () => {
   return (
       <Div>
           <Part1>CROSSWORDS</Part1>
           
           <Part2>together</Part2>
       </Div>
    );
}
export default InlineLogo;