import React, { useRef, useEffect, useContext } from "react";
import PinchPanZoom from "UI/PinchZoomPan/PinchZoomPan";
import ScaleBox from "UI/ScaleBox/ScaleBox";
import { Paper } from "UI/StyledComponents/StyledComponents";
import styled from "styled-components";
import { observer } from "mobx-react";
import Colors from "Theme/Colors";
import AppContext from "AppFrame/AppContext";

const RowDiv = styled.div`
  display: table-row;
`;
function Row(props) {
  const cells = props.cells.map((item, index) => (
    <Square
      drawRightBorder={index < props.cells.length - 1}
      drawBottomBorder={props.drawBorder}
      key={index}
      item={item}
      handleClick={props.handleCellClick}
    />
  ));

  return <RowDiv>{cells}</RowDiv>;
}

const CellDiv = styled.div`
  display: table-cell;
  cursor: ${p => (p.isBlocked ? "default" : "inherit")}
  position: relative;
  border-right: ${p =>
    p.drawRightBorder
      ? `.1px ${p.useLightTheme ? "#aaa" : "black"} solid`
      : null};
  border-bottom: ${p =>
    p.drawBottomBorder
      ? `.1px ${p.useLightTheme ? "#aaa" : "black"} solid`
      : null};
  padding: 0px;
  vertical-align: middle;
  text-align: center;
  transition: background 0.2s;
  color: ${p => (p.useLightTheme ? "#333" : p.isSelected ? "#ddd" : "#aaa")};
  background: ${props => {
    if (props.isBlocked) {
      return props.useLightTheme ? "lightgray" : "black";
    } else if (props.isFocused) {
      return props.useLightTheme ? "#dbd68e" : "rgb(151,151,0)";
    } else if (props.isSelected) {
      return props.useLightTheme ? "#fffcd9" : "rgb(101,101,0)";
    } else if (props.userColor) {
      return `radial-gradient(ellipse at center, ${
        props.useLightTheme ? "white" : "rgb(51,51,51)"
      } 0%, ${props.userColor} 250%)`;
    } else {
      return props.useLightTheme ? "white" : "rgb(75,75,75)";
    }
  }};
`;

const CellNumber = styled.div`
  position: absolute;
  left: 1px;
  top: -1px;
  font-size: 6px;
`;

const CellValue = styled.div`
  display: inline-block;
  font-weight: bold;
`;

const Square = observer(props => {
  const ref = useRef();
  const context = useContext(AppContext);

  useEffect(() => {
    if (props.item.isFocused && props.item.scrollTo) {
      ref.current.scrollIntoView();
    }
  });

  return (
    <CellDiv
      ref={ref}
      drawRightBorder={props.drawRightBorder}
      drawBottomBorder={props.drawBottomBorder}
      isFocused={props.item.isFocused}
      isBlocked={props.item.isBlocked}
      isSelected={props.item.isSelected}
      useLightTheme={context.appState.useLightTheme}
      userColor={
        props.item.value && props.item.playerColor
          ? Colors[props.item.playerColor][
              context.appState.useLightTheme ? 500 : 900
            ]
          : null
      }
      onMouseDown={e => props.handleClick(props.item, e)}
    >
      <CellNumber>{props.item.number}</CellNumber>
      <CellValue>{props.item.value}</CellValue>
    </CellDiv>
  );
});

const PuzzleRoot = styled(Paper)`
  position: relative;
  min-height: 100px;
  min-width: 200px;
  box-sizing: border-box;
  flex-grow: 1;
  overflow: hidden;
  margin-bottom: 10px;
`;
const PuzzleContainer = styled.div`
  position: relative;
  width: 300px;
  height: 320px;
  -webkit-tap-highlight-color: transparent;
`;
const Table = styled.div`
  display: table;
  width: 100%;
  height: 100%;
  table-layout: fixed;
  box-sizing: border-box;
  border-radius: 3px;
  background: white;
  font-size: 14px;
`;

export default observer(props => {
  const handleCellClick = (cell, e) => {
    if (e.ctrlKey && props.puzzle.editMode) {
      props.puzzle.toggleCellBlocked(cell);
    } else {
      props.puzzle.selectCell(cell, true, e.button === 2);
    }
  };
  return (
    <PuzzleRoot id="PuzzleRoot" elevation={1}>
      <ScaleBox baseWidth={300}>
        <PinchPanZoom maxScale={2} style={{ overflow: "visible !important" }}>
          <PuzzleContainer>
            <Table>
              {props.puzzle.squares &&
                props.puzzle.squares.map((item, index) => (
                  <Row
                    key={index}
                    drawBorder={index < props.puzzle.squares.length - 1}
                    cells={item}
                    focusedSquareRef={props.setFocusedSquareRef}
                    handleCellClick={handleCellClick}
                  />
                ))}
            </Table>
          </PuzzleContainer>
        </PinchPanZoom>
      </ScaleBox>
    </PuzzleRoot>
  );
});
