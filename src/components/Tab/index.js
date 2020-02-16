import React, {Component} from 'react';
import {NavLink  as Link} from "react-router-dom";
import './index.styl';

class Tab extends Component {
    render() {
        return (
            <div className="tab">
                <Link tag="div" className="tab-item" to="/recommend" >
                    <span className="tab-link">推荐</span>
                </Link>
                <Link tag="div" className="tab-item" to="/singer">
                    <span className="tab-link">歌手</span>
                </Link>
                <Link tag="div" className="tab-item" to="/rank">
                  <span className="tab-link">排行
                  </span>
                </Link>
                <Link tag="div" className="tab-item" to="/search">
                    <span className="tab-link">搜索</span>
                </Link>
            </div>
        );
    }
}

export default Tab;