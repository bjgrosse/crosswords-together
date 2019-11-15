import React from 'react';

// This function takes a component...
export class ComponentWithSafeHandlers extends React.Component {
    safeHandler(fn) {
        return (...args) => {
            try {
                fn(args)
            } catch (error) {
                this.setState(s => { throw error })
            }
        }
    }
}

export default ComponentWithSafeHandlers