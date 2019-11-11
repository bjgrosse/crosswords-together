import React, { Fragment, useContext, useState, useEffect } from 'react';
import { observer } from 'mobx-react'
import { AppContext } from '../AppFrame/AppFrameContext';

import PuzzlesStore from '../Stores/PuzzlesStore';
import PuzzleList from './PuzzleList'
import TemplateList from './TemplateList'
import LoadingContainer from '../AppFrame/LoadingContainer';
const store = PuzzlesStore.create();

function Home(props) {
    const context = useContext(AppContext);

    const loadPuzzles = async () => {
        await store.fetch();
        console.log(store)
    }


    if (context.user) {
        return (
            <LoadingContainer provideWorkPromise={loadPuzzles}>
                <Fragment>
                    {/* <div >Welcome home, {context.user.displayName}</div> */}
                    {/* <Puzzle templateId="26gLX1naY3vcdT07z5b0" puzzleId="15SuJ684gpB4vjrkiSBr"/> */}

                    {store.pendingInvitations.length > 0 &&
                        <PuzzleList puzzles={store.pendingInvitations} title="Pending invitations..." />
                    }

                    {store.activePuzzles.length > 0 &&
                        <PuzzleList puzzles={store.activePuzzles} title="My puzzles..." />
                    }

                    <TemplateList templates={store.templates} />
                </Fragment>
            </LoadingContainer>
        )
    } else {
        return <div>Welcome, guest!</div>
    }
}

export default observer(Home);