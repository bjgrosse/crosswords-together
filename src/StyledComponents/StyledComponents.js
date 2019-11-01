
import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';

export const Div = styled.div`
    ${is('full')`
        width: 100%;
        height: 100%;
        flex-basis: 100%;
    `};

    ${is('inlineBlock')`
        display: inline-block;
    `};
    ${is('inlineFlex')`
        display: inline-flex;
    `};

    ${is('flex')`
        display: flex;
    `};

    ${is('background')`
        background: ${props => props.background};
    `};
    
    ${is('minHeight')`
        min-height: ${props => props.minHeight};
    `};
    ${is('minWidth')`
        min-width: ${props => props.minWidth};
    `};

    ${is('height')`
        height: ${props => props.height};
    `};

    ${is('width')`
        width: ${props => props.width};
    `};


    ${is('scroll')`
        overflow: auto;
    `};
    ${is('scrollY')`
        overflow-y: auto;
    `};
    ${is('scrollX')`
    overflow-x: auto;
    `};

    ${is('relative')`
        position: relative;
    `};

    ${is('absolute')`
        position: absolute;
    `};

    ${is('absolute') && is('center')`
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 0px;
        margin: auto;
    `}; 

    ${is('column')`
        display: flex;
        flex-direction: column;
    `};
    ${is('wrap')`
        flex-wrap: wrap;
    `};
    ${is('wrapReverse')`
        flex-wrap: wrap-reverse;
    `};
    ${is('flexCenter')`
        align-items: center;
        align-content: center;
        justify-content: center;
    `};
    /***************************** justify-content *****************************/
    /************* http://cssreference.io/property/justify-content *************/
    ${is('justifyStart')`
        justify-content: flex-start; /* default */
    `};
    ${is('justifyEnd')`
        justify-content: flex-end;
    `};
    ${is('justifyCenter')`
        justify-content: center;
    `};
    ${is('justifyBetween')`
        justify-content: space-between;
    `};
    ${is('justifyAround')`
        justify-content: space-around;
    `};
    /****************************** align-content ******************************/
    /************** http://cssreference.io/property/align-content **************/
    ${is('contentStart')`
        align-content: flex-start;
    `};
    ${is('contentEnd')`
        align-content: flex-end;
    `};
    ${is('contentCenter')`
        align-content: center;
    `};
    ${is('contentSpaceBetween')`
        align-content: space-between;
    `};
    ${is('contentSpaceAround')`
        align-content: space-around;
    `};
    ${is('contentStretch')`
        align-content: stretch; /* default */
    `};
    /******************************* align-items *******************************/
    /*************** http://cssreference.io/property/align-items ***************/
    ${is('alignStart')`
        align-items: flex-start;
    `};
    ${is('alignEnd')`
        align-items: flex-end;
    `};
    ${is('alignCenter')`
        align-items: center;
    `};
    ${is('alignBaseline')`
        align-items: baseline;
    `};
    ${is('alignStretch')`
        align-items: stretch;
    `};
    /******************************** utilities ********************************/

    /********************************** order **********************************/
    /****************** http://cssreference.io/property/order ******************/
    ${is('order')`
        order: ${props => props.order};
    `};

    /******************************** flex-basis ********************************/
    /**************** http://cssreference.io/property/flex-basis ****************/
    ${is('basis')`
        flex-basis: ${props => props.basis};
    `};

    /******************************** flex-grow ********************************/
    /**************** http://cssreference.io/property/flex-grow ****************/
    ${is('grow')`
        flex-grow: ${props => props.grow === true ? 1 : props.grow};
    `};

    /******************************* flex-shrink *******************************/
    /*************** http://cssreference.io/property/flex-shrink ***************/
    ${is('shrink')`
        flex-shrink: ${props => props.shrink || 1};
    `};
    ${is('noShrink')`
        flex-shrink: 0;
    `};
`;

export const Paper = styled(Div)`
    border-radius: 5px;
    background: white;
    box-shadow: 0px ${p=> ( p.elevation || 1 )* -2}px ${p=> ( p.elevation || 1 )* 5}px ${p=> ( null || 1 )* -2}px #999, 0px ${p=> ( p.elevation || 1 )* 1}px  ${p=> ( p.elevation || 1 )* 1}px 0px #ccc  ;
`