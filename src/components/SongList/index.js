import React, {Component} from 'react';
import './index.styl';
import propTypes from "prop-types";


class SongList extends Component {
    render() {
        return (
            <div className={'song-list'}>
                <ul>
                    {
                        this.props.list.map((item, index) => {
                            return (
                                <li key={item.id} className={'item'}
                                    onClick={this.props.onItemClick.bind(this, item, index)}>
                                    {this.props.rank && (<div className="rank-index">
                                        <span className={this.getRankCls(index)}>{this.getRankText(index)}</span>
                                    </div>)}
                                    <div className={'content'}>
                                        <h2 className={'name'}>{item.name}</h2>
                                        <p className={'desc'}>{this.getDesc(item)}</p>
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    }

    getDesc = (item) => {
        return `${item.artists.map(i => i.name).join(',')} - ${item.album.name}`;
    };

    getRankCls = (index) => {
        if (index < 3) {
            return `icon icon${index}`;
        }
        return 'text';
    };

    getRankText = (index) => {
        if (index >= 3) {
            return index + 1;
        }
    };


    ifShow = (bool) => {
        if (!bool) {
            return {style: {display: 'none',}}
        }
    }
}

SongList.propTypes = {
    list: propTypes.array,
    onItemClick: propTypes.func,
    rank: propTypes.bool,
};

SongList.defaultProps = {
    list: [],
    rank: false,
};

export default SongList;