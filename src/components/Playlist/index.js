import React, {useRef, useState, useEffect} from 'react';
import {useSpring, animated, useTransition} from "react-spring";
import {MyScroll, Confirm} from "../index";
import classNames from "classnames";

import './index.styl';


import propTypes from "prop-types";
import Scroll from "../Scroll";
import {playMode} from "../../common/js/config";

const noop = () => {
};
//阻止冒泡
const stopPropagation = (e) => {
    e.stopPropagation();
};

function Playlist(props) {

    const showAnimation = {
        y: 0,
        a: 0.3,
        show: 1,
    };

    const hiddenAnimation = {
        y: 100,
        a: 0,
        show: -0.1,
    };

    const [animation, setAnimation] = useSpring(() => (props.show ? showAnimation : hiddenAnimation));

    const animationStyle = {
        transform: animation.y.interpolate(y => `translate3d(0px,${y}%,0px)`),
    };

    const animationStyle1 = {
        display: animation.show.interpolate(show => {
            return show > 0 ? '' : 'none'
        }),
        backgroundColor: animation.a.interpolate(a => `rgba(0, 0, 0, ${a})`),
    };

    const hiddenTimer = useRef(0);
    const scrollCurrentTimer = useRef(0);
    const [state, setState] = useState(() => ({
        show: props.show,
    }));
    const scrollRef = useRef(null);
    const ulRef = useRef(null);
    const [confirmShow, setConfirmShow] = useState(false);

    useEffect(() => {
        clearTimeout(hiddenTimer.current);
        clearTimeout(scrollCurrentTimer.current);
        if (props.show) {
            setAnimation(showAnimation);
            setState(() => ({...state, show: true}));
            //滚动到当前歌曲
            scrollCurrentTimer.current = setTimeout(() => {
                scrollCurrentSong();
            }, 500);
        } else {
            setAnimation(hiddenAnimation);
            hiddenTimer.current = setTimeout(() => {
                setState(() => ({show: false}))
            }, 500);
        }
    }, [props.show]);

    //滑动到当前歌曲
    useEffect(() => {
        scrollCurrentSong();
    }, [props.currentSongId, props.playMode]);

    function scrollCurrentSong() {
        const fIndex = props.list.findIndex(item => item.id === props.currentSongId);
        if (scrollRef.current && ulRef.current && fIndex > 0) {
            scrollRef.current.scrollToElement(ulRef.current.children[fIndex], 500);
        }
    }

    function showItem(item) {
        return `${item.name} - ${item.artists.map(item => item.name).join(',')}`;
    }

    const transitions = useTransition(props.list, item => `playlist${item.id}`, {
        from: {opacity: 0, height: '0px'},
        enter: {opacity: 1, height: '40px'},
        leave: {opacity: 0, height: '0px'},
    });

    function showConfirm() {
        setConfirmShow(true);
    }

    function handleConfirmCancel() {
        setConfirmShow(false);
    }

    function handleConfirmClick() {
        setConfirmShow(false);
        props.onClear();
    }

    return (
        <div>{
            state.show && (<animated.div className="playlist" style={animationStyle1} onClick={props.onHidden}>
                <animated.div className="list-wrapper" onClick={stopPropagation} style={animationStyle}>
                    <div className="list-header">
                        <h1 className="title">
                            <i className={classNames('icon', {
                                "icon-sequence": playMode.sequence === props.playMode,
                                "icon-loop": playMode.loop === props.playMode,
                                "icon-random": playMode.random === props.playMode,
                            })} onClick={props.onPlayModeClick}/>
                            <span className="text"></span>
                            <span className="clear" onClick={showConfirm} {...ifShow(props.list.length)}><i
                                className="icon-clear"></i></span>
                        </h1>
                    </div>
                    <Scroll className="list-content" reference={scrollRef} animation={{speed: 10}} click={true}>
                        <ul ref={ulRef}>{
                            props.list.map((item, index) => (<li
                                key={`playlist${item.id}`}
                                onClick={props.onItemClick.bind(this, item, index)}
                                className="item">
                                <i className={classNames('current', {
                                    'icon-play': item.id === props.currentSongId,
                                })}></i>
                                <span className="text">{showItem(item)}</span>
                                <span onClick={stopPropagation}>
                                    {/*<span className="like" onClick={props.onItemLike.bind(this, item, index)}>*/}
                                    {/*<i className="icon-not-favorite"></i>*/}
                                    {/*</span>*/}
                                    <span className="delete" onClick={props.onItemDelete.bind(this, item, index)}><i
                                        className="icon-delete"></i></span>
                                </span>
                            </li>))
                        }</ul>
                    </Scroll>
                    <div className="list-operate">
                        <div className="add">
                            <i className="icon-add"></i>
                            <span className="text">添加歌曲到队列</span>
                        </div>
                    </div>
                    <div className="list-close" onClick={props.onHidden}>
                        <span>关闭</span>
                    </div>
                </animated.div>
            </animated.div>)
        }
            <Confirm show={confirmShow} onCancelClick={handleConfirmCancel}
                     onConfirmClick={handleConfirmClick} text={'是否清空'}></Confirm>
        </div>
    );

    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }

}

Playlist.propTypes = {
    list: propTypes.array,
    show: propTypes.bool,
    onHidden: propTypes.func,
    onShow: propTypes.func,
    onItemDelete: propTypes.func,
    onItemLike: propTypes.func,
    onClear: propTypes.func,
    onItemClick: propTypes.func,
    currentSongId: propTypes.number,
    playMode: propTypes.number,
    onPlayModeClick: propTypes.func,
};


Playlist.defaultProps = {
    list: [],
    show: false,
    onHidden: noop,
    onShow: noop,
    onItemDelete: noop,
    onItemLike: noop,
    onClear: noop,
    onItemClick: noop,
    playMode: playMode.sequence,
    onPlayModeClick: noop,
};

export default Playlist;

