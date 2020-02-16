import React, {Component, useRef, useEffect, useState} from 'react';
import "./index.styl";
import propTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {SongList, MyScroll} from "../index";
import Loading from "../../components/Loading";
import {connect} from "react-redux";
import * as dispatch from "../../actions/musicPlayer";
import musicPlayer from "../../reducers/musicPlayer";
import {size} from "../../common/js/config";
import {setImageSize} from "../../common/js/dom";
import classNames from "classnames";

const noop = () => {
};

function MusicList(props) {

    const scrollRef = useRef();
    const bgImageRef = useRef();
    const headerRef = useRef();
    const scrollWrapperRef = useRef();
    const touch = {
        offset: 0
    };
    const [state, setState] = useState({
        bgImage: setImageSize(props.bgImage)
    });


    // useEffect(() => {
    //     console.info(window.innerHeight - bgImageRef.current.clientHeight);
    //     scrollRef.current.setHeight(window.innerHeight - size.miniPlayerHeight);
    //     const scrollHeight = scrollRef.current.scrollRef.current.clientHeight;
    // }, []);

    function onItemClick(item, index) {
        console.info(item);
        if (props.isInsert) {
            props.insertSong(props.musicPlayer, item);
        } else {
            //点击歌曲后，将整个歌单放入播放队列中
            props.sequencePlay(props.musicPlayer, props.list, index);
        }

    }


    function handleRandomPlay() {
        props.randomPlay(props.list);
    }

    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }

    return (
        <div className={'music-list'}>
            <div className={'music-list-header'}>
                <div className={'back'} onClick={props.history.goBack}>
                    <i className={'icon-back'}/>
                </div>
                <h1 className={'title'}>{props.title}</h1>
            </div>

            <div className={'list'}>
                <MyScroll
                    reference={scrollRef}
                    style={{}}
                    onScrollBottom={props.onScrollBottom}
                    className={'music-list-scroll'}
                >
                    <div className={classNames('bg-image', {
                        'no-bg-image': !props.bgImage,
                    })}
                         ref={bgImageRef}
                         style={{
                             backgroundImage: `url(${state.bgImage})`
                         }}>
                        {
                            props.list.length > 0 &&
                            <div className={'play-wrapper'}>
                                <div className={'play'} onClick={handleRandomPlay}>
                                    <i className={'icon-play'}/>
                                    <span className={'text'}>随机播放</span>
                                </div>
                            </div>
                        }
                        {/*<div className={'filter'}/>*/}
                    </div>

                    <div className="song-list-wrapper">
                        <Loading loading={props.list.length === 0 && !props.noResult}/>
                        <SongList list={props.list} rank={props.rank} onItemClick={onItemClick}/>
                        <div {...ifShow(props.noResult)} className={'list-no-result'}>这是空的</div>
                        {/*<div {...ifShow(props.loadingMore)} className={'loading-more'}><Loading></Loading></div>*/}
                        <Loading loading={props.loadingMore} height={30} iconHeight={20}/>
                    </div>
                </MyScroll>
            </div>
        </div>
    );


    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }

}

MusicList.propTypes = {
    list: propTypes.array,
    bgImage: propTypes.string,
    title: propTypes.string,
    rank: propTypes.bool,
    onScrollBottom: propTypes.func,
    loadingMore: propTypes.bool,
    isInsert: propTypes.bool,
    noResult: propTypes.bool
};

MusicList.defaultProps = {
    list: [],
    bgImage: "",
    title: "",
    rank: false,
    onScrollBottom: noop,
    loadingMore: false,
    isInsert: false,
    loading: false,

};

export default connect(state => ({musicPlayer: state.musicPlayer}), {...dispatch})(
    withRouter(MusicList));