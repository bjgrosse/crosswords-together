import MatIconButton from "@material-ui/core/IconButton";
import MatButton from "@material-ui/core/Button";
import MatListItem from "@material-ui/core/ListItem";
import MatMenuItem from "@material-ui/core/MenuItem";

import styled from "styled-components";
import {
  palette,
  spacing,
  borders,
  display,
  sizing,
  typography
} from "@material-ui/system";
import { Div } from "../StyledComponents/StyledComponents";

export const IconButton = styled(MatIconButton).attrs(props => ({
  color: props.color !== undefined ? props.color : "text.primary"
}))`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
}
`;

export const Button = styled(MatButton)`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    ${typography}
}`;

export const LightContainer = styled(Div).attrs(props => ({
  p: props.p || [1, 1, 2, 3]
}))`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}

    border-radius: 8px;
    border: 1px solid ${p => p.theme.palette.border.overlay};    
    background-color: ${p => p.theme.palette.background.overlay};
    color:  ${p => p.theme.palette.text.primary};   

}
`;
export const ListItem = styled(MatListItem).attrs(props => ({}))`
&&{
    ${palette}
    ${spacing}
    ${display}
    ${borders}
    ${sizing}

}
`;
export const Avatar = styled(Div).attrs(props => ({
  flex: true,
  alignCenter: true,
  justifyCenter: true
}))`
  && {
    ${palette}
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
`;

export const ColorMenuItem = styled(MatMenuItem)`
  &&&& {
    background-color: ${p => p.itemColor};
  }
`;
