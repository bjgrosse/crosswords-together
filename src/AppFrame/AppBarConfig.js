import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './AppFrameContext'
import { AppBarTitle } from '../StyledComponents/AppFrameComponents'

const AppBarConfig = props => {
    const context = useContext(AppContext)

    useEffect(()=> {
        context.pushContextBar({hideAppBar: props.hideAppBar})

        // Clean-up
        return function() {
            context.popContextBar()
        }
    }, [])

    let content = props.content
    if (typeof content == 'string') {
        content = <AppBarTitle>{content}</AppBarTitle>
    }
    return (
        <>
        {context.appBarContentNode && content && ReactDOM.createPortal(content, context.appBarContentNode) }
        {context.appBarActionsNode && ReactDOM.createPortal(props.actions, context.appBarActionsNode)}
        {props.children}
        </>
    );
}
export default AppBarConfig;