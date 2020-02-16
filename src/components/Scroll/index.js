import React, {Component, createRef} from 'react';
import BetterScroll from "better-scroll";
import propTypes from "prop-types";
import './index.styl'
import {forceCheck} from 'react-lazyload';

class Scroll extends Component {


    constructor(props) {
        super(props);
        this.wrapperRef = createRef();
        if (this.props.reference) {
            this.props.reference.current = this;
        }
    }

    componentDidMount() {
        this.initScroll();
    }

    /**
     * 初始化better-scroll
     */
    initScroll = () => {
        if (!this.wrapperRef.current) {
            return;
        }
        setTimeout(() => {
            this.scroll = new BetterScroll(this.wrapperRef.current, {
                probeType: this.props.probeType,
                click: this.props.click,
            });
            window.scroll = this.scroll;
            // console.info("ok", this.scroll, this.wrapperRef.current);
            this.scroll.on("scroll", forceCheck)
        }, 20);

        // window.onresize = () => {
        //     this.refresh();
        // };

    };

    refresh = () => {
        this.scroll && this.scroll.refresh();
    };
    disable = () => {
        this.scroll && this.scroll.disable();
    };
    enable = () => {
        this.scroll && this.scroll.enable();
    };

    scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    };

    scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.refresh();
    }

    render() {
        this.refresh();
        return (
            <div
                className={this.props.className}
                ref={this.wrapperRef} style={{
                height: `${this.props.height}px`
            }}>
                <div>
                    {this.props.children}
                </div>
            </div>
        );
    }


}

Scroll.propsType = {
    probeType: propTypes.number,
    click: propTypes.bool,
    list: propTypes.array,
    height: propTypes.height,
    reference: propTypes.object,
    className: propTypes.string,
};

Scroll.defaultProps = {
    probeType: 1,
    click: false,
};


export default Scroll;