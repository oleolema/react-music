import React, {useState, useEffect, useRef} from 'react';
import propTypes from "prop-types";

import './index.styl';

const noop = () => {
};

function ProgressBar(props) {


    const progressRef = useRef(null);
    const progressBarRef = useRef(null);
    const progressBtnRef = useRef(null);
    const progressBtnWidth = 16;

    const [touch, setTouch] = useState({
        initiated: false,
        startX: 0,
        left: 0,
    });

    function progressTouchStart(e) {
        setTouch({
            initiated: true,
            startX: e.touches[0].pageX,
            left: progressRef.current.clientWidth,
        });
        props.onMoveStart();
    }

    function progressTouchMove(e) {
        if (touch.initiated === false) {
            return;
        }
        const moveX = e.touches[0].pageX - touch.startX;
        const offsetX = Math.min(Math.max(moveX + touch.left, 0), progressBarRef.current.clientWidth - progressBtnWidth);
        _offsetX(offsetX);
        props.onMoving(offsetX / (progressBarRef.current.clientWidth - progressBtnWidth));
    }


    function progressTouchEnd() {
        setTouch({
            ...touch,
            initiated: false,
        });
        const progressBarWidth = progressBarRef.current.clientWidth - progressBtnWidth;
        const percent = progressRef.current.clientWidth / progressBarWidth;
        //将滑动结束结果回调出去
        props.onMoveEnd(percent);
    }


    function progressClick(e) {
        const progressBarRect = progressBarRef.current.getBoundingClientRect();
        props.onClick(Math.min(1, Math.max(0, (e.pageX - progressBarRect.left) / (progressBarRef.current.clientWidth - progressBtnWidth))));
    }

    function _offsetX(offsetX) {
        progressRef.current.style.width = `${offsetX}px`;
        progressBtnRef.current.style.transform = `translate3d(${offsetX}px,0,0)`;
    }

    //props.percent 百分比改变时调用
    useEffect(() => {
        // const progressBtnWidth = progressBtnRef.current.clientWidth;
        if (progressBtnWidth > 0 && !touch.initiated) {
            const progressBarWidth = progressBarRef.current.clientWidth - progressBtnWidth;
            const offsetWidth = progressBarWidth * props.percent;
            progressRef.current.style.width = `${offsetWidth}px`;
            progressBtnRef.current.style.transform = `translate3d(${offsetWidth}px,0,0)`;
        }
    }, [props.percent]);

    return (
        <div className="progress-bar" ref={progressBarRef} onClick={progressClick}>
            <div className="bar-inner">
                <div className="progress" ref={progressRef}/>
                <div className="progress-btn-wrapper" ref={progressBtnRef}
                     onTouchStart={progressTouchStart}
                     onTouchMove={progressTouchMove}
                     onTouchEnd={progressTouchEnd}
                >
                    <div className="progress-btn"/>
                </div>
            </div>
        </div>
    );

}

ProgressBar.propTypes = {
    percent: propTypes.number,
    onMoveEnd: propTypes.func,
    onMoving: propTypes.func,
    onMoveStart: propTypes.func,
    onClick: propTypes.func,
};

ProgressBar.defaultProps = {
    percent: 0,
    onMoveEnd: noop,
    onMoving: noop,
    onMoveStart: noop,
    onClick: noop,
};

export default ProgressBar;