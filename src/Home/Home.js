import React, { Fragment, useContext } from 'react';
import { observer } from 'mobx-react'
import { AppContext } from '../AppFrame/AppContext';

import PuzzlesStore from '../Stores/PuzzlesStore';
import PuzzleList from './PuzzleList'
import TemplateList from './TemplateList'
import LoadingContainer from '../AppFrame/LoadingContainer';
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import Login from '../AppFrame/Login';
import { Div } from '../UI/StyledComponents'
import WelcomeMessage from './WelcomeMessage';
import NewPuzzleMessage from './NewPuzzleMessage';
const store = PuzzlesStore.create();

function Home(props) {
    const context = useContext(AppContext);

    const loadPuzzles = async () => {
        await store.fetch();
    }

    let content
    if (context.user) {
        content = (
            <LoadingContainer provideWorkPromise={loadPuzzles}>
                <Fragment>
                    <Div fullWidth>
                        {store.puzzles.length == 0 ?
                            <WelcomeMessage />
                            :
                            <NewPuzzleMessage />
                        }   

                        {store.pendingInvitations.length > 0 &&
                            <PuzzleList key="invites" puzzles={store.pendingInvitations} title="Pending invitations..." />
                        }

                        {store.activePuzzles.length > 0 &&
                            <PuzzleList key="active" puzzles={store.activePuzzles} title="My puzzles..." />
                        }

                        <TemplateList key="templates" templates={store.templates} />
                    </Div>
                </Fragment>
            </LoadingContainer>
        )
    } else {
        return (
            content = <Login />
        )
    }

    return (
        <AppFrameConfig showMenu={true} appBarContent={
            <Div width={[256, 256, 400]} ml={1}><img style={{ verticalAlign: 'middle' }} src="/inline-logo.png" alt="CROSSWORDS together" width="100%" /></Div>
        }>
            {content}
        </AppFrameConfig>
    )
}

export default observer(Home);