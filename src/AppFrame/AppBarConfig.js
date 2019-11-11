import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './AppFrameContext'
import { AppBarTitle } from '../StyledComponents/AppFrameComponents'

const AppBarConfig = props => {
    const context = useContext(AppContext)

    useEffect(()=> {
        context.pushContextBar({})

        // Clean-up
        return function() {
            context.popContextBar()
        }
    }, [])

    if (!context.appBarContentNode || !context.appBarActionsNode){
        return <div/>
    }

    let content = props.content
    if (typeof content == 'string') {
        content = <AppBarTitle>{content}</AppBarTitle>
    }
    return (
        <>
        {ReactDOM.createPortal(content, context.appBarContentNode) }
        {ReactDOM.createPortal(props.actions, context.appBarActionsNode)}
        </>
    );
}
export default AppBarConfig;