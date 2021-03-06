import React, { Fragment, useEffect, useRef } from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import BackIcon from "@material-ui/icons/Backspace";
import DownIcon from "@material-ui/icons/ExpandMore";
import { Paper, Div } from "UI/StyledComponents/StyledComponents";
import styled from "styled-components";

import "./Keyboard.css";

const Keyboard = styled(Paper)`
  z-index: 1;
  position: relative;
  display: flex;
  height: 125px;
`;
const KeyContainer = styled(Div)`
  display: flex;
  flex-flow: nowrap column;
  width: 300px;
  min-width: 300px;
  flex-grow: 1;
  align-items: center;
`;

const Row = styled(Div)`
  display: table;
  table-layout: fixed;
  width: 100%;
  box-sizing: border-box;
`;
const Key = styled(Div)`
  display: table-cell;
  width: 100%;
  text-align: center;
`;

const LetterButton = styled(Button)`
  && {
    padding: 0px;
    width: 100%;
    min-width: 0px;
    min-height: 40px;
  }
`;
const HideButton = styled(IconButton)``;
const letters = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m", "back"]
];

export default function(props) {
  const ref = useRef();

  let rows = letters.map((row, index) => (
    <Row key={index} pl={`${5 * index}%`} pr={`${5 * index}%`}>
      <>
        {row.map(l => (
          <Key key={l}>
            {l &&
              (l !== "back" ? (
                <LetterButton
                  color="primary"
                  onClick={() => props.handleKeyDown({ key: l })}
                >
                  {l}
                </LetterButton>
              ) : (
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="backspace"
                  onClick={() => props.handleKeyDown({ key: "Backspace" })}
                >
                  <BackIcon />
                </IconButton>
              ))}
          </Key>
        ))}
        {/* {index == 2 ?  : null} */}
      </>
    </Row>
  ));

  useEffect(() => {
    //  ref.current.scrollIntoView(false);
  }, []);

  return (
    <Keyboard elevation={2} ref={ref}>
      <KeyContainer>
        <Fragment>{rows}</Fragment>
      </KeyContainer>
      <Divider height="100%" orientation="vertical" />
      <HideButton
        color="primary"
        size="small"
        aria-label="close keyboard"
        onClick={props.closeKeyboard}
      >
        <DownIcon />
      </HideButton>
    </Keyboard>
  );
}
