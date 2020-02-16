import React, {Component} from 'react';
import propTypes from "prop-types";
import './index.styl';
import ReactLoading from "react-loading";

class Loading extends Component {

    constructor(props) {
        super(props);

    }


    render() {
        return (
            <>{
                this.props.loading &&
                (<div className={'loading'} style={{
                    width: this.props.width,
                    height: `${this.props.height}px`,
                }}>
                    <ReactLoading type={this.props.type} width={30} height={this.props.iconHeight}
                                  className={'loading-icon'}/>
                    <p className={'desc'}>{this.props.title}</p>
                </div>)
            }</>
        )
    };
}

Loading.propsType = {
    loading: propTypes.bool,
    title: propTypes.string,
    type: propTypes.oneOf(['blank', 'balls', 'bars', 'bubbles', 'cubes', 'cylon', 'spin', 'spinningBubbles', 'spokes']),
    height: propTypes.number,
    iconHeight: propTypes.number,
};

Loading.defaultProps = {
    loading: true,
    title: "Loading...",
    type: 'spinningBubbles',
    width: '100%',
    height: 30,
    iconHeight: 30,
};


export default Loading;