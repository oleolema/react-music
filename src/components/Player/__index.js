import React, {useEffect, useState} from 'react';
import propTypes from "prop-types";
import './index.styl';
import {connect} from "react-redux";
import * as dispatch from "../../actions/musicPlayer";
import {CSSTransition, SwitchTransition, TransitionGroup} from "react-transition-group";
import {useSpring, animated, useTransition} from 'react-spring'

function Player(props) {

    console.info(props);

    const currentSong = props.musicPlayer.currentSong(props.musicPlayer);
    if (currentSong.artists) {
        currentSong.singer = currentSong.artists.map(item => item.name).join(',');
        currentSong.image = currentSong.album.picUrl;
    }
    console.info(currentSong);

    function closeFullScreen() {
        props.setFullScreen(false)
    }

    function openFullScreen() {
        props.setFullScreen(true)
    }


    return (
        <div
            {...ifShow(props.playlist > 0)}
            className={'player'}>
            <div
                {...ifShow(props.musicPlayer.fullScreen)}
                className={'normal-player'}
            >
                <div className={'background'}>
                    <img width={'100%'} height={'100%'} src={currentSong.image}/>
                </div>
                <div className="top">
                    <div className="back" onClick={closeFullScreen}><i className="icon-back"/></div>
                    {/*<animated.h1 style={aaa} className="title">{currentSong.name}</animated.h1>*/}
                    <animated.h1 className="title">{'bbbbbbbbbbbb'}</animated.h1>
                    <h2 className="subtitle">{currentSong.singer}</h2>
                </div>

                <div className="middle">
                    <div className="middle-l">
                        <div className="cd-wrapper">
                            <div className="cd"><img className="image" src={currentSong.image}/></div>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="operators">
                        <animated.div className="icon i-left"><i className="icon-sequence"/>
                        </animated.div>
                        <animated.div className="icon i-left"><i className="icon-prev"/>
                        </animated.div>
                        <div className="icon i-center"><i className="icon-play"/></div>
                        <div className="icon i-right"><i className="icon-next"/></div>
                        <div className="icon i-right"><i className="icon icon-not-favorite"/></div>
                    </div>
                </div>
            </div>
            {/*    </CSSTransition>*/}
            {/*</TransitionGroup>*/}
            <div
                {...ifShow(!props.musicPlayer.fullScreen)}
                className={'mini-player'}
                onClick={openFullScreen}>
                <div className="icon"><img width={40} height={40} src={currentSong.image}/></div>
                <div className="text">
                    <h2 className="name">{currentSong.name}</h2>
                    <p className="desc">{currentSong.singer}</p>
                </div>
                <div className="control"></div>
                <div className="control"><i className="icon-playlist"/></div>
            </div>

        </div>

    );

    function ifShow(bool) {
        if (bool) {
            return {}
        }
        return {
            style: {
                display: 'none',
            }
        }
    }

}

Player.propsType = {
    playlist: propTypes.array,
};

Player.defaultProps = {
    playlist: [1],
};

export default connect(state => ({musicPlayer: state.musicPlayer}), {...dispatch})(Player);