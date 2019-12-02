import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import ReactDOM from 'react-dom';
import AppContext from './AppContext'
import { AppBarTitle, AppBanner } from '../UI/StyledComponents/AppFrameComponents'

const AppFrameConfig = props => {
    const context = useContext(AppContext)
    const store = context.store
    const history = useHistory()

    useEffect(() => {
        // If we currently have an app bar showing,
        // and this is an initial navigation (as opposed to browser back/forward)
        // then we want to set a flag on the location state designating
        // that the back button in the appbar can use history.goBack(). Otherwise
        // the app bar's back button will simply go Home. This is to handle
        // cases where a page is loaded via direct URL and we would want the back 
        // button to go home, not to the previous page loaded in this browser tab
        if (store.appBar &&  history.action === 'PUSH') {
            window.history.replaceState({...window.history.state, appBarCanGoBack: true}, null)
        }
        store.setAppBar({
            hideAppBar: props.hideAppBar,
            showMenu: props.showMenu,
            showBackButton: props.showBackButton !== undefined ? props.showBackButton : !props.showMenu,
        })

    }, [])

    let content = props.appBarContent
    if (typeof content == 'string') {
        content = <AppBarTitle>{content}</AppBarTitle>
    }

    let appBanners = []
    if (props.banners) {

        appBanners = props.banners.map((x, idx) => (
            <AppBanner
                key={idx}
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