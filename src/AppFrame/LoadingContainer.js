import React, { Fragment, useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import "./LoadingContainer.css";

export default function (props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoading && props.provideWorkPromise) {
            props.provideWorkPromise().then(() => {
                console.log("promise finished");
                setIsLoading(false);
            }).catch((err) => {
                console.log(err);
                setError(props.errorMessage || "Loading failed.")
                setIsLoading(false);
            })
        }
    }, []);

    if (isLoading) {
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
        console.log("Rendering children")
        return props.children;
    }
}