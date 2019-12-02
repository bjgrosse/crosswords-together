import React, { useContext, useState, useEffect } from 'react';
import LoadingContainer from '../AppFrame/LoadingContainer';

const ActivityList = props => {

    return (
        <LoadingContainer provideWorkPromise={props.puzzle.loadActivity}> 
            
        </LoadingContainer>
    );
}
export default ActivityList;