import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';
import './index.styl';
import Slider from "react-slick";
import LazyLoad from "react-lazyload";
import {Loading} from "../index";
import image from "../../common/image/default.png";

const noop = () => {
};

class MySlider extends Component {

    constructor(props) {
        super(props);
        this.sliderRef = createRef();
        this.imageHeight = 0;


    }

    componentDidMount() {
        this.props.setState({});
    }

    imageOnLoad = (a) => {
        console.info(this.sliderRef.current.clientHeight);
        if (this.imageHeight !== a.target.clientHeight) {
            this.imageHeight = a.target.clientHeight;
            this.props.setState({});
        }
    };

    render() {
        const settings = {
            dots: true,
            autoplay: true,
            speed: 618,
            autoplaySpeed: 5000,
            pauseOnHover: true,
            focusOnSelect: false,
            touchThreshold: 30,

        };
        return (
            <div className={'slider'}>
                <Slider {...settings} >
                    {
                        this.props.list.map((item, index) => {
                            return (
                                <div key={item.targetId}>
                                    {/*<LazyLoad placeholder={<Loading/>} overflow>*/}


                                    {/*<a href={item.url}>*/}
                                        <img width={'100%'}
                                             src={item.picUrl}
                                             onLoad={this.imageOnLoad}

                                             ref={this.sliderRef}
                                             alt=""/>
                                    {/*</a>*/}
                                    {/*</LazyLoad>*/}
                                </div>
                            )
                        })
                    }
                </Slider>
            </div>
        );
    }
}

MySlider.propTypes = {
    list: PropTypes.array,
    onItemClick: PropTypes.func,
};


MySlider.defaultProps = {
    onItemClick: noop,
};


export default MySlider;