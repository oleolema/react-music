import React, {Component} from 'react';
import './index.styl';

import {postMusic, getDiscoverImage, getDiscoverPlaylist} from "../../services/NetEaseAxios";
import {Loading, MySlider, MyScroll} from "../../components";
import LazyLoad from "react-lazyload";

class Recommend extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageList: [],
            discList: [],
            loading: false,
        }
    }

    parseDiscoverImage = (list) => {
        list = list.map(item => {
            let url = item.url;
            //歌曲 直接播放
            if (item.url.includes('/song?')) {
                // url = ``
            } else if (item.url.includes('/playlist?')) {
                url = `/recommend/${item.targetId}`
            }
            return {
                ...item,
                url0: item.url,
                url: url,
            }
        });
        console.info(list)
        return list;
    };

    componentDidMount() {
        this.setState({
            loading: true,
        });
        getDiscoverImage()
            .then(resp => {
                console.info(resp);
                this.setState({
                    imageList: this.parseDiscoverImage(resp.data),
                });
                return getDiscoverPlaylist()
                    .then(resp => {
                        this.setState({
                            discList: resp.data,
                        });
                    });
            })
            .catch(err => {
                console.info(err.errMsg);
            })
            .finally(() => {
                this.setState({
                    loading: false,
                })
            });
    }


    playlistItemClick = (item, index) => {
        console.info(this.props, item);
        this.props.history.push({
            pathname: `/recommend/${item.id}`,
            state: {playlist: item}
        });
    };

    render() {
        return (
            <div className={'recommend'}>
                <MyScroll probeType={3} className={'recommend-scroll'}>
                    <div className={'recommend-content'}>
                        <div className={'slider-wrapper'}>
                            <MySlider list={this.state.imageList}
                                      onItemClick={this.discoverPlaylistItemClick}
                                      setImageHeight={this.setImageHeight}
                                      setState={this.setState.bind(this)}/>
                        </div>
                        <div className={'recommend-list'}>
                            <h1 className={'list-title'}>热门歌单推荐</h1>
                            <ul>
                                {
                                    this.state.discList.map((item, index) => {
                                        return (<li key={item.id} className={'item'}
                                                    onClick={this.playlistItemClick.bind(this, item, index)}>
                                            <div className={'icon'}>
                                                <LazyLoad throttle={200} height={60} placeholder={<Loading/>}
                                                          overflow once={item.once}>
                                                    <img src={item.picUrl} width={60} height={60} alt=""/>
                                                </LazyLoad>
                                            </div>
                                            <div className={'text'}>
                                                <h2 className={'name'}>{item.title}</h2>
                                                <p className={'desc'}>{item.username}</p>
                                            </div>
                                        </li>)
                                    })
                                }
                            </ul>
                        </div>
                        <Loading loading={this.state.loading}/>
                    </div>
                </MyScroll>
            </div>
        );
    }
}

export default Recommend;