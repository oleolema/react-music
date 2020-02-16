import {playMode} from "../common/js/config";
import {TYPE} from "../actions/musicPlayer";
import {getSearch} from "../common/js/cache";


const initState = {
    singer: {},
    playing: false,
    fullScreen: false,
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    searchHistory: getSearch(),
    currentSongUrl:"",
    currentSong: (state) => {
        return state.playlist[state.currentIndex] || {};
    }
};

export default (state = initState, action) => {
    if (!action.type.startsWith(TYPE.PLAYER)) {
        return state;
    }
    const s = {
        ...state,
        ...action.payload,
    };
    console.info("musicPlayer reducer", state, action, s);
    return s;
}

// case TYPE.SET_SINGER:
// return {
//     ...state,
//     singer: payload.singer,
// };
// case TYPE.SET_FULL_SCREEN:
// return {
//     ...state,
//     fullScreen: payload.fullScreen,
// };
// case TYPE.SET_CURRENT_INDEX:
// return {
//     ...state,
//     currentIndex: payload.currentIndex,
// };
// case TYPE.SET_PLAY_MODE:
// return {
//     ...state,
//     mode: payload.mode,
// };
// case TYPE.SET_PLAYING:
// return {
//     ...state,
//     playing: payload.playing,
// };
// case TYPE.SET_SEQUENCE_LIST:
// return {
//     ...state,
//     sequenceList: payload.sequenceList,
// };
// case TYPE.SET_PLAYLIST:
// return {
//     ...state,
//     playlist: payload.playlist,
// };