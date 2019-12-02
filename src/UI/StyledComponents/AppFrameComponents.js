import styled from 'styled-components';
import { palette, spacing } from '@material-ui/system';
import is from 'styled-is';
import { Div, Paper } from '../StyledComponents'
import Typography from '@material-ui/core/Typography';
import Banner from '../Banner'

export const AppRoot = styled.div
`${({ theme }) => `
    background-color: ${theme.palette.background.default};
    background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(215,237,255,1) 100%);
    height: 100%;
    width: 100%;
`}
`;

export const AppCanvas = styled(Div).attrs(props => ({
    absolute: true,
    center: true,
    column: true,
    fullHeight: true
}))
`${({ theme }) => `
    max-width: 1280px;
`}
`;

export const PageContainer = styled(Div).attrs(props => ({
    p: [1,1,2],
    absolute: true,
    full: true,
    scroll: true
}))
`${({ theme }) => `

`}
`;

export const AppLoadingContainer = styled(Div).attrs(props => ({
    full: true,
    flexCenter: true
}))
`${({ theme }) => `

`}
`;

export const AppBar = styled(Div).attrs(props => ({
    bgcolor: 'primary',
    flex: true,
    alignCenter: true,
    justifyStretch: true,
    p: [1, 1, 1.5, 2],
}))
`${({ theme }) => `
    border-radius: 0px 0px 2px 2px;
    border-bottom: 2px solid ${theme.palette.border.primary};
    background-color: ${theme.palette.background.overlay};
    z-Index: 10;
    
`}
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
}
`;

export const AppBanner = styled(Banner)
`${({ theme }) => `
    && {
        background: ${theme.palette.background.alert};
        border-bottom: 1px solid ${theme.palette.border.alert};
    }
`}
`;
