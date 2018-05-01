import * as types from './mutation-types';

/*播放音乐动作*/
export const selectPlay = ({commit, state}, {list, index}) => {
  commit(types.SET_SEQUENCELIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};
