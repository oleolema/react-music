import React, {Component} from 'react';
import './index.styl';

class MHeader extends Component {
    render() {
        return (
            <div className="m-header">
                <div className="icon"/>
                <h1 className="text">Chicken Music</h1>
                <router-link tag="div" className="mine" to="/user">
                    <i className="icon-mine"/>
                </router-link>
            </div>
        );
    }
}

export default MHeader;