import MatIconButton from '@material-ui/core/IconButton';
import MatButton from '@material-ui/core/Button';
import MatListItem from '@material-ui/core/ListItem';
import MatAvatar from '@material-ui/core/Avatar';

import styled from 'styled-components';
import {
    palette, spacing, borders,
    display,
    positions,
    shadows,
    sizing,
    typography
} from '@material-ui/system';
import is, { isNot } from 'styled-is';
import { Div } from './StyledComponents';

export const IconButton = styled(MatIconButton).attrs(props => ({
    color: props.color !== undefined ? props.color : "primary"
}))`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
}
`

export const Button = styled(MatButton)`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    ${typography}
}`


export const LightContainer = styled(Div).attrs(props => ({
    p: props.p || [1,1,2,3]
}))`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}

    border-radius: 8px;
    border: 1px solid ${p => p.theme.palette.border.primaryLight};    
    background-color: rgb(255,255,255, 0.5);
    color:  ${p => p.theme.palette.text.primary};   

}
`
export const ListItem = styled(MatListItem).attrs(props => ({
    
}))`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}

}
`
export const Avatar = styled(Div).attrs(props => ({
    flex: true,
    alignCenter: true,
    justifyCenter: true,
}))`
&&{
    ${palette}
    border-radius: 50%;
    width: 40px;
    height: 40px;
}
`