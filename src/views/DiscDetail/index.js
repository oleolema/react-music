import React, {Component, useState, useEffect} from 'react';
import "./index.styl";
import {getArtistDetail, getPlayList} from "../../services/NetEaseAxios";
import {MusicList} from "../../components";
import {connect} from "react-redux";
import * as dispatch from "../../actions/musicPlayer";

function DiscDetail(props) {

    const [state, setState] = useState({
        ...props.location.state,
        id: props.match.params.id,
        list: []
    });


    useEffect(() => {
        console.info(props);
        //查看路由是否携带数据
        if (!props.location.state) {
            props.history.push('/recommend');
            return;
        }
        getPlayList(state.id)
            .then(resp => {
                console.info(resp);
                setState({
                    ...state,
                    list: resp.data.result.tracks,
                });
            })
    }, []);

    const playlist = state.playlist;
    if (!playlist) {
        return (<></>)
    }

    return (<>
        <div>
            <MusicList title={playlist.title} bgImage={playlist.picUrl} list={state.list}/>
        </div>
    </>)
}

export default connect(state => state, {dispatch})(DiscDetail);