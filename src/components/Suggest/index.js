import React, {useState, useEffect, useRef} from 'react';
import propTypes from "prop-types";
import classNames from "classnames";
import * as dispatch from "../../actions/musicPlayer";
import {connect} from "react-redux";

import './index.styl';
import musicPlayer from "../../reducers/musicPlayer";

const noop = () => {
}

function Suggest(props) {

    useEffect(() => {
        console.info(props.data);
    });

    function replace(str) {
        try {
            return str.replace(new RegExp(props.word, 'gi'), `<span style="color:#ffcd32">$&</span>`);
        } catch (e) {
            return str;
        }
    }

    const suggestText = {
        songs: function (item) {
            const artists = item.artists.map(item => item.name).join(',');
            if (props.word) {
                return replace(`${item.name} - ${artists}`);
            }
            return `${item.name} - ${artists}`;
        },
        artists: function (item) {
            if (props.word) {
                return replace(item.name);
            }
            return item.name;
        }
    };

    function handleItemClick(item, i, e) {
        e.stopPropagation();
        props.onItemClick(item, i);
        //
    }


    return (
        <div className={'suggest'}>{
            props.data.order && props.data.order.map(i => (
                (i === 'songs' || i === 'artists') &&
                <ul key={`order${i}`} className="suggest-list">{
                    props.data[i].map((item, index) => (
                        <li key={`suggest${item.id}`}
                            onTouchStart={handleItemClick.bind(this, item, i)}
                            className="suggest-item">
                            <div className="icon"><i className={classNames({
                                'icon-mine': i === 'artists',
                                'icon-music': i === 'songs',
                            })}></i></div>
                            <div className="name">
                                <p className="text" dangerouslySetInnerHTML={{__html: suggestText[i](item)}}></p>
                            </div>
                        </li>))
                }</ul>
            ))
        }</div>
    );

}

Suggest.propTypes = {
    data: propTypes.object,
    word: propTypes.string,
    onItemClick: propTypes.func,
};

Suggest.defaultProps = {
    data: {},
    word: '',
    onItemClick: noop,
};

export default connect(state => ({musicPlayer: state.musicPlayer}), {...dispatch})(Suggest);