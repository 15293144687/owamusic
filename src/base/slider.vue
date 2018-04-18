<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script>

  import BScroll from 'better-scroll'
  import {addClass} from "../common/js/dom";


  export default {
    name: "slider",
    props: {
      /*默认循环轮播*/
      loop: {
        type: Boolean,
        default: true
      },
      /*默认自动轮播*/
      autoPlay: {
        type: Boolean,
        default: true
      },
      /*自定轮播时间间隔*/
      interval: {
        type: Number,
        default: 1000
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    mounted() {
      setTimeout(() => {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
        this._autoPlay();
      }, 30);

      /*监听窗口大小变化事件，自动适应窗口大小*/
      window.addEventListener('resize', () => {
        if (this.slider) {
          this._setSliderWidth(true);
          this.slider.refresh();
        }
      });
    },
    methods: {
      /*初始化轮播的宽度*/
      _setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        let sliderWidth = this.$refs.slider.clientWidth;
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i];
          addClass(child, 'slider-item');
          child.style.width = `${sliderWidth}px`;
          width += sliderWidth;
        }
        if ((this.loop) && !isResize) {
          width += 2 * sliderWidth;
        }
        this.$refs.sliderGroup.style.width = `${width}px`;
      },
      /*初始化轮播图*/
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: true,
          snapLoop: this.loop,
          snaThreshold: 0.3,
          snapSpeed: 400,
        });
        this.slider.on("scrollEnd", () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex--;
          }
          this.currentPageIndex = pageIndex;
          if (this.autoPlay) {
            clearTimeout(this.timer);
            this._autoPlay();
          }
        })
      },
      /*初始化指示器*/
      _initDots() {
        this.dots = new Array(this.children.length);
      },
      /*自动播放*/
      _autoPlay() {
        if (this.autoPlay) {
          let pageIndex = this.currentPageIndex + 1;
          if (this.loop) {
            pageIndex++;
          }
          this.timer = setTimeout(() => {
            this.slider.goToPage(pageIndex, 400);
          }, this.interval);
        }
      }
    },
    destroyed() {
      /*如果在组件中使用了定时器，最好是在组件销毁的时候，清空定时器，有利于内存的释放*/
      clearTimeout(this.timer);
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    position relative
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      transform: translateZ(1px)
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
