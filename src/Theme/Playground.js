import React from "react";
import AppFrameConfig from "AppFrame/AppFrameConfig";
import { Paper } from "UI/StyledComponents/StyledComponents";
import { useTheme } from "@material-ui/core/styles";

const ThemePlayground = props => {
  const theme = useTheme();
  return (
    <AppFrameConfig appBarContent="Theme Playground">
      {Object.keys(theme.palette.primary).map(x => (
        <Paper p={2} m={1} color={`text.primary`} bgcolor={`primary.${x}`}>
          primary.{x}
        </Paper>
      ))}

      {Object.keys(theme.palette.secondary).map(x => (
        <Paper p={2} m={1} color={`text.secondary`} bgcolor={`secondary.${x}`}>
          secondary.{x}
        </Paper>
      ))}
      {Object.keys(theme.palette.background).map(x => (
        <Paper p={2} m={1} bgcolor={`background.${x}`}>
          background.{x}
        </Paper>
      ))}
    </AppFrameConfig>
  );
};

export default ThemePlayground;
