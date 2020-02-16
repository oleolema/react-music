import React, {useRef, useState, useEffect} from 'react';
import propTypes from "prop-types";
import './index.styl';
import {useSpring, animated} from "react-spring";

const noop = () => {
}

function Confirm(props) {

    const showAnimation = {
        o: 1,
        show: 1,
        sc: 1,
    };
    const hiddenAnimation = {
        o: 0,
        show: -0.3, //是否显示 小于0不显示
        sc: 0.8,
    };
    const initAnimation = props.show ? showAnimation : hiddenAnimation;
    const [animation, setAnimation] = useSpring(() => initAnimation);

    useEffect(() => {
        if (props.show) {
            setAnimation(showAnimation);
        } else {
            setAnimation(hiddenAnimation);
        }
    }, [props.show]);

    const animationStyle = {
        opacity: animation.o.interpolate(o => o),
        display: animation.show.interpolate(show => show > 0 ? '' : 'none'),

    };

    const animationStyle1 = {
        transform: animation.sc.interpolate(sc => `scale(${sc})`),
        opacity: animation.o.interpolate(o => o),
    };

    return (
        <div>
            <animated.div className="confirm" style={animationStyle}>
                <div className="confirm-wrapper">
                    <animated.div className="confirm-content" style={animationStyle1}>
                        <p className="text">{props.text}</p>
                        <div className="operate">
                            <div className="operate-btn left" onClick={props.onCancelClick}>{props.cancelBtnText}</div>
                            <div className="operate-btn" onClick={props.onConfirmClick}>{props.confirmBtnText}</div>
                        </div>
                    </animated.div>
                </div>
            </animated.div>
        </div>
    );

}

Confirm.propTypes = {
    text: propTypes.string,
    confirmBtnText: propTypes.string,
    cancelBtnText: propTypes.string,
    show: propTypes.bool,
    onConfirmClick: propTypes.func,
    onCancelClick: propTypes.func,
};

Confirm.defaultProps = {
    text: '',
    confirmBtnText: '确定',
    cancelBtnText: '取消',
    show: false,
    onConfirmClick: noop,
    onCancelClick: noop,
};

export default Confirm;