import React, { Fragment, useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import "./LoadingContainer.css";

export default function (props) {
    const [isLoadingInternal, setIsLoading] = useState(props.provideWorkPromise !== undefined);
    const [error, setError] = useState(null);
    const [processedPromise, setProcessedPromise] = useState(null);
    const [calledProvideWorkPromise, setCalledProvideWorkPromise] = useState(false);

    const waitForPromise = (promise) => {

        console.log("waitForPromise");
        setIsLoading(true)
        promise.then(() => {
            console.log("promise finished");
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setError(props.errorMessage || "Loading failed.")
            setIsLoading(false);
        })
    }
    useEffect(() => {

        if (props.isLoadingPromise && props.isLoadingPromise !== processedPromise) {
            setProcessedPromise(props.isLoadingPromise)
            waitForPromise(props.isLoadingPromise)
        } else if (!calledProvideWorkPromise && props.provideWorkPromise) {
            setCalledProvideWorkPromise(true)
            waitForPromise(props.provideWorkPromise())
        }
    });

    if (isLoadingInternal || props.isLoading) {
        return (
            <div className="LoadingContainer">
                <Typography variant="h6" color="primary" gutterBottom>{props.message}</Typography >
                <CircularProgress />
            </div>
        )
    } if (error) {
        return (
            <div className="LoadingContainer">
                <Typography variant="h6" color="secondary" gutterBottom>{error}</Typography >
            </div>
        )
    } else {
        return props.children;
    }
}