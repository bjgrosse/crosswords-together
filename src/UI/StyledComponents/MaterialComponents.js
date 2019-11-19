import MatIconButton from '@material-ui/core/IconButton';

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

export const IconButton = styled(MatIconButton)`
&&{
    ${spacing}
    ${display}
    ${borders}
    ${sizing}
    color: ${p => p.theme.palette.text.primary}
}
`