import * as types from './mutation-types';
import {playMode} from 'src/common/js/config.js'
import {shuffle} from "../common/js/util";

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  })
}

/*播放音乐动作*/
export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCELIST, list);

  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    let randomIndex = findIndex(randomList,list[index]);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENT_INDEX, randomIndex);
  }else {
    commit(types.SET_PLAYLIST, list);
    commit(types.SET_CURRENT_INDEX, index);
  }

  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = ({commit}, {list}) => {
  commit(types.SET_MODE, playMode.random);
  commit(types.SET_SEQUENCELIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
