import {playMode} from "../common/js/config";


const state = {
  /*歌手详情页*/
  singer: {},

  /*歌曲播放页*/
  playing: false,           //是否正在播放
  fullScreen: false,        //是否全屏播放
  playList: [],             //播放列表
  sequenceList: [],         //顺序播放列表
  mode: playMode.sequence,  //默认顺序播放
  currentIndex: -1          //播放索引
};

export default state;
