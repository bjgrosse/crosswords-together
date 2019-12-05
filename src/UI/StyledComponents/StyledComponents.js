
import React from 'react';
import styled from 'styled-components';
import {
    palette, spacing, borders,
    display,
    positions,
    shadows,
    sizing,
    typography
} from '@material-ui/system';
import is, { isOr, isNot } from 'Utility/styledIs';
import { Typography } from '@material-ui/core';

function designMode() { return () => (true) };


const GetRandomColor = () => (CSSColors[Math.floor(Math.random() * CSSColors.length - 1)])
const CSSColors = ["AliceBlue", "AntiqueWhite", "Aqua", "Aquamarine", "Azure", "Beige", "Bisque", "Black", "BlanchedAlmond", "Blue", "BlueViolet", "Brown", "BurlyWood", "CadetBlue", "Chartreuse", "Chocolate", "Coral", "CornflowerBlue", "Cornsilk", "Crimson", "Cyan", "DarkBlue", "DarkCyan", "DarkGoldenRod", "DarkGray", "DarkGrey", "DarkGreen", "DarkKhaki", "DarkMagenta", "DarkOliveGreen", "DarkOrange", "DarkOrchid", "DarkRed", "DarkSalmon", "DarkSeaGreen", "DarkSlateBlue", "DarkSlateGray", "DarkSlateGrey", "DarkTurquoise", "DarkViolet", "DeepPink", "DeepSkyBlue", "DimGray", "DimGrey", "DodgerBlue", "FireBrick", "FloralWhite", "ForestGreen", "Fuchsia", "Gainsboro", "GhostWhite", "Gold", "GoldenRod", "Gray", "Grey", "Green", "GreenYellow", "HoneyDew", "HotPink", "IndianRed", "Indigo", "Ivory", "Khaki", "Lavender", "LavenderBlush", "LawnGreen", "LemonChiffon", "LightBlue", "LightCoral", "LightCyan", "LightGoldenRodYellow", "LightGray", "LightGrey", "LightGreen", "LightPink", "LightSalmon", "LightSeaGreen", "LightSkyBlue", "LightSlateGray", "LightSlateGrey", "LightSteelBlue", "LightYellow", "Lime", "LimeGreen", "Linen", "Magenta", "Maroon", "MediumAquaMarine", "MediumBlue", "MediumOrchid", "MediumPurple", "MediumSeaGreen", "MediumSlateBlue", "MediumSpringGreen", "MediumTurquoise", "MediumVioletRed", "MidnightBlue", "MintCream", "MistyRose", "Moccasin", "NavajoWhite", "Navy", "OldLace", "Olive", "OliveDrab", "Orange", "OrangeRed", "Orchid", "PaleGoldenRod", "PaleGreen", "PaleTurquoise", "PaleVioletRed", "PapayaWhip", "PeachPuff", "Peru", "Pink", "Plum", "PowderBlue", "Purple", "RebeccaPurple", "Red", "RosyBrown", "RoyalBlue", "SaddleBrown", "Salmon", "SandyBrown", "SeaGreen", "SeaShell", "Sienna", "Silver", "SkyBlue", "SlateBlue", "SlateGray", "SlateGrey", "Snow", "SpringGreen", "SteelBlue", "Tan", "Teal", "Thistle", "Tomato", "Turquoise", "Violet", "Wheat", "White", "WhiteSmoke", "Yellow", "YellowGreen",]

export const Span = styled.span`
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    ${typography}
`
export const Div = styled.div`
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    ${typography}

    ${is('!absolute', 'full')`
        width: 100%;
        height: 100%;
        flex-basis: 100%;
    `};

    ${is('hide')`
        display: none;
    `};

    
    ${is('fixed')`
        position: fixed;
    `};

    ${is('fullHeight')`
        height: 100%;
        flex-basis: 100%;
    `};
    
    ${is('fullWidth')`
        width: 100%;
        flex-basis: 100%;
    `};


    ${is('absolute', 'full')`
        position: absolute;
        left: 0px; right: 0px; top: 0px; bottom: 0px;
    `};

    ${is('fixed', 'full')`
    left: 0px; right: 0px; top: 0px; bottom: 0px;
`};

    ${isOr('inlineBlock', 'inline')`
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

    ${is('zIndex')`
        z-index: ${props => props.zIndex};
    `};
    ${is('float')`
        float: ${props => props.float === true ? 'left' : props.float};
    `};

    ${is('table')`
        display: table;
    `};
    ${is('tableCell')`
        display: table-cell;
    `};
    ${is('tableRow')`
        display: table-row;
    `};
    ${is('scroll')`
        overflow: auto;
    `};
    ${is('scrollVisible')`
        overflow: scroll;
    `};
    ${is('scrollY')`
        overflow-y: auto;
    `};
    ${is('scrollX')`
    overflow-x: auto;
    `};

    ${is('noOverflow')`
        overflow: hidden;
    `};

    ${is('noOverflowX')`
        overflow-x: hidden;
    `};
    
    ${is('noOverflowY')`
        overflow-y: hidden;
    `};
    
    ${is('hideScrollBars')`
        ::-webkit-scrollbar { 
            display: none;  /* Chrome Safari */
            width: 0;
            height: 0;
        }
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE 10+ */
    
    `};
    ${is('relative')`
        position: relative;
    `};

    ${is('absolute')`
        position: absolute;
    `};

    ${is('absolute', 'center')`
        left: 0px;
        right: 0px;
        bottom: 0px;
        top: 0px;
        margin: auto;
    `}; 

    ${is('absolute', 'topRight')`
        right: 0px;
        top: 0px;
        margin: auto;
    `}; 

    ${is('absolute', 'right')`
        right: 0px;
        top: 0px;
        bottom: 0px;
    `}; 

    ${is('column')`
        display: flex;
        flex-direction: column;
    `};
    ${is('flexWrap')`
        flex-wrap: wrap;
    `};
    ${is('wrapReverse')`
        flex-wrap: wrap-reverse;
    `};
    ${is('flexCenter')`
        display: flex;
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
//background: ${props => GetRandomColor()}
export const Paper = styled(Div)`
    border-radius: 5px;
    background: ${p => p.background || 'white'};
    box-shadow: 0px ${p => (p.elevation || 1) * -1}px ${p => (p.elevation || 1) * 3}px 0px rgba(0,0,0,.2), 1px ${p => (p.elevation || 1) * 1}px  ${p => (p.elevation || 1) * 3}px 0px rgba(0,0,0,.2)  ;
`
export const SubTitle1 = styled(Typography).attrs(props => ({
    variant: 'h6',
    ml: props.ml !== undefined ? props.ml : 1,
    mb: props.mb !== undefined ? props.mb : .5,
    mt: props.mt !== undefined ? props.mt : 1
}))`
 && {
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    ${typography}
    display: block;
    color: ${p => p.theme.palette.text.primary};
    opacity: 0.5;
    font-weight: ${p => p.theme.typography.fontWeightBold}
}
`

export const SubTitle2 = styled(SubTitle1).attrs(props => ({ variant: 'button', color: props.color || 'textPrimary', ml: props.ml || 1, mb: props.mb || .5 }))`

`

export const Banner = styled(Paper)`
    background: yellow;
    
`
