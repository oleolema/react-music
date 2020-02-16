import React, {useEffect, useRef, useState} from 'react';
import propTypes from "prop-types";

import './index.styl';

const noop = () => {
};

function SearchBox(props) {

    const [searchValue, setSearchValue] = useState('');

    function handleChange(e) {
        const result = props.onChange(e.target.value);
        setSearchValue(typeof result === 'undefined' ? e.target.value : result);
    }

    useEffect(() => {
        setSearchValue(props.value);
    }, [props.value]);

    function clearValue() {
        setSearchValue('');
        props.onChange('');
    }

    function handleSearchButtonClick() {
        props.onSearch(searchValue);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            props.onSearch(searchValue);
        }
    }

    return (
        <label className={'search-box'} htmlFor={'search-input-box'}>
            <i className="icon-search"></i>
            <input type="text" placeholder={props.placeholder} value={searchValue} onChange={handleChange}
                   onKeyPress={handleKeyPress}
                   onBlur={props.onBlur}
                   onFocus={props.onFocus}
                   className="box" id='search-input-box' autoComplete={'off'}/>
            <i className="icon-dismiss" onClick={clearValue} {...ifShow(searchValue)}/>
            <button type="button" className={'search-button'} onClick={handleSearchButtonClick}>搜索</button>
        </label>
    );

    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }
}

SearchBox.propTypes = {
    placeholder: propTypes.string,
    onChange: propTypes.func,
    onSearch: propTypes.func,
    value: propTypes.string,
    onBlur: propTypes.func,
    onFocus: propTypes.func,

};

SearchBox.defaultProps = {
    placeholder: '',
    onChange: noop,
    onSearch: noop,
    value: '',
    onBlur: noop,
    onFocus: noop,
};


export default SearchBox;