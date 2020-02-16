import React, {useState, useRef, useEffect} from 'react';
import {MyScroll} from "../../components";
import LazyLoad from "react-lazyload";
import {Loading} from "../../components";
import './index.styl'
import {getTopList} from "../../services/NetEaseAxios";
import {setImageSize} from "../../common/js/dom";


function Rank(props) {

    const [topList, setTopList] = useState([]);
    const scrollRef = useRef(null);
    const rankRef = useRef(null);

    useEffect(() => {
        getTopList().then(resp => {
            console.info(resp);
            setTopList(resp.data.map(item => ({
                ...item,
                picUrl0: item.picUrl,
                picUrl: setImageSize(item.picUrl, "200y200"),
            })));
        });
    }, []);

    function handleItemClick(item) {

        console.info(item);
        props.history.push({
            pathname: `/rank/${item.id}`,
            state: {playlist: item},
        });

    }

    return (
        <div className="rank" ref={rankRef}>
            <MyScroll className="toplist" reference={scrollRef}>
                <ul>{
                    topList.map((item, index) => (
                        <li onClick={handleItemClick.bind(this, item)}
                            key={`rank${item.id}`}
                            className="item">
                            <div className="icon">
                                <LazyLoad placeholder={<Loading height={50} width={50}/>}
                                          scrollContainer={'#o-scroll'}>
                                    <img width="100" height="100" src={item.picUrl}/>
                                </LazyLoad>
                            </div>
                            <ul className="songlist">
                                <li className="song">
                                    <h2 className={'title'}>{item.title}</h2>
                                    <p className={'desc'}>{item.desc}</p>
                                </li>
                            </ul>
                        </li>))
                }
                </ul>
                <div className="loading-container" v-show="!topList.length">

                </div>
            </MyScroll>

        </div>
    );

}

export default Rank;