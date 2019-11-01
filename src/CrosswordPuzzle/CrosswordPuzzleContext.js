import React from 'react';
import makeInspectable from 'mobx-devtools-mst';
import PuzzleStore from '../Models/CrosswordPuzzle';

const store = PuzzleStore.create();
makeInspectable(store);

export default React.createContext(store);