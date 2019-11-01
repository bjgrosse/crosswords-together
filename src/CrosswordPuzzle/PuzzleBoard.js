import React, { useContext, useRef, useEffect } from 'react';
import PinchPanZoom from '../PinchZoomPan/PinchZoomPan';
import ScaleBox from '../ScaleBox/ScaleBox';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';
import { observer } from 'mobx-react'
import PuzzleContext from '../CrosswordPuzzle/CrosswordPuzzleContext';

const RowDiv = styled.div`
    display: table-row;
`
function Row(props) {
    const cells = props.cells.map((item, index) => <Square key={index} item={item} clickSquare={props.clickSquare} focusedSquareRef={props.focusedSquareRef} />);

    return (
        <RowDiv>{cells}</RowDiv>
    )
};


const CellDiv = styled.div`
    display: table-cell;
    position: relative;
    border-right: 1px gray solid;
    border-bottom: 1px gray solid;
    padding: 0px;
    vertical-align: middle;
    text-align: center;
    transition: background .2s;
    background: ${props => {
        if (props.isBlocked)
            return 'lightgray'
        if (props.isFocused)
            return '#dbd68e'
        if (props.isSelected)
            return '#fffcd9'
    }}
`

const CellNumber = styled.div`
    position: absolute;
    left: 1px;
    top: -1px;
    font-size: 8px;
`

const CellValue = styled.div`
    display: inline-block;
    font-weight: bold;
    font-size:14px;
`

const Square = observer(props => {

    const {puzzle} = useContext(PuzzleContext);
    const ref = useRef();

    useEffect(() => {
        if (props.item.isFocused && !props.item.selectedDirectly) {
            ref.current.scrollIntoView();
        }
    });

    return (
        
            <CellDiv ref={ref}
                {...props.item} onClick={() => puzzle.selectCell(props.item, true)}>
                <CellNumber>{props.item.number}</CellNumber>
                <CellValue>{props.item.value}</CellValue>
            </CellDiv>

    )
})

const PuzzleRoot = styled.div`
    position: relative;
    min-height: 100px;
    min-width: 200px;
    padding: 10px 10px;
    box-sizing: border-box;
    flex-grow:1;
`
const PuzzleContainer = styled(Paper)`
    position: relative;
    width: 500px;
    height: 500px;
`
const Table = styled.div`
    display: table;
    width: 100%;
    height: 100%;    
    border: 1px gray solid;
    table-layout: fixed;
    box-sizing: border-box;
    border-radius: 3px;
    background: white;
`

export default function (props) {

    return (
        <PuzzleRoot>
            <ScaleBox baseWidth={500}>
                <PinchPanZoom maxScale={2} style={{ overflow: 'visible !important' }} >
                    <PuzzleContainer elevation="1" >
                        <Table>
                            {props.puzzle.squares && props.puzzle.squares.map((item, index) => <Row key={index} cells={item.cells} focusedSquareRef={props.setFocusedSquareRef} />)}
                        </Table>
                    </PuzzleContainer>
                </PinchPanZoom>
            </ScaleBox>
        </PuzzleRoot>
    )
}