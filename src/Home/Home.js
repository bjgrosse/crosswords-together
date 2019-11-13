import React, { Fragment, useContext, useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { observer } from 'mobx-react'
import { AppContext } from '../AppFrame/AppFrameContext';

import PuzzlesStore from '../Stores/PuzzlesStore';
import PuzzleList from './PuzzleList'
import TemplateList from './TemplateList'
import LoadingContainer from '../AppFrame/LoadingContainer';
import Login from '../AppFrame/Login';
import AppBarConfig from '../AppFrame/AppBarConfig';
import { Div } from '../StyledComponents'
import Typography from '@material-ui/core/Typography';

const store = PuzzlesStore.create();

function Home(props) {
    const context = useContext(AppContext);
    const isPortrait = useMediaQuery('(orientation: portrait)')

    const loadPuzzles = async () => {
        await store.fetch();
    }


    if (context.user) {
        return (
            <LoadingContainer provideWorkPromise={loadPuzzles}>
                <Fragment>
                    {/* <div >Welcome home, {context.user.displayName}</div> */}
                    {/* <Puzzle templateId="26gLX1naY3vcdT07z5b0" puzzleId="15SuJ684gpB4vjrkiSBr"/> */}

                    {store.pendingInvitations.length > 0 &&
                        <PuzzleList key="invites" puzzles={store.pendingInvitations} title="Pending invitations..." />
                    }

                    {store.activePuzzles.length > 0 &&
                        <PuzzleList key="active" puzzles={store.activePuzzles} title="My puzzles..." />
                    }

                    <TemplateList key="templates" templates={store.templates} />
                </Fragment>
            </LoadingContainer>
        )
    } else {
        return (
            <AppBarConfig hideAppBar>
                <Div flex column={isPortrait} center alignCenter full >
                    <Div basis="50%" column justifyCenter alignCenter={isPortrait} alignEnd={!isPortrait}>
                        <Div maxWidth="256px" maxHeight="256px" m={[1,2,3,4]} >
                            <img width="100%" src="logo512.png" />
                        </Div>
                    </Div>

                    <Div column alignCenter basis="50%" alignCenter={isPortrait} alignStart={!isPortrait}>
                        <Div column alignCenter m={[1,2,3,4]}>
                            <Typography variant="h6">It's more fun together!</Typography>

                            <Login />
                        </Div>
                    </Div>
                </Div>
            </AppBarConfig>
        )
    }
}

export default observer(Home);