import * as firebase from 'firebase/app';
import logger from './AppLogger'

import db from '../Database/Database'

const defaultOptions = {
    setPushMessagingEnabled: () => { }
}

class PushMessaging {

    constructor(options) {

        try {


            const messaging = firebase.messaging()
            options = { ...defaultOptions, ...options }
            this.token = null
            this.setPushMessagingEnabled = options.setPushMessagingEnabled

            this.pushMessagingSupported = true 
            
            messaging.usePublicVapidKey("BPIDndvC5gF6bhabyOu_rOYTPddHHPG9MfrgS1WSgGzMkaHfvnTfK93uPCd0pWCZBYR2rnL6KtXTOGVdUYXG9hY");

            messaging.onTokenRefresh(() => {
                this.getToken()
            })

            // Handle incoming messages. Called when:
            // - a message is received while the app has focus
            // - the user clicks on an app notification created by a service worker
            //   `messaging.setBackgroundMessageHandler` handler.
            messaging.onMessage((payload) => {
                console.log('Message received. ', payload);
                // ...
            });

            firebase.auth().onAuthStateChanged(
                (user) => {
                    this.setPushMessagingEnabled(false)
                    this.getToken()
                }
            );


            this.getToken()
        } catch (error) {
            logger.error(error)
        }
    }

    getToken(callback) {

        const messaging = firebase.messaging()
        // Get Instance ID token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.

        this.token = null

        messaging.getToken().then((currentToken) => {
            if (currentToken) {
                this.token = currentToken

                if (!this.isTokenSentToServer()) {
                    return this.sendToServer(currentToken)

                }
            }
        }).catch((err) => {
            logger.error(err);
            // We encountered an error. We want to try again automatically in a bit. 
            setTimeout(this.getToken.bind(this), 120000);
        }).finally(() => {
            this.setPushMessagingEnabled(this.token !== null)
            if (callback) callback(this.token !== null)
        })
    }

    requestPermissions(callback) {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                this.getToken(callback)
            } else {
                if (callback) callback(false)
            }
        });
    }

    sendToServer(token) {
        return db.saveFCMToken(token).then(() => this.setTokenSentToServer(true))
    }

    isTokenSentToServer() {
        if (!firebase.auth().currentUser) return true

        return window.localStorage.getItem('sentFcmTokenToServer_' + firebase.auth().currentUser.uid) === '1';
    }

    setTokenSentToServer(sent) {
        window.localStorage.setItem('sentFcmTokenToServer_' + firebase.auth().currentUser.uid, sent ? '1' : '0');
    }
}

export default PushMessaging
