import React, { useContext, useState, useEffect, useRef } from 'react';
import useRunOnce from '../Utility/useRunOnce'
import AppFrameConfig from '../AppFrame/AppFrameConfig'
import { Div } from '../UI/StyledComponents/StyledComponents';
import LoadingContainer from '../AppFrame/LoadingContainer';
import TemplatesStore from '../Stores/TemplatesStore'
import TemplateList from './TemplateList'
import { observer } from 'mobx-react'
const store = TemplatesStore.create()

const StartNewPuzzle = observer(props => {
    const [state, setState] = useState(0)
    const store = useRunOnce(()=> TemplatesStore.create())
    return (
        <AppFrameConfig appBarContent="Start a new puzzle">
            <LoadingContainer provideWorkPromise={store.fetch}>
                <Div onClick={()=>setState(state + 1)}>
                    {state}
                </Div>
                <TemplateList templates={store.filteredTemplates} />
            </LoadingContainer>
        </AppFrameConfig>
    );
})

export default StartNewPuzzle;