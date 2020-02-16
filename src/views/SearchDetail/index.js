import React, {Component, useState, useEffect} from 'react';
import "./index.styl";
import {getArtistDetail, getPlayList, postSearch} from "../../services/NetEaseAxios";
import {MusicList} from "../../components";
import {connect} from "react-redux";
import * as dispatch from "../../actions/musicPlayer";
import musicPlayer from "../../reducers/musicPlayer";


function SearchDetail(props) {

    const [state, setState] = useState({
        ...props.location.state,
        word: props.match.params.word,
        lists: [],
        offset: 0,
        loadingMore: false,
        limit: 30,
        noResult: false,
    });

    function handleScrollBottom() {
        console.info('end');
        if (state.loadingMore) {
            setState(state => ({
                ...state,
                offset: state.offset + 1,
            }))
        }
    }

    useEffect(() => {
        props.saveSearchHistory(state.word);
    }, [state.word]);


    useEffect(() => {
        console.info(props);
        console.info(state.offset);
        // postSearch(state.word, 0).then(resp => {
        //     console.info(resp);
        // });
        // postSearch(state.word, 1).then(resp => {
        //     console.info(resp);
        // });
        // postSearch(state.word, 2).then(resp => {
        //     console.info(resp);
        // });
        postSearch(state.word, state.offset * state.limit, state.limit).then(resp => {
            let list = resp.data.result.songs;
            console.info(resp.data);
            if (!list) {
                //搜索列表为空
                setState(state => ({
                    ...state,
                    lists: [],
                    loadingMore: false,
                    noResult: true,
                }));
            } else {
                //搜索的歌曲需要调整格式
                list = list.map(item => ({
                    ...item,
                    artists: item.ar,
                    album: item.al,
                    duration: item.dt,
                }));
                const tempLists = state.lists;
                tempLists[state.offset] = list;
                setState(state => ({
                    ...state,
                    lists: tempLists,
                    loadingMore: list.length === 30,
                    noResult: false,
                }));
            }
        });
    }, [state.offset]);

    return (<>
        <div>
            <MusicList title={'搜索:' + state.word} list={state.lists.flat()} onScrollBottom={handleScrollBottom}
                       loadingMore={state.loadingMore} isInsert={true} noResult={state.noResult}/>
        </div>
    </>)
}

export default connect(state => ({musicPlayer: state.musicPlayer}), {...dispatch})(SearchDetail);