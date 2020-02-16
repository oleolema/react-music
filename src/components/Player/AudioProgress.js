import React, {useState, useEffect, useRef} from 'react';
import propTypes from "prop-types";
import {ProgressBar} from "../index";


function AudioProgress(props) {



    useEffect(() => {
        if (props.audio == null) {
            return;
        }
        props.audio.ontimeupdate = () => {
            console.info("aa");
        }
    }, [props.audio]);


    return (
        <ProgressBar percent={props.percent}>

        </ProgressBar>
    );

}

AudioProgress.propTypes = {
    audio: propTypes.object,
    percent: propTypes.number,
};

AudioProgress.defaultProps = {
    percent: 0,
};

export default AudioProgress;