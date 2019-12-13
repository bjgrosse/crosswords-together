import React, { useContext, useState, useEffect, useRef } from "react";
import { observer } from "mobx-react";
import styled from "styled-components";

import Chip from "@material-ui/core/Chip";

import { Div } from "UI/StyledComponents/StyledComponents";
import { levelColors } from "Theme/Colors";

import AppFrameConfig from "AppFrame/AppFrameConfig";
import LoadingContainer from "AppFrame/LoadingContainer";
import TemplatesStore from "Stores/TemplatesStore";

import TemplateList from "./TemplateList";
import AppContext from "AppFrame/AppContext";
const filterColors = { Levels: levelColors };

const FilterContainer = styled(Div)`
    width: 100%;
    display: table;
    background: ${p => p.theme.palette.background.inset};
    border-radius: 8px;
    border-spacing: 8px
    box-shadow: inset 0px 0px 3px 0px rgb(0,0,0,.2);
    color: ${p => p.theme.palette.text.primary}
`;

const FilterRow = styled(Div).attrs(p => ({
  alignCenter: true
}))`
  width: 100%;
  display: table-row;
`;
const FilterOptions = styled(Div)`
  display: table-cell;
  flex-flow: row wrap;
`;

const FilterLabel = styled(Div).attrs(p => ({
  fontSize: ".9rem",
  mr: 1
}))`
  && {
    display: table-cell;
  }
`;
const FilterChip = styled(Chip).attrs(p => ({
  size: "small",
  color: "primary",
  variant: p.isSelected ? "default" : "outlined",
  mr: 1
}))`
  &&,
  &&:active,
  &&:focus,
  &&:hover {
    background: ${p => {
      if (p.label === "all") return;

      return (
        p.isSelected &&
        filterColors[p.filterTitle] &&
        filterColors[p.filterTitle][p.label][500]
      );
    }} !important;
    border: 1px solid
      ${p => {
        if (p.label === "all") return;

        return (
          filterColors[p.filterTitle] &&
          filterColors[p.filterTitle][p.label][600]
        );
      }} !important;
    color: ${p => {
      if (p.label === "all") return;

      return (
        filterColors[p.filterTitle] &&
        filterColors[p.filterTitle][p.label][p.isSelected ? 50 : 600]
      );
    }} !important;
  }
`;
const Filter = observer(({ filter }) => {
  const context = useContext(AppContext);

  return (
    <FilterRow>
      <FilterLabel>{filter.title}</FilterLabel>
      <FilterOptions>
        {filter.items.map(x => (
          <FilterChip
            htmlColor="green"
            filterTitle={filter.title}
            label={x}
            useLightTheme={context.appState.useLightTheme}
            isSelected={filter.selected.includes(x)}
            onClick={() => filter.toggleFilter(x)}
          />
        ))}
      </FilterOptions>
    </FilterRow>
  );
});

const store = TemplatesStore.create();

const StartNewPuzzle = observer(props => {
  return (
    <AppFrameConfig appBarContent="Start a new puzzle">
      <LoadingContainer provideWorkPromise={store.fetch}>
        <FilterContainer>
          {store.filters.map(x => (
            <Filter filter={x} />
          ))}
        </FilterContainer>
        <TemplateList templates={store.filteredTemplates} />
      </LoadingContainer>
    </AppFrameConfig>
  );
});

export default StartNewPuzzle;
