import React, {useEffect, useState, useRef} from 'react';
import propTypes from "prop-types";

import './index.styl';

const noop = () => {
}

function SearchList(props) {

    function handleItemDelete(item, e) {
        e.stopPropagation();
        props.onItemDelete(item);
    }

    return (
        <div className={'search-list'} {...ifShow(props.list.length)}>
            <ul>{
                props.list.map(item => (<li
                    key={`history${item}`}
                    onClick={props.onItemClick.bind(this, item)}
                    className="search-item">
                    <span className="text">{item}</span>
                    <span className="icon" onClick={handleItemDelete.bind(this, item)}>
                        <i className="icon-delete"></i>
                    </span>
                </li>))
            }</ul>
        </div>
    );

    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }
}

SearchList.propTypes = {
    list: propTypes.array,
    onItemDelete: propTypes.func,
    onItemClick: propTypes.func,
};

SearchList.defaultProps = {
    list: [],
    onItemDelete: noop,
    onItemClick: noop,
};

export default SearchList;