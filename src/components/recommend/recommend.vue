<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <!--由于recommend在created的时候调用了异步方法请求数据，这时候如果直接初始化轮播图，这时候slider中的slot是空的，导致无法设置正常的宽度和样式，解决办法是
        使用v-if标签，在请求完数据之后，在初始化slider，这时候slider中的slot已经初始化完了-->
        <div v-if="recommends.length" class="slider-wrpper">
          <slider>
            <div v-for="item in recommends">
              <a :href="item.linkUrl">
                <img class="needsclick" :src="item.picUrl" @load="loadImage"/>
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li v-for="item in discList" class="item">
              <div class="icon"><img width="60" height="60" v-lazy="item.imgurl"/></div>
              <div class="text">
                <!--v-html指令会自动帮忙吧转义字符转义-->
                <h2 class="name" v-html="item.creator.name"></h2>
                <p class="desc" v-html="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">

  import {getDiscList, getRecommend} from "../../api/recommend";
  import {NET_OK} from "../../api/config";
  import Slider from "../../base/slider";
  import Scroll from "../../base/scroll";
  import Loading from "../../base/loading";

  export default {
    components: {Loading, Scroll, Slider},
    data() {
      return {
        recommends: [],
        discList: [],
        initializeCount: 0,
      }
    },
    created() {
      /*模拟网络请求比较慢的情况，这时候轮播图加载比较慢，这时候scroll会有点问题，会导致页面高度小于实际高度
      （列表先加载，scroll初始化，轮播图初始化，这时候scroll的高度只有列表的高度），也有可能大于实际高度
      （轮播图数据先加载，轮播图加载但是未初始化，这时候轮播图的高度是五张图片的高度），列表数据加载，轮播图加载，这时候高度回比实际高度要多出四个图片的高度*/
      setTimeout(() => {
        this._getRecommend();
      }, 1500);
      /*模拟歌单猎豹数据请求慢的情况，显示加载loading*/
      setTimeout(() => {
        this._getDiscList();
      }, 500);
    },
    methods: {
      /*获取轮播数据*/
      _getRecommend() {
        getRecommend().then((result) => {
          if (result.code === NET_OK) {
            this.recommends = result.data.slider;
          }
        });
      },
      /*获取歌单列表*/
      _getDiscList() {
        getDiscList().then((result) => {
          if (result.code === NET_OK) {
            this.discList = result.data.list;
          }
        })
      },
      loadImage() {
        /*等待轮播图加载完毕，等待轮播图初始化之后在刷新scroll*/
        this.initializeCount++;
        if (this.initializeCount === this.recommends.length) {
          setTimeout(() => {
            this.refresh();
          }, 32);
        }
      },
      refresh() {
        this.$refs.scroll.refresh();
      }

    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
</style>
