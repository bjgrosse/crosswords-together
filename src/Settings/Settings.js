import React from 'react';
import { AppContext } from '../AppFrame/AppFrameContext';

class Page extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    componentDidMount() {
        this.context.setContextBar({text: "Settings"})
    }

    componentWillUnmount() {
        this.context.setContextBar(null)
    }

    render() {
        return (
            <div><div>Coming soon</div></div>
        );
    }
}

Page.contextType = AppContext;

export default Page;