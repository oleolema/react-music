import {playMode} from "../common/js/config";
import {saveSearch, deleteSearch, clearSearch} from "../common/js/cache";


export const TYPE = {
    PLAYER: 'PLAYER',
    SET_SINGER: 'PLAYER_SET_SINGER',
    SET_PLAYING: 'PLAYER_SET_PLAYING',
    SET_FULL_SCREEN: 'PLAYER_SET_FULL_SCREEN',
    SET_PLAYLIST: 'PLAYER_SET_PLAYLIST',
    SET_SEQUENCE_LIST: 'PLAYER_SET_SEQUENCE_LIST',
    SET_PLAY_MODE: 'PLAYER_SET_PLAY_MODE',
    SET_CURRENT_INDEX: 'PLAYER_SET_CURRENT_INDEX',
    SET_PLAY: 'PLAYER_SET_PLAY',
    SET_SONG: 'PLAYER_SET_SONG',
    SET_REPLAY: 'PLAYER_SET_REPLAY',
    INSERT_SONG: 'PLAYER_INSERT_SONG',
    SAVE_SEARCH_HISTORY: 'PLAYER_SAVE_SEARCH_HISTORY',
    DELETE_SEARCH_HISTORY: 'PLAYER_DELETE_SEARCH_HISTORY',
    CLEAR_SEARCH_HISTORY: 'PLAYER_CLEAR_SEARCH_HISTORY',
    SET_CURRENT_SONG: 'PLAYER_SET_CURRENT_SONG',
    DELETE_SONG: 'PLAYER_DELETE_SONG',
    CLEAR_LIST: 'PLAYER_CLEAR_LIST',
    SET_CURRENT_SONG_URL: 'PLAYER_SET_CURRENT_SONG_URL'
};

//保存搜索历史
export const saveSearchHistory = (query) => {
    return {
        type: TYPE.SAVE_SEARCH_HISTORY,
        payload: {
            searchHistory: saveSearch(query),
        }
    }
};

//删除搜索历史
export const deleteSearchHistory = (query) => {
    return {
        type: TYPE.DELETE_SEARCH_HISTORY,
        payload: {
            searchHistory: deleteSearch(query),
        }
    }
};

//清空搜索历史
export const clearSearchHistory = () => {
    return {
        type: TYPE.CLEAR_SEARCH_HISTORY,
        payload: {
            searchHistory: clearSearch(),
        }
    }
};


//播放
export const sequencePlay = (state, list, index) => {
    let playlist;
    if (state.mode === playMode.random) {
        playlist = [...list].sort(() => Math.random() - 0.5);
    } else if (state.mode === playMode.sequence || state.mode === playMode.loop) {
        playlist = [...list];
    }
    const curIndex = playlist.findIndex((item) => item.id === list[index].id);
    return {
        type: TYPE.SET_PLAY,
        payload: {
            sequenceList: list,
            playlist: playlist,
            currentIndex: curIndex,
            playing: true,
            fullScreen: true,
        }
    }
};

export const randomPlay = (list) => {
    return {
        type: TYPE.SET_PLAY,
        payload: {
            sequenceList: list,
            playlist: [...list].sort(() => Math.random() - 0.5),
            currentIndex: 0,
            playing: true,
            fullScreen: true,
            mode: playMode.random,
        }
    }
};

export const setCurrentSong = (state, song) => {
    const fIndex = state.playlist.findIndex(item => item.id === song.id);
    let currentIndex = fIndex === -1 ? state.currentIndex : fIndex;
    return {
        type: TYPE.SET_CURRENT_SONG,
        payload: {
            currentIndex: currentIndex,
        }
    }
};

export const clearList = () => {
    return {
        type: TYPE.CLEAR_LIST,
        payload: {
            currentIndex: -1,
            playlist: [],
            sequenceList: [],
            playing: false,
        }
    }
};

export const deleteSong = (state, song) => {
    let currentIndex = state.currentIndex;
    const playlist = [...state.playlist];
    const sequenceList = [...state.sequenceList];
    const songIndex = playlist.findIndex((item) => item.id === song.id);
    const songSIndex = sequenceList.findIndex((item) => item.id === song.id);
    //删除
    playlist.splice(songIndex, 1);
    sequenceList.splice(songSIndex, 1);

    //调整currentIndex
    if (songIndex < currentIndex || currentIndex === playlist.length) {
        currentIndex--;
    }

    return {
        type: TYPE.DELETE_SONG,
        payload: {
            currentIndex: currentIndex,
            playlist: playlist,
            sequenceList: sequenceList,
            playing: playlist.length !== 0 && state.playing,
        }
    }

};

export const insertSong = (state, song) => {
    let currentIndex = state.currentIndex;
    const playlist = [...state.playlist];
    const currentSong = playlist[currentIndex];
    const songIndex = playlist.findIndex((item) => item.id === song.id);
    //删除这首歌
    if (songIndex > -1) {
        if (songIndex <= currentIndex) {
            playlist.splice(songIndex, 1);
            currentIndex--;
        } else {
            playlist.splice(songIndex, 1);
        }
    }
    //添加这首歌到当前位置
    playlist.splice(++currentIndex, 0, song);


    const sequenceList = [...state.sequenceList];
    const songSIndex = sequenceList.findIndex((item) => item.id === song.id);
    let currentSIndex = sequenceList.findIndex((item) => item.id === currentSong.id);

    //删除这首歌
    if (songSIndex > -1) {
        if (songSIndex <= currentSIndex) {
            sequenceList.splice(songSIndex, 1);
            currentSIndex--;
        } else {
            sequenceList.splice(songSIndex, 1);
        }
    }
    //添加这首歌到当前位置
    sequenceList.splice(++currentSIndex, 0, song);

    return {
        type: TYPE.INSERT_SONG,
        payload: {
            sequenceList: sequenceList,
            playlist: playlist,
            currentIndex: currentIndex,
            playing: true,
            fullScreen: true,
        },
    }
};

// export const setSinger = (singer) => ({
//     type: TYPE.SET_SINGER,
//     payload: {
//         singer,
//     }
// });
//
export const setPlayingState = (playing) => ({
    type: TYPE.SET_PLAYING,
    payload: {
        playing: playing,
    }
});
//
export const setFullScreen = (fullScreen) => ({
    type: TYPE.SET_FULL_SCREEN,
    payload: {
        fullScreen: fullScreen,
    }
});
//
export const setPlaylist = (playlist, currentIndex) => {
    if (currentIndex === undefined) {
        return ({
            type: TYPE.SET_PLAYLIST,
            payload: {
                playlist: playlist,
            }
        });
    }
    return ({
        type: TYPE.SET_PLAYLIST,
        payload: {
            playlist: playlist,
            currentIndex: currentIndex,
        }
    });
};

//
// export const setSequenceList = (sequenceList) => ({
//     type: TYPE.SET_SEQUENCE_LIST,
//     payload: {
//         sequenceList,
//     }
// });
//
export const setPlayMode = (mode, playlist, currentIndex) => ({
    type: TYPE.SET_PLAY_MODE,
    payload: {
        mode: mode,
        playlist: playlist,
        currentIndex: currentIndex,
    }
});


export const setCurrentIndex = (currentIndex) => ({
    type: TYPE.SET_CURRENT_INDEX,
    payload: {
        currentIndex: currentIndex,
        playing: true,
    }
});

export const setCurrentSongUrl = (state, url) => ({
    type: TYPE.SET_CURRENT_SONG_URL,
    payload: {
        currentSongUrl:url,
    }

});
