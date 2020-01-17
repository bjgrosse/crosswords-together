import React, { useContext, useState, useEffect } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import { AppContext } from "AppFrame/AppContext";
import { Div } from "UI/StyledComponents/StyledComponents";
import {
  LightContainer,
  ColorMenuItem
} from "UI/MaterialComponents/MaterialComponents";
import AppFrameConfig from "AppFrame/AppFrameConfig";
import AppDialog from "AppFrame/AppDialog";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import CheckIcon from "@material-ui/icons/Check";
import { colors, playerColors } from "Theme/Colors";
import useSafeHandler, { useSafeHandlerWarn } from "Utility/useSafeHandler";
import Switch from "@material-ui/core/Switch";

const ChipContainer = props => {
  const context = useContext(AppContext);
  return (
    <Div bgcolor={props.color}>
      {props.items.map(x => (
        <ColorChip
          color={colors[x][context.appState.useLightTheme ? 300 : 900]}
        >
          &nbsp;
        </ColorChip>
      ))}
    </Div>
  );
};

const ColorChip = styled.div`
    display: inline-block;
    border-radius: 10px;
    background: ${p => p.color}
    min-width: 20px;
    margin-right: 8px;
`;

const Row = styled(Div).attrs(props => ({
  mt: props.mt || 1,
  fullWidth: true
}))``;

const Settings = observer(props => {
  const context = useContext(AppContext);

  console.log(context.appState.user);

  const reduceState = ({ displayName, email, preferredColors }) => ({
    isDirty: false
  });

  const [state, setState] = useState(reduceState(context.appState.user));

  const handleColorChange = useSafeHandler(event => {
    setState(state => ({
      ...state,
      preferredColors: event.target.value,
      isDirty: true
    }));
  });

  const handleChange = useSafeHandler(e => {
    let newState = { isDirty: true };
    newState[e.target.id] = e.target.value;
    setState(state => ({ ...state, ...newState }));
  });

  const handleSave = useSafeHandlerWarn(() => {
    const data = { ...state };
    delete data.isDirty;
    context.appState.saveSettings(data);
    context.goBack();
  });

  const handleLightThemeChanged = useSafeHandler(event => {
    context.appState.setUseLightTheme(!event.target.checked);
  });
  const preferredColors =
    state.preferredColors || context.appState.user.preferredColors || [];
  return (
    <AppFrameConfig appBarContent="Settings">
      <LightContainer>
        <Row>
          <Div inlineBlock>Dark Theme</Div>
          <Switch
            checked={!context.appState.useLightTheme}
            onChange={handleLightThemeChanged}
          />
        </Row>

        <Row>
          <TextField
            label="Display name"
            value={state.displayName || context.appState.user.displayName}
            id="displayName"
            onChange={handleChange}
            fullWidth
          />
        </Row>
        <Row>
          <TextField
            label="Email"
            id="email"
            value={state.email || context.appState.user.email}
            onChange={handleChange}
            fullWidth
          />
        </Row>

        <Row>
          <FormControl fullWidth>
            <InputLabel>Preferred tile color(s)</InputLabel>
            <Select
              multiple
              value={preferredColors}
              onChange={handleColorChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                    width: 200
                  }
                },
                BackdropProps: { invisible: false },
                MenuListProps: {
                  component: "div",
                  style: {
                    display: "flex",
                    flexFlow: "row wrap"
                  }
                }
              }}
              renderValue={selected => <ChipContainer items={selected} />}
            >
              {Object.keys(playerColors).map(name => (
                <ColorMenuItem
                  key={name}
                  component="div"
                  style={{ width: "12.5%", padding: 0 }}
                  value={name}
                  itemColor={
                    colors[name][context.appState.useLightTheme ? 300 : 900]
                  }
                >
                  <>
                    <CheckIcon
                      size="small"
                      style={{ margin: "auto" }}
                      htmlColor={
                        preferredColors.indexOf(name) > -1
                          ? "white"
                          : colors[name][
                              context.appState.useLightTheme ? 300 : 900
                            ]
                      }
                    />
                  </>
                </ColorMenuItem>
              ))}
            </Select>
          </FormControl>
        </Row>

        {state.isDirty && (
          <Row mt={[2, 3]}>
            <Button variant="contained" color="secondary" onClick={handleSave}>
              Save
            </Button>
          </Row>
        )}
      </LightContainer>
      {/* <AppDialog></AppDialog> */}
    </AppFrameConfig>
  );
});
export default Settings;
