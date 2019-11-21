import React from 'react';
import logger from './AppLogger'
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import AppContext from './AppContext';

import "./LoadingContainer.css";
import { Div } from '../UI/StyledComponents/StyledComponents';

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

        if (error.severity == "warn") {
            this.context.store.setSnackBarMessage("Something went wrong.")
        }
    }

    render() {
        if (this.state.isLoadingInternal || this.props.isLoading) {
            return (
                <Div full justifyCenter className="LoadingContainer">
                    <Typography color="primary" gutterBottom>{this.props.message}</Typography >
                    <CircularProgress />
                </Div>
            )
        } if (this.state.error) {
            return (
                <Div full justifyCenter className="LoadingContainer">
                    <Typography color="secondary" gutterBottom>{this.state.error}</Typography >
                </Div>
            )
        } else {
            return this.props.children;
        }
    }
}

LoadingContainer.contextType = AppContext

export default LoadingContainer