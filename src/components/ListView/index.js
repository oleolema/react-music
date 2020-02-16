import React, {Component, createRef} from 'react';
import './index.styl';
import LazyLoad from "react-lazyload";
import {Loading, MyScroll} from "../index";
import PropTypes from "prop-types";
import classNames from "classnames";
import {addClass, removeClass, addEventListenerWithoutDefault} from "../../common/js/dom";
import {size} from "../../common/js/config";


class ListView extends Component {

    constructor(props) {
        super(props);
        this.listGroupRef = createRef();
        this.listScrollRef = createRef();
        this.shortcutGroupRef = createRef();
        this.listGroupFixedRef = createRef();
        this.listGroupFixedChanged = false;
        this.touch = {};
        this.state = {
            currentGroupIndex: 0,
        }


    }

    componentDidMount() {


        this.listScrollRef.current.on("scroll", e => {
            //当前高度
            let curScrollTop = Math.ceil(e.target.scrollTop);
            let children = this.listGroupRef.current.children;
            let itemHeight = 30;
            for (let i = 0; i < children.length; i++) {
                //浮动滑块
                let cNext = children[i + 1];
                if (cNext && cNext.offsetTop - itemHeight <= curScrollTop) {
                    this.listGroupFixedRef.current.style.transform = `translate3d(0px,-${curScrollTop - cNext.offsetTop + itemHeight}px,0px)`;
                    this.listGroupFixedChanged = true;
                } else if (this.listGroupFixedChanged) {
                    this.listGroupFixedRef.current.style.transform = `translate3d(0px,0px,0px)`;
                    this.listGroupFixedChanged = false;
                }
                //滑条索引
                let c = children[i];
                if (c.offsetTop <= curScrollTop && c.offsetTop + c.offsetHeight > curScrollTop) {
                    if (this.state.currentGroupIndex !== i) {
                        this.setState({
                            currentGroupIndex: i,
                        });

                    }

                    return;
                }
            }

        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.shortcutGroupRef.current.children.length !== 0) {
            this.touch.height = this.shortcutGroupRef.current.children[0].clientHeight;
            this.touch.groupHeight = this.shortcutGroupRef.current.clientHeight;

        }


    }

    render() {
        const list = this.props.list;
        const shortcutList = Object.keys(list).sort().map(i => {
            return i == 0 ? '热' : i;
        });

        return (
            <div className={'listview'}>
                <MyScroll reference={this.listScrollRef} className={'listview-scroll'}>
                    <ul ref={this.listGroupRef}>
                        {
                            Object.keys(list).sort().map((i, index) => (
                                <li key={i} className={'list-group'}>
                                    <h2 className={'list-group-title'}>{i == 0 ? '热门' : i}</h2>
                                    <ul>
                                        {
                                            list[i].map((item, index) => (
                                                <li key={item.picUrl} className={'list-group-item'}
                                                    onClick={this.handleItemClick.bind(this, item, index)}>
                                                    <LazyLoad placeholder={<Loading height={50} width={50}/>}
                                                              scrollContainer={'#o-content'}>
                                                        <img className={'avatar'}
                                                             src={`${item.picUrl}?param=140y140`}
                                                             alt=""/>
                                                    </LazyLoad>
                                                    <span className={'name'}>{item.name}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </li>
                            ))
                        }
                    </ul>
                </MyScroll>
                <div className={'list-shortcut'}>
                    <ul ref={this.shortcutGroupRef}>
                        {
                            shortcutList.map((item, index) => {
                                return (
                                    <li key={item}
                                        onTouchStartCapture={this.handleTouchStart.bind(this, index)}
                                        onTouchMove={this.handleTouchMove.bind(this, index)}
                                        className={classNames('item', {
                                            'current': this.state.currentGroupIndex === index
                                        })}

                                    >{item}</li>)
                            })
                        }
                    </ul>
                </div>
                <div className={'list-fixed'} ref={this.listGroupFixedRef}>
                    <h2 className={'fixed-title'}>{this.props.list && shortcutList[this.state.currentGroupIndex]}</h2>
                </div>

            </div>
        );
    }

    handleTouchMove(i, event) {
        this.touch.y2 = event.touches[0].pageY;
        let index = (((this.touch.y2 - this.touch.y1) / this.touch.height) | 0) + this.touch.index;
        this.listScrollRef.current.scrollToElement(this.listGroupRef.current.children[index]);
    };

    handleTouchStart(index, event) {
        if (event.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!event.defaultPrevented) {
                event.preventDefault();
            }
        }
        this.touch.y1 = event.target.offsetTop + this.touch.height / 2 + window.innerHeight - size.miniPlayerHeight - this.touch.groupHeight;
        this.touch.index = index;
        this.listScrollRef.current.scrollToElement(this.listGroupRef.current.children[index]);

    }

    handleItemClick = (item, index, e) => {
        this.props.onItemClick && this.props.onItemClick(item, index, e);
    }
}

ListView.propTypes = {
    list: PropTypes.object,
    onItemClick: PropTypes.func,
};

export default ListView;