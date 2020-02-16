// import {lazy} from "react";
import React from "react";

import loadable from "react-loadable";
import {Loading} from "../components";


// export {default as Recommend} from './Recommend'
// export {default as Rank} from './Rank'
// export {default as Search} from './Search'
// export {default as Singer} from './Singer'


// export const Recommend = lazy(() => import('./Recommend'));
// export const Singer = lazy(() => import('./Singer'));
// export const Search = lazy(() => import('./Search'));
// export const Rank = lazy(() => import('./Rank'));

// const Loading = () => (<div>Loading...</div>);


//路由懒加载
export const Recommend = loadable({
    loader: () => import('./Recommend'),
    loading: Loading,
});

export const Singer = loadable({
    loader: () => import('./Singer'),
    loading: Loading,
});

export const Search = loadable({
    loader: () => import('./Search'),
    loading: Loading,
});

export const Rank = loadable({
    loader: () => import('./Rank'),
    loading: Loading,
});

// export const SingerDetail = loadable({
//     loader: () => import('./SingerDetail'),
//     loading: Loading,
// });


export {default as SingerDetail} from './SingerDetail'

export {default as DiscDetail} from './DiscDetail'

export {default as RankDetail} from './RankDetail'

export {default as SearchDetail} from './SearchDetail'