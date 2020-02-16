import React, {Component, createRef} from 'react';

import propTypes from "prop-types";

import './index.styl';
import {forceCheck} from 'react-lazyload';

const noop = () => {
}

class MyScroll extends Component {


    constructor(props) {
        super(props);
        this.scrollRef = createRef();
        this.listen = {};
        this.props.reference && (this.props.reference.current = this);
        this.scrollingTimer = 0;
    }

    componentDidMount() {
        //绑定懒加载的滑动事件
        this.scrollRef.current.onscroll = (function (e) {
            forceCheck(e);
            const ele = e.target;
            this.listen.scroll && this.listen.scroll(e);
            if (Math.ceil(ele.scrollTop) + ele.offsetHeight >= ele.scrollHeight) {
                this.props.onScrollBottom();
            }
        }).bind(this);

        // //窗口变化
        // window.onresize = () => {
        //
        // };
    }


    render() {
        return (
            <div id={'o-scroll'}
                 className={this.props.className}
                 style={{
                     height: this.props.height,
                     ...this.props.style,
                 }}
                 ref={this.scrollRef}
            >
                {this.props.children}
            </div>
        );
    }

    scrollAnimationTo = (x, y, s) => {
        const scroll = this.scrollRef.current;
        let start = scroll.scrollTop;
        const end = y;
        const offset = end - start;
        const k = offset / s;
        clearInterval(this.scrollingTimer);
        let preStart = start;
        if (offset > 0) {
            this.scrollingTimer = setInterval(() => {
                start = scroll.scrollTop + k;
                if (start <= end && start !== preStart) {
                    preStart = start;
                    scroll.scrollTo(x, start);
                } else {
                    scroll.scrollTo(x, end);
                    clearInterval(this.scrollingTimer);
                }
            }, 1);
        } else if (offset < 0) {
            this.scrollingTimer = setInterval(() => {
                start = scroll.scrollTop + k;
                if (start >= end && start !== preStart) {
                    preStart = start;
                    scroll.scrollTo(x, start);
                } else {
                    scroll.scrollTo(x, end);
                    clearInterval(this.scrollingTimer);
                }
            }, 1);
        }

    };


    scrollTo = (x, y) => {
        const {speed} = this.props.animation;
        if (speed) {
            this.scrollAnimationTo(x, y, speed);
            return;
        }
        this.scrollRef.current.scrollTo(x, y);
    };

    scrollToElement = (element) => {
        if (element) {
            this.scrollTo(element.offsetLeft, element.offsetTop);
        }
    };

    on = (type, fun) => {
        switch (type) {
            case "scroll" :
                this.listen.scroll = fun;
                break;
            default:
                break;
        }
    };

    setHeight = (height) => {
        this.scrollRef.current.style.height = `${height}px`;
    }

}

MyScroll.propTypes = {
    reference: propTypes.object,
    animation: propTypes.object,
    height: propTypes.number,
    outerElement: propTypes.string,
    style: propTypes.object,
    className: propTypes.string,
    onScrollBottom: propTypes.func,
};

MyScroll.defaultProps = {
    animation: {},
    outerElement: null,
    style: {},
    onScrollBottom: noop,
};

export default MyScroll;