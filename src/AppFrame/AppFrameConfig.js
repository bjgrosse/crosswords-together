import React, { useContext, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import AppContext from './AppContext'
import { AppBarTitle, AppBanner } from '../UI/StyledComponents/AppFrameComponents'

const AppFrameConfig = props => {
    const context = useContext(AppContext)
    const store = context.store

    useEffect(() => {
        store.pushAppBar({ hideAppBar: props.hideAppBar, 
                                showMenu: props.showMenu,
                                showBackButton: props.showBackButton !== undefined ? props.showBackButton : !props.showMenu })

        // Clean-up
        return function () {
            store.popAppBar()
        }
    }, [])

    let content = props.appBarContent
    if (typeof content == 'string') {
        content = <AppBarTitle>{content}</AppBarTitle>
    }

    let appBanners = []
    if (props.banners) {

        appBanners = props.banners.map(x => (
            <AppBanner
                show={x.show}
                content={x.content}
                actions={x.actions} />
        ))

    }

    return (
        <>
            {context.appBarContentNode && content && ReactDOM.createPortal(content, context.appBarContentNode)}
            {context.appBarActionsNode && ReactDOM.createPortal(props.appBarActions, context.appBarActionsNode)}
            {context.bannerNode && appBanners && ReactDOM.createPortal(appBanners, context.bannerNode)}
            {props.children}
        </>
    );
}
export default AppFrameConfig;