import React, {useState, useEffect, useRef} from 'react';
import propTypes from "prop-types";
import './index.styl';

function ProgressBarCircle(props) {

    return (
        <div className="progress-circle">
            <svg width={props.radius} height={props.radius} viewBox="0 0 100 100" version="1.1"
                 xmlns="http://www.w3.org/2000/svg">
                <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
                <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent"
                        strokeDasharray={Math.PI * 100}
                        strokeDashoffset={(1 - props.percent) * Math.PI * 100}
                />
            </svg>
            {props.children}
        </div>
    );

}

ProgressBarCircle.propTypes = {
    radius: propTypes.number,
    percent: propTypes.number,
};

ProgressBarCircle.defaultProps = {
    percent: 0,
    default: 100,
};

export default ProgressBarCircle;