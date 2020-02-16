import React, {useState, useRef, useEffect} from 'react';
import './index.styl'
import {SearchBox, Suggest, SearchList, Confirm, MyScroll} from "../../components";
import {postHotSearch, postSearchSuggest, postSearch} from "../../services/NetEaseAxios";
import {connect} from "react-redux";
import * as dispatch from '../../actions/musicPlayer'


function Search(props) {

    const [hotKeys, setHotKeys] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [suggestData, setSuggestData] = useState({});
    const [suggestFocus, setSuggestFocus] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    useEffect(() => {
        postHotSearch().then(resp => {
            setHotKeys(resp.data.result.hots);
        });
        console.info('aaa', props.musicPlayer.searchHistory);
    }, []);

    const searchSuggestTimer = useRef(0);

    function handleChange(e) {
        setSearchValue(e);
        clearTimeout(searchSuggestTimer.current);
        if (e === '') {
            setSuggestData({});
            return;
        }
        searchSuggestTimer.current = setTimeout(() => {
            postSearchSuggest(e).then(resp => {
                if (resp.data.result) {
                    setSuggestData(resp.data.result);
                } else {
                    setSuggestData({});
                }
            });
        }, 200);

    }

    function handleHotKeyClick(item, index) {
        console.info(searchValue);
        setSearchValue(item.first);
        props.history.push(`/search/${item.first}`);
    }

    function handleSearch(value) {
        props.history.push(`/search/${value}`);
    }

    function handleSuggestItemClick(item, type) {
        // if(type === 'ar')
        console.info(type);
        // alert();
        if (type === 'songs') {
            // this.props.history.push({
            //     pathname: `/singer/${item.id}`,
            //     state: {artist: item}
            // });
            const value = `${item.name} ${item.artists.map(i => i.name).join(' ')}`;
            setSearchValue(value);
            props.history.push(`/search/${value}`);
        } else if (type === 'artists') {

            props.history.push({
                pathname: `/singer/${item.id}`,
                state: {artist: item}
            });
            props.saveSearchHistory(item.name);
        }
        // props.history.push(`/search/${item.}`);
        console.info(item);
    }

    function handleSearchBlur() {
        setSuggestFocus(false);
    }

    function handleSearchFocus() {
        setSuggestFocus(true);
        handleChange(searchValue);
    }

    function handleHistoryDelete(item) {
        props.deleteSearchHistory(item)
    }

    function handleHistoryClick(item) {
        setSearchValue(item);
        props.history.push(`/search/${item}`);
    }

    function handleClearHistory() {
        setShowConfirm(true);

    }

    function handleConfirmClick() {
        setShowConfirm(false);
        props.clearSearchHistory();
    }

    function handleCancelClick() {
        setShowConfirm(false);
    }

    return (
        <div className={'search'}>
            <div className="search-box-wrapper">
                <SearchBox placeholder={'搜索'} onChange={handleChange} value={searchValue}
                           onSearch={handleSearch} onBlur={handleSearchBlur} onFocus={handleSearchFocus}></SearchBox>
            </div>
            <div className="shortcut-wrapper">
                <MyScroll className="shortcut">
                    <div className="hot-key">
                        <h1 className="title">热门搜索</h1>
                        <ul>{
                            hotKeys.map((item, index) => (<li
                                className={'item'}
                                onClick={handleHotKeyClick.bind(this, item, index)}
                                key={`hots${item.first}`}>{item.first}</li>))
                        }</ul>
                    </div>
                    <div className="search-history" {...ifShow(props.musicPlayer.searchHistory.length)}>
                        <h1 className="title">
                            <span className="text">搜索历史</span>
                            <span className="clear" onClick={handleClearHistory}>
                                <i className="icon-clear"></i>
                            </span>
                        </h1>
                        <SearchList list={props.musicPlayer.searchHistory}
                                    onItemDelete={handleHistoryDelete} onItemClick={handleHistoryClick}></SearchList>
                    </div>
                </MyScroll>
            </div>
            <div className="search-result" {...ifShow(suggestFocus && Object.keys(suggestData).length > 0)}>
                <Suggest data={suggestData} word={searchValue} onItemClick={handleSuggestItemClick}></Suggest>
            </div>
            <Confirm text={'确定清空？'} show={showConfirm} onConfirmClick={handleConfirmClick}
                     onCancelClick={handleCancelClick}></Confirm>
        </div>
    );

    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }

}

export default connect(state => ({musicPlayer: state.musicPlayer}), {...dispatch})(Search);