import React, {Component, createRef} from 'react';
import pinyin from "pinyin";
import {getSingers} from "../../services";
import {ListView} from "../../components";

import {postHotArtist} from "../../services/NetEaseAxios";


class Singer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            singers: {}
        }
    }

    toPinYinSinger(list) {
        const singerList = list.map(item => ({
            ...item,
            pinyin: pinyin(item.name, {style: pinyin.STYLE_NORMAL}).join('')
        }));
        const hotSingerList = {0: singerList.filter((item, i) => i < 10)};
        const restSingerList = singerList.filter((item, i) => i >= 10).reduce((acc, obj) => {
            const c = obj.pinyin.charAt(0).toUpperCase();
            if (!acc[c]) {
                acc[c] = [];
            }
            acc[c].push(obj);
            return acc;
        }, {});
        return {...hotSingerList, ...restSingerList};
    }

    componentDidMount() {
        postHotArtist()
            .then(resp => {
                console.info(resp);
                this.setState({
                    singers: this.toPinYinSinger(resp.data.artists),
                }, () => {
                    console.info(this.state.singers);
                })
            })

    }

    render() {
        return (
            <div className={'singer'}>
                <ListView list={this.state.singers} onItemClick={this.onItemClick}></ListView>
            </div>
        );
    }

    onItemClick = (item, index) => {
        console.info(item, index);
        this.props.history.push({
            pathname: `/singer/${item.id}`,
            state: {artist: item}
        });
    }
}

export default Singer;