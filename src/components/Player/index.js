import React, {useEffect, useState, useRef, useCallback} from 'react';
import propTypes from "prop-types";
import './index.styl';
import {connect} from "react-redux";
import * as dispatch from "../../actions/musicPlayer";
import {useSpring, animated, useTransition, useSprings, interpolate, config as springConfig} from 'react-spring'
import classNames from "classnames";
import {postLyric, postMusic} from "../../services/NetEaseAxios";
import {ProgressBar, ProgressBarCircle} from "../index";
import AudioProgress from "./AudioProgress";
import {setPlayingState} from "../../actions/musicPlayer";
import {playMode} from "../../common/js/config";
import LyricParser from "lyric-parser";
import {Scroll, Playlist} from "../index";
import MyScroll from "../MyScroll";
import {withRouter} from "react-router-dom";
import {DownloadIcon} from "../../common/icon";


const noop = () => {
};

function Player(props) {

    const normalPlayerRef = useRef(null);
    const audioRef = useRef(null);
    const lyricLinesRef = useRef(null);
    const lyricScrollRef = useRef(null);

    const musicPlayer = props.musicPlayer;
    const currentSong = props.musicPlayer.currentSong(props.musicPlayer);
    const [playlistState, setPlaylistState] = useState({
        show: false,
    });

    //歌词
    const initCurrentLyric = {
        lines: [],
        play: noop,
        stop: noop,
        togglePlay: noop,
        seek: noop,
        //是否有翻译
        hasTranslate: false,
        //是否有歌词
        noLyric: false,
    };

    const currentLyricRef = useRef(initCurrentLyric);
    if (currentSong.id) {
        currentSong.singer = currentSong.artists.map(item => item.name).join(',');
        currentSong.image = currentSong.album.picUrl;
        currentSong.time = currentSong.duration / 1000;
        currentSong.formattedTime = toTime(currentSong.duration / 1000)
    }

    //动画开始
    //图片位置信息
    const [_imagePosAndScale] = useState(() => {
        let obj = {};
        //小图片宽度
        obj.targetWidth = 40;
        //小图片中心到左边距离
        obj.paddingLeft = 40;
        //小图片中心到底边距离
        obj.paddingBottom = 30;
        //大图片中心到顶部距离
        obj.paddingTop = 80;
        //大图片宽度
        obj.width = window.innerWidth * 0.8;
        //大图片 与 小图片 缩放比
        obj.scale = obj.targetWidth / obj.width;
        //大图片中心到小图片中心x偏移
        obj.x = -(window.innerWidth / 2 - obj.paddingLeft);
        //大图片中心到小图片中心y偏移
        obj.y = window.innerHeight - obj.paddingTop - obj.width / 2 - obj.paddingBottom;
        return obj;
    });

    const [miniAnimation] = useState({
        x: 100,     //全局x位置
        y: 0,       //全局y位置
        o: 0,       //全局透明度
        y1: -100,   //顶部y
        y2: 100,    //底部y
        y3: 0,      //小界面y
        show: -0.3, //是否显示 小于0不显示
        //图片位置信息
        imageX: _imagePosAndScale.x,
        imageY: _imagePosAndScale.y,
        imageSc: _imagePosAndScale.scale,
    });

    const [fullAnimation] = useState({
        x: 0,
        y: 0,
        y1: 0,
        y2: 0,
        y3: 100,
        o: 1,
        show: 1,
        imageX: 0,
        imageY: 0,
        imageSc: 1,
    });

    //整个界面动画
    const initAnimation = props.musicPlayer.fullScreen ? fullAnimation : miniAnimation;
    const [animation, setAnimation] = useSpring(() => ({
        ...initAnimation,
        config: {mass: 1, tension: 350, friction: 26}
    }));


    const normalPlayerStyle = {
        transform: animation.y.interpolate(y => ` translate3d(0,${y}%,0)`),
        opacity: animation.o.interpolate(o => o),
        visibility: animation.show.interpolate(show => show > 0 ? 'visible' : 'hidden'),
        zIndex: animation.show.interpolate(show => show > 0 ? '150' : '-10')
        // display: animation.show.interpolate(show => show > 0 ? '' : 'none'),
    };

    const topStyle = {
        transform: animation.y1.interpolate(y1 => ` translate3d(0,${y1}%,0)`),
    };

    const bottomStyle = {
        transform: animation.y2.interpolate(y2 => ` translate3d(0,${y2}%,0)`),
    };

    const miniPlayerStyle = {
        transform: animation.y3.interpolate(y3 => ` translate3d(0,${y3}%,0)`),
    };

    const imageStyle = {
        transform: interpolate([animation.imageX, animation.imageY, animation.imageSc], (x, y, sc) => (
            `translate3d(${x}px,${y}px,0) scale(${sc})`
        )),
    };

    //按钮点击动画
    const [clickAnimations, setClickAnimations] = useSprings(6, i => ({
        sc: 1,
        config: {mass: 1, tension: 1000, friction: 10}
    }));

    let clickAnimationStyles = [];

    clickAnimations.map(({sc}, i) => {
        clickAnimationStyles[i] = {transform: sc.interpolate(sc => `scale(${sc})`)}
    });

    //歌词，专辑图片切换动画
    const hiddenLyricSpring = {
        o: 0,
        show: -0.3, //是否显示 小于0不显示
        o1: 1,
        show1: 1,
    };
    const showLyricSpring = {
        o1: 0,
        show1: -0.3, //是否显示 小于0不显示
        o: 1,
        show: 1,
    };
    const [lyricAnimation, setLyricAnimation] = useSpring(() => hiddenLyricSpring);

    const lyricAnimationStyle = {
        opacity: lyricAnimation.o.interpolate(o => `${o}`),
        visibility: lyricAnimation.show.interpolate(show => show > 0 ? 'visible' : 'hidden'),
    };
    const lyricAnimationStyle1 = {
        opacity: lyricAnimation.o1.interpolate(o => `${o}`),
        visibility: lyricAnimation.show1.interpolate(show => show > 0 ? 'visible' : 'hidden'),
    };

    function hiddenLyricAnimationClick() {
        setLyricAnimation(hiddenLyricSpring);
    }

    function showLyricAnimationClick() {
        setLyricAnimation(showLyricSpring);
    }


    //动画结束


    //播放器逻辑

    const [currentTime, setCurrentTime] = useState(0);
    const [currentLineNum, setCurrentLineNum] = useState(0);
    const fullScreen = useRef({
        fullScreen: false,
    });

    useEffect(() => {
        if (musicPlayer.fullScreen) {
            //如果没有全屏标志
            if (!props.location.search.includes("fullScreen=true")) {
                props.setFullScreen(false);
            }
        }
        //如果是全屏

    }, [props.location.search]);

    function closeFullScreen() {
        props.history.goBack();
        props.setFullScreen(false);
    }

    function openFullScreen() {
        props.setFullScreen(true);
    }

    //当fullScreen改变时调用 ， 是否全屏
    useEffect(() => {
        // //console.info('fullScreen: 改变' + musicPlayer.fullScreen);
        fullScreen.current.fullScreen = musicPlayer.fullScreen;
        //是否开启全屏
        if (musicPlayer.fullScreen) {
            setAnimation(fullAnimation);
            const search = props.location.search ? props.location.search + "&" : '?';
            if (!props.location.search.includes("fullScreen=true")) {
                //添加一个全屏标记
                props.history.push(`${props.location.pathname}${search}fullScreen=true`);
            }
        } else {

            setAnimation(miniAnimation);
        }
    }, [musicPlayer.fullScreen]);


    const postMusicTimerRef = useRef(0);

    function lyricPlay() {
        // //console.info(audioRef.current.paused);
        if (!audioRef.current.paused && audioRef.current.readyState === 4) {
            //console.info("歌词播放")
            currentLyricRef.current.togglePlay();
            currentLyricRef.current.seek(audioRef.current.currentTime * 1000);
        }
    }

    function lyricPause() {
        //console.info(audioRef.current.paused);
        if (audioRef.current.paused) {
            //console.info("歌词暂停")
            currentLyricRef.current.seek(audioRef.current.currentTime * 1000);
            currentLyricRef.current.togglePlay();


        }
    }

    const noMusicTimer = useRef(0);

    //当currentSong.id改变时调用 , 请求歌曲
    useEffect(() => {
        (function () {
            console.info('currentSong.id: 改变' + musicPlayer.fullScreen);
            if (typeof currentSong.id === 'undefined') {
                return;
            }
            props.setCurrentSongUrl(musicPlayer, "");
            clearTimeout(postMusicTimerRef.current);
            clearTimeout(noMusicTimer.current);
            const timer = setTimeout(async () => {
                //请求歌词
                await postLyric(currentSong.id)
                    .then(resp => {
                        console.info(resp);
                        let lyric = initCurrentLyric;
                        //没有歌词
                        if (resp.data.nolyric) {
                            lyric.noLyric = resp.data.nolyric;
                        } else {
                            lyric = new LyricParser(resp.data.lrc.lyric, handleLyric);
                            //没有歌词
                            if (lyric.lines.length === 0) {
                                lyric.noLyric = true;
                            }
                            //有歌词
                            console.info(lyric);
                            //有翻译
                            if (resp.data.tlyric.lyric) {
                                const tLyric = new LyricParser(resp.data.tlyric.lyric);
                                //设置歌词翻译
                                lyric.hasTranslate = true;
                                for (let i = 0, j = 0; i < lyric.lines.length; i++) {
                                    let l = lyric.lines[i];
                                    let t = tLyric.lines[j];
                                    if (l.time === t.time) {
                                        l.txt = `${l.txt}<br>${t.txt}`;
                                        j++;
                                    }
                                }
                            }
                        }
                        //停止上一个定时器
                        currentLyricRef.current.stop();
                        currentLyricRef.current = (lyric);
                    }).catch(() => {
                        console.info('error');
                        currentLyricRef.current = ({
                            ...initCurrentLyric,
                            noLyric: true,
                        });
                    });
                //请求歌曲
                await postMusic(currentSong.id)
                    .then(resp => {
                        const data = resp.data.data;
                        if (!data[0].url) {
                            noMusic();
                            return;
                        }
                        props.setCurrentSongUrl(musicPlayer, data[0].url);
                        playAndPause();
                        //TODO 临时音量
                        // audioRef.current.volume = 0.1;
                        //console.info(resp);
                    });
            }, 200);
            postMusicTimerRef.current = (timer);
        })();

        //清除状态
        return () => {
            currentLyricRef.current.stop();
            currentLyricRef.current = (initCurrentLyric);
            setCurrentLineNum(0);
            setCurrentTime(0);
        };
    }, [currentSong.id]);

    function noMusic() {
        console.info("该歌曲无版权或为付费无法播放，3秒后切换到下一首");
        noMusicTimer.current = setTimeout(() => {
            props.setCurrentIndex((musicPlayer.currentIndex + 1) % musicPlayer.playlist.length);
        }, 3000);
    }


    function handleLyric({lineNum, txt}) {
        //console.info(lineNum, txt, currentSong.name);
        setCurrentLineNum(lineNum);
        const maxLine = currentLyricRef.current.hasTranslate ? 2 : 3;
        // console.info(currentLyricRef.current);
        if (lineNum > maxLine) {
            const curEle = lyricLinesRef.current.children[lineNum - maxLine];
            // //console.info(curEle);
            lyricScrollRef.current.scrollToElement(curEle, 1000);
        } else {
            lyricScrollRef.current.scrollToElement(lyricLinesRef.current.children[0], 1000);
        }
    }

    //可以播放时触发
    function handleCanPlay() {
        if (currentTime === 0) {
            //console.info('canPlay', currentTime);
            currentLyricRef.current.play();
        } else {

        }
    }


    function handleAudioCanPlay() {
    }

    function handleAudioPlay() {
        lyricPlay();
    }

    //暂停触发
    function handleAudioPause() {
        lyricPause();
    }

    //当musicPlayer.playing 改变时， 播放或暂停
    useEffect(() => {
        //console.info('musicPlayer.playing: 改变' + musicPlayer.fullScreen);
        playAndPause();
    }, [musicPlayer.playing]);

    function playAndPause() {
        if (musicPlayer.playing) {
            audioRef.current.play().catch(noop);
        } else {
            audioRef.current.pause();
        }
    }

    function handleSequenceClick() {
        handleAnimationClick(0);
        let mode = (musicPlayer.mode + 1) % 3;
        let list;
        if (mode === playMode.random) {
            list = [...musicPlayer.sequenceList].sort(() => Math.random() - 0.5);
        } else if (mode === playMode.loop || mode === playMode.sequence) {
            list = [...musicPlayer.sequenceList];
        }
        const curIndex = list.findIndex((item) => item.id === currentSong.id);
        //设置播放模式
        props.setPlayMode(mode, list, curIndex);
    }

    function handlePrevClick() {
        props.setCurrentIndex((musicPlayer.currentIndex - 1 + musicPlayer.playlist.length) % musicPlayer.playlist.length);
        handleAnimationClick(1);
    }

    function handlePlayAndPauseClick(e) {
        e.stopPropagation();
        props.setPlayingState(!musicPlayer.playing);
        handleAnimationClick(2);
    }

    function handleNextClick() {
        props.setCurrentIndex((musicPlayer.currentIndex + 1) % musicPlayer.playlist.length);
        handleAnimationClick(3);
    }

    function handleFavoriteClick() {
        handleAnimationClick(4);
        if (!musicPlayer.currentSongUrl) {
            return;
        }
        console.info(musicPlayer.currentSongUrl);
        window.open(musicPlayer.currentSongUrl, '_blank', "centerscreen=yes,resizable=0,modal=false,alwaysRaised=yes");

    }

    function handlePlayListClick(e) {
        e.stopPropagation();
        setPlaylistState({
            ...playlistState,
            show: true,
        });
        handleAnimationClick(5);
    }

    function handlePlaylistShow() {
        setPlaylistState({
            ...playlistState,
            show: true,
        });
    }

    function handlePlaylistHidden() {
        setPlaylistState({
            ...playlistState,
            show: false,
        });
    }

    const handleAnimationClickTimer = useRef(0);

    function handleAnimationClick(j) {
        clearTimeout(handleAnimationClickTimer.current);
        setClickAnimations(i => ({
            sc: i === j ? 1.1 : 1,
        }));
        handleAnimationClickTimer.current = setTimeout(() => {
            setClickAnimations(i => ({
                sc: i === j ? 1 : 1,
            }));
        }, 50);
    }

    function handleAudioError() {
    }

    const progressMove = useRef({
        initiated: false,
    });

    //播放结束
    function handleAudioEnd() {
        //如果是单曲循环模式，或者播放列表只有一首歌
        if (playMode.loop === musicPlayer.mode || musicPlayer.playlist.length === 1) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            currentLyricRef.current.seek(0);
        } else {
            props.setCurrentIndex((musicPlayer.currentIndex + 1) % musicPlayer.playlist.length);
        }
    }

    function handleAudioTimeUpdate(e) {
        if (progressMove.current.initiated) {
            return;
        }
        setCurrentTime(e.target.currentTime);
    }

    //滑动开始
    function handleProgressBarMoveStart() {
        progressMove.current = {
            initiated: true,
        };
    }

    //进度条滑动中
    function handleProgressBarMoving(percent) {
        console.info(currentSong.time)
        setCurrentTime(currentSong.time * percent);
    }

    //进度条滑动结束
    function handleProgressBarMoveEnd(percent) {
        progressMove.current = {
            initiated: false,
        };
        audioRef.current.currentTime = currentSong.time * percent;
        currentLyricRef.current.seek(currentSong.time * percent * 1000);
        props.setPlayingState(true);
    }

    function handleProgressBarClick(percent) {
        //console.info(percent);
        audioRef.current.currentTime = currentSong.time * percent;
        currentLyricRef.current.seek(currentSong.time * percent * 1000);
        props.setPlayingState(true);
    }

    function toTime(time) {
        if (Number.isNaN(Number(time))) {
            return 0;
        }
        const minute = String(time / 60 | 0).padStart(2, '0');
        const second = String(time % 60 | 0).padStart(2, '0');
        return `${minute}:${second}`;
    }

    function getCurrentSongPercent() {
        const percent = currentTime / currentSong.time;
        return Number.isNaN(percent) ? 0 : percent;
    }

    function handlePlaylistItemLike(item) {
        console.info('like' + item);
    }

    function handlePlaylistItemDelete(item) {
        props.deleteSong(musicPlayer, item);
        console.info('delete' + item);
    }

    function handlePlaylistItemClick(item) {
        console.info('click' + item);
        props.setCurrentSong(musicPlayer, item);
    }

    function handlePlaylistClear() {
        props.clearList();
        console.info('clear');
    }

    return (
        <div

            className={'player'}>
            <animated.div
                className={'normal-player'}
                style={normalPlayerStyle}
                ref={normalPlayerRef}
            >
                <div className={'background'}>
                    <img width={'100%'} height={'100%'} src={currentSong.image}/>
                </div>
                <animated.div className="top" style={topStyle}>
                    <div className="back" onClick={closeFullScreen}><i className="icon-back"/></div>
                    <animated.h1 className="title">{currentSong.name}</animated.h1>
                    <h2 className="subtitle">{currentSong.singer}</h2>
                </animated.div>

                <div className="middle">
                    <animated.div className={'middle-l-wrapper'} style={lyricAnimationStyle1}
                                  onClick={showLyricAnimationClick}>
                        <div className="middle-l">
                            <animated.div className="cd-wrapper" style={imageStyle}>
                                <div className={classNames('cd', {
                                    "play": musicPlayer.playing,
                                    "play pause": !musicPlayer.playing,
                                })}>
                                    <img
                                        src={currentSong.image}
                                        className={'image'}
                                    />
                                </div>
                            </animated.div>
                            <div
                                className="playing-lyric-wrapper" {...ifShow(currentLyricRef.current.lines.length > 0)}>
                                <div
                                    className="playing-lyric"
                                    dangerouslySetInnerHTML={{__html: currentLyricRef.current.lines[currentLineNum] && currentLyricRef.current.lines[currentLineNum].txt}}></div>
                            </div>
                        </div>
                    </animated.div>
                    <animated.div className={'middle-r-wrapper'} style={lyricAnimationStyle}
                                  onClick={hiddenLyricAnimationClick}>
                        <Scroll className="middle-r" reference={lyricScrollRef} click={true}>
                            <div className={'no-lyric'} {...ifShow(currentLyricRef.current.noLyric)} >{'没有歌词哦'}</div>
                            <div className="lyric-wrapper">
                                <div {...ifShow(currentLyricRef.current)} ref={lyricLinesRef}>
                                    {
                                        currentLyricRef.current.lines.map((item, index) => {
                                            return (
                                                <p key={index}
                                                   dangerouslySetInnerHTML={{__html: item.txt}}
                                                   className={classNames('text', {
                                                       'current': currentLineNum === index
                                                   })}></p>);
                                        })
                                    }
                                </div>
                            </div>
                        </Scroll>
                    </animated.div>

                </div>
                <animated.div className="bottom" style={bottomStyle}>
                    <div className="progress-wrapper">
                        <span className="time time-l">{toTime(currentTime)}</span>
                        <div className="progress-bar-wrapper">
                            <ProgressBar percent={getCurrentSongPercent()}
                                         onMoveStart={handleProgressBarMoveStart}
                                         onMoving={handleProgressBarMoving}
                                         onMoveEnd={handleProgressBarMoveEnd}
                                         onClick={handleProgressBarClick}
                            />
                        </div>
                        <span className="time time-r">{currentSong.formattedTime}</span>
                    </div>
                    <div className="operators">
                        <div className="icon i-left">
                            <animated.span onClick={handleSequenceClick} style={clickAnimationStyles[0]}>
                                <i className={classNames({
                                    "icon-sequence": playMode.sequence === musicPlayer.mode,
                                    "icon-loop": playMode.loop === musicPlayer.mode,
                                    "icon-random": playMode.random === musicPlayer.mode,
                                })}
                                /></animated.span>
                        </div>
                        <div className="icon i-left">
                            <animated.span onClick={handlePrevClick} style={clickAnimationStyles[1]}>
                                <i className="icon-prev"/></animated.span>
                        </div>
                        <div className={'icon i-center'}>
                            <animated.span onClick={handlePlayAndPauseClick} style={clickAnimationStyles[2]}>
                                <i className={classNames({
                                    "icon-pause": musicPlayer.playing,
                                    "icon-play": !musicPlayer.playing,
                                })}/>
                            </animated.span>
                        </div>
                        <div className="icon i-right">
                            <animated.span onClick={handleNextClick} style={clickAnimationStyles[3]}>
                                <i className="icon-next"/></animated.span>
                        </div>
                        <div className="icon i-right">
                            <animated.span onClick={handleFavoriteClick} style={clickAnimationStyles[4]}>
                                <DownloadIcon/></animated.span>
                        </div>
                    </div>
                </animated.div>
            </animated.div>

            <animated.div
                style={miniPlayerStyle}
                className={'mini-player'}
                onClick={openFullScreen}>
                <div className="icon"><img
                    className={classNames({
                        "play": musicPlayer.playing,
                        "play pause": !musicPlayer.playing,
                    })}
                    width={40} height={40} src={currentSong.image}/></div>
                <div className="text">
                    <h2 className="name">{currentSong.name}</h2>
                    <p className="desc">{currentSong.singer}</p>
                </div>
                <animated.div className="control"
                              style={clickAnimationStyles[2]}
                              onClick={handlePlayAndPauseClick}>
                    <ProgressBarCircle
                        radius={32}
                        percent={getCurrentSongPercent()}
                    >
                        <i
                            className={classNames({
                                "icon-pause-mini": musicPlayer.playing,
                                "icon-play-mini": !musicPlayer.playing,
                            })}/>
                    </ProgressBarCircle>
                </animated.div>
                <animated.div className="control" style={clickAnimationStyles[5]}>
                    <i onClick={handlePlayListClick} className="icon-playlist"/>
                </animated.div>
            </animated.div>
            <Playlist show={playlistState.show} onShow={handlePlaylistShow} onHidden={handlePlaylistHidden}
                      list={musicPlayer.playlist}
                      currentSongId={currentSong.id}
                      onItemLike={handlePlaylistItemLike}
                      onItemDelete={handlePlaylistItemDelete}
                      onItemClick={handlePlaylistItemClick}
                      onClear={handlePlaylistClear}
                      playMode={musicPlayer.mode}
                      onPlayModeClick={handleSequenceClick}
            />
            <audio src={musicPlayer.currentSongUrl} ref={audioRef}
                   onCanPlay={handleCanPlay}
                   onError={handleAudioError}
                   onEnded={handleAudioEnd}
                   onTimeUpdate={handleAudioTimeUpdate}
                   onPlay={handleAudioPlay}
                   onPause={handleAudioPause}
                   onCanPlayThrough={handleAudioCanPlay}
            />
        </div>

    );

    function ifShow(bool) {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }

    function ifShowDelay(bool, ref, time) {
        if (!bool) {
            setTimeout(() => {
                ref.current.style.display = 'none';
            }, time);
        } else {
            ref.current.style.display = 'block';
        }
    }
}

Player.propsType = {
    playlist: propTypes.array,
};

Player.defaultProps = {
    playlist: [],
};

export default connect(state => ({musicPlayer: state.musicPlayer}), {...dispatch})(withRouter(Player));