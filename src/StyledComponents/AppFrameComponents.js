import styled from 'styled-components';
import { palette, spacing } from '@material-ui/system';
import is from 'styled-is';
import { Div, Paper } from '../StyledComponents'
import Typography from '@material-ui/core/Typography';

export const AppRoot = styled.div
`${({ theme }) => `
    background: ${theme.palette.background.default};
    height: 110vh;
    width: 100vw;
`}
`;

export const AppCanvas = styled(Div).attrs(props => ({
    center: true,
    column: true,
    fullHeight: true
}))
`${({ theme }) => `
    background: ${theme.palette.background.default};
    max-width: 1280px;
`}
`;

export const PageContainer = styled(Div).attrs(props => ({
    mx: [0,0,1,2],
    absolute: true,
    full: true
}))
`${({ theme }) => `

`}
`;

export const LoadingContainer = styled(Div).attrs(props => ({
    full: true,
    flexCenter: true
}))
`${({ theme }) => `

`}
`;

export const AppBar = styled(Paper).attrs(props => ({
    bgcolor: 'primary',
    flex: true,
    alignCenter: true,
    justifyStretch: true,
    mb: [.5,1,1,1],
    p: [0, 0, 1, 1],
    elevation: 1
}))
`
    border-radius: 0px 0px 2px 2px;
    background: linear-gradient(to bottom, #edf5f9 23%,#cfd8dc 100%);;
    z-Index: 10;
`;


export const AppBarTitle = styled(Typography).attrs(props => ({
    variant: 'h6',
    pl: [1,1,2,2]
}))
`    
&& {
    ${spacing}
    text-align: left;
    flex-grow: 1
    color: ${p => p.theme.palette.text.primary};
    font-weight: 700;
}
`;
