import React, { useEffect, useState, useRef } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Divider from '@material-ui/core/Divider';
import { spacing } from '@material-ui/system';
import ClueList from './ClueList';
import { Div, Paper } from '../UI/StyledComponents/StyledComponents'
import styled from 'styled-components'
import ResizeObserver from 'resize-observer-polyfill';
import debounce from 'lodash.debounce'
import { observer } from 'mobx-react'
import { reaction } from 'mobx'

const TabItem = styled(Tab)`
    && {
        ${spacing}
        min-width:0px;
        min-height:0px;
        font-weight: ${props => props.selected ? 'bold' : "normal"}
        color: ${p => p.theme.palette.text.primary}
    }
`
const TabList = styled(Tabs)`
    && {
        min-height:0px;
    }
`

const ClueLists = observer(props => {
    const wordLists = [
        { title: "Across", index: 0, words: props.puzzle.wordsAcross() },
        { title: "Down", index: 1, words: props.puzzle.wordsDown() }
    ]

    const [width, setWidth] = useState(999)
    const ref = useRef();
    const showTabs = useMediaQuery('(max-width:960px) and (orientation: landscape') || width < 400;
    const [selectedList, setSelectedList] = useState(wordLists[0])


    const handleChange = (event, newValue) => {
        setSelectedList(wordLists[newValue]);
    };

    const sizeChanged = new ResizeObserver((entries, observer) => {
        updateWidth()
    });

    const updateWidth = debounce(() => {
        if (!ref.current) return;

        setWidth(ref.current.clientWidth)
    }, 50);

    useEffect(() => {
        sizeChanged.observe(ref.current);

        const disposeAutoRun = reaction(()=> props.puzzle.selectedWord,
        (selectedWord) => {
            if (selectedWord) {
                if (selectedWord.id.startsWith("h")) {
                    setSelectedList(wordLists[0])
                } else {
                    setSelectedList(wordLists[1])
                }
            }
        })

        return () => {
            sizeChanged.disconnect()
            disposeAutoRun()
        }
    })

    const selectWord = (word) => {
        props.puzzle.selectWord(word)
    }

    let content;

    if (showTabs) {
        content =
            <>
                <TabList variant="fullWidth" indicatorColor="primary" value={selectedList.index} onChange={handleChange}>
                    {wordLists.map(list =>
                        <TabItem 
                            key={list.title}
                            pb={.5}
                            label={list.title} />
                    )}
                </TabList>
                <Divider/>
                <ClueList
                    showTitle={false}
                    title={selectedList.title}
                    words={selectedList.words}
                    canEdit={props.puzzle.editMode}
                    handleSelectWord={selectWord} />
            </>

    }
    else {
        content = wordLists.map((list, index) =>
            <Div
                key={list.title}
                flex alignStretch grow >
                <ClueList
                    showTitle={true}
                    title={list.title}
                    words={list.words}
                    canEdit={props.puzzle.editMode}
                    handleSelectWord={selectWord}  />
            </Div>
        )
    }

    return (

        <Paper flex column={showTabs} ref={ref} alignStretch minHeight={100} minWidth={200} grow>
            {content}
        </Paper>
    )
})

export default ClueLists;