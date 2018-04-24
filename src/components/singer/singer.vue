<template>
  <div class="singer" ref="singer">
    <listview :data="singerList" @select="selectedSinger"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">

  import {getSingerList} from "../../api/singer";
  import {NET_OK} from "../../api/config";
  import Singer from "../../common/js/singer";
  import Listview from "../../base/listview";

  const HOT_NAME = '热门';
  const HOT_SINGER_LENGTH = 10;

  export default {
    components: {Listview},
    data() {
      return {
        singerList: []
      }
    },
    created() {
      this._getSingerList();
    },
    methods: {
      selectedSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === NET_OK) {
            this.singerList = this._normalizeSinger(res.data.list);
            console.dir(this.singerList);
          }
        })
      },
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          let singer = new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name,
          });

          if (index < HOT_SINGER_LENGTH) {
            map.hot.items.push(singer)
          }
          const key = item.Findex;
          !map[key] && (map[key] = {
            title: key,
            items: []
          })
          map[key].items.push(singer)
        })
        /*为了得到有序列表，需要处理map，转化为list*/
        let hot = [];
        let ret = [];
        for (let k in map) {
          let v = map[k];
          if (v.title.match(/[a-zA-Z]/)) {
            ret.push(v);
          } else if (v.title === HOT_NAME) {
            hot.push(v);
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0);
        });
        return hot.concat(ret);
      }
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%

</style>
