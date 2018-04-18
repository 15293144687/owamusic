<template>
  <scroll class="listview" :data="data" ref="listview" :listen-scroll="listenScroll" @scroll="scroll"
          :probe-type="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item">
            <img v-lazy="item.avatar" class="avatar"/>
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--stop,prevent阻止时间冒泡，以及阻止浏览器原生滚动-->
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item,index) in shortcutList" class="item" :data-index="index"
            :class="{'current':currentIndex == index}">
          {{item}}
        </li>
      </ul>
    </div>
    <!--固定标题-->
    <div class="list-fixed" v-if="fixedTitle" ref="fixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <loading v-if="!data.length" class="loading-container"></loading>
  </scroll>
</template>

<script type="text/ecmascript-6">

  import Scroll from "./scroll";
  import {getData} from "../common/js/dom";
  import Loading from "./loading";

  const ANCHOR_HEIGHT = 18;
  const TITLE_HEIGHT = 30;

  export default {
    components: {Loading, Scroll},
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) return '';
        let group = this.data[this.currentIndex];
        return group ? group.title : '';
      },
    },
    created() {
      console.log(this.data);
      this.touch = {};
      this.listenScroll = true;
      this.listenHeight = [];
      this.probeType = 3;
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    methods: {
      onShortcutTouchStart(ev) {
        let anchorIndex = getData(ev.target, 'index') - 0;
        let firstTouch = ev.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(ev) {
        let firthTouch = ev.touches[0];
        this.touch.y2 = firthTouch.pageY;
        /*|0的意思是向下取整*/
        let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
        let anchorIndex = this.touch.anchorIndex + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        (index < 0) && (index = 0);
        (index > this.listenHeight.length - 2) && (index = this.listenHeight.length - 2);
        this.scrollY = -this.listenHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
      _calculateHeight() {
        this.listenHeight = [];
        let list = this.$refs.listGroup;
        let height = 0;
        this.listenHeight.push(height);
        for (let i = 0; i < list.length; i++) {
          let item = list[i];
          height += item.clientHeight;
          this.listenHeight.push(height);
        }
      },
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      scrollY(newY) {
        let listenHeight = this.listenHeight;
        /*当滚动到顶部，newY>0*/
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        /*在中间部分滚动*/
        for (let i = 0; i < listenHeight.length - 1; i++) {
          let height1 = listenHeight[i];
          let height2 = listenHeight[i + 1];
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
        /*滚动到底部且-newY大于最后一个元素的上限*/
        this.currentIndex = listenHeight.length - 2;
      },
      diff(newVal) {
        newVal+=2;
        let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
        if (this.fixedTop === fixedTop) return;   /*减少dom操作，当不需要移动fixed的时候，不做任何操作*/
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: -1px
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
