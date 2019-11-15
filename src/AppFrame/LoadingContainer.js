import React from 'react';
import logger from './AppLogger'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import AppContext from './AppFrameContext';

import "./LoadingContainer.css";

class LoadingContainer extends React.Component {
    processedPromise = React.createRef();
    calledProvideWorkPromise = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            isLoadingInternal: props.provideWorkPromise !== undefined,
            error: null
        }
    }

    setIsLoading = (value) => this.setState({ isLoadingInternal: value })
    setError = (value) => this.setState({ error: value })

    waitForPromise = (promise) => {

        this.setIsLoading(true)
        promise.then(() => {
            this.setIsLoading(false);
        }).catch((err) => {
            logger.error(err);
            this.setError(this.props.errorMessage || "Loading failed.")
            this.setIsLoading(false);
        })
    }

    checkForLoadingPromise = () => {
        if (this.props.isLoadingPromise && this.props.isLoadingPromise !== this.processedPromise.current) {
            this.processedPromise.current = this.props.isLoadingPromise
            this.waitForPromise(this.props.isLoadingPromise)
        }
    }
    componentDidMount() {
        // If we've been given a function that will provide a work promise
        // and we haven't already called it, then call it and wait on it now
        if (!this.calledProvideWorkPromise.current && this.props.provideWorkPromise) {
            this.calledProvideWorkPromise.current = true
            this.waitForPromise(this.props.provideWorkPromise())
        } else {

            this.checkForLoadingPromise()
        }
    }

    componentDidUpdate() {
        this.checkForLoadingPromise()
    }
    componentWillUnmount() {

    }

    static getDerivedStateFromError(error) {
        if (!error.severity || error.severity === "fail") {
            return { error: "Loading failed." }
        }
    }

    componentDidCatch(error, info) {
        error.componentStack = info.componentStack
        logger.error(error)

        if (error.severity == "notify") {
            this.context.setSnackBarMessage("Something went wrong.")
        }
    }

    render() {
        if (this.state.isLoadingInternal || this.props.isLoading) {
            return (
                <div className="LoadingContainer">
                    <Typography variant="h6" color="primary" gutterBottom>{this.props.message}</Typography >
                    <CircularProgress />
                </div>
            )
        } if (this.state.error) {
            return (
                <div className="LoadingContainer">
                    <Typography variant="h6" color="secondary" gutterBottom>{this.state.error}</Typography >
                </div>
            )
        } else {
            return this.props.children;
        }
    }
}

LoadingContainer.contextType = AppContext

export default LoadingContainer