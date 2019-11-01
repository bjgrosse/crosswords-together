import React, { Fragment, useContext, useState, useEffect  } from 'react';

import { AppContext } from '../AppFrame/AppFrameContext';

import PuzzleList from '../PuzzleList/PuzzleList';
import LoadingContainer from '../AppFrame/LoadingContainer';
import db from '../Database/Database'

function Home(props) {
    const context = useContext(AppContext);



    if (context.user) {
        return (
            <Fragment>
                {/* <div >Welcome home, {context.user.displayName}</div> */}
                {/* <Puzzle templateId="26gLX1naY3vcdT07z5b0" puzzleId="15SuJ684gpB4vjrkiSBr"/> */}

                    <PuzzleList />

            </Fragment>
        )
    } else {
        return <div>Welcome, guest!</div>
    }
}

export default Home;