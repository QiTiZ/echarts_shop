<template>
  <div class="screen-container" :style="backGroundColor">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="" style="" />
      </span>
      <span class="title" :style="iconStyle">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="qiehuanSrc" class="qiehuan" @click="changeTheme" />
        <span class="datetime" :style="iconStyle">{{
          nowData | beijingTime
        }}</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullScreenState' : '']"
        >
          <!-- 销量趋势图表 -->
          <Trend ref="trend"></Trend>
          <!-- 全屏按钮 -->
          <div class="fullscreen">
            <span
              :style="iconStyle"
              @click="changeFullScreen('trend')"
              :class="[
                'iconfont',
                fullScreenStatus.trend
                  ? 'icon-tuichuzhuanhuan'
                  : 'icon-quanping'
              ]"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullScreenState' : '']"
        >
          <!-- 商家销售金额图表 -->
          <Seller ref="seller"></Seller>
          <!-- 全屏按钮 -->
          <div class="fullscreen">
            <span
              :style="iconStyle"
              @click="changeFullScreen('seller')"
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-tuichuzhuanhuan'
                  : 'icon-quanping'
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'fullScreenState' : '']"
        >
          <!-- 商家分布图表 -->
          <Map ref="map"></Map>
          <!-- 全屏按钮 -->
          <div class="fullscreen">
            <span
              :style="iconStyle"
              @click="changeFullScreen('map')"
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-tuichuzhuanhuan' : 'icon-quanping'
              ]"
            ></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullScreenState' : '']"
        >
          <!-- 地区销量排行图表 -->
          <Rank ref="rank"></Rank>
          <!-- 全屏按钮 -->
          <div class="fullscreen">
            <span
              :style="iconStyle"
              @click="changeFullScreen('rank')"
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-tuichuzhuanhuan' : 'icon-quanping'
              ]"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div
          id="right-top"
          :class="[fullScreenStatus.hot ? 'fullScreenState' : '']"
        >
          <!-- 热销商品占比图表 -->
          <Hot ref="hot"></Hot>
          <!-- 全屏按钮 -->
          <div class="fullscreen">
            <span
              :style="iconStyle"
              @click="changeFullScreen('hot')"
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-tuichuzhuanhuan' : 'icon-quanping'
              ]"
            ></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullScreenState' : '']"
        >
          <!-- 库存销量分析图表 -->
          <Stock ref="stock"></Stock>
          <!-- 全屏按钮 -->
          <div class="fullscreen">
            <span
              :style="iconStyle"
              @click="changeFullScreen('stock')"
              :class="[
                'iconfont',
                fullScreenStatus.stock
                  ? 'icon-tuichuzhuanhuan'
                  : 'icon-quanping'
              ]"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '../components/Hot.vue'
import Map from '../components/Map.vue'
import Rank from '../components/Rank.vue'
import Seller from '../components/Seller.vue'
import Stock from '../components/Stock.vue'
import Trend from '../components/Trend.vue'
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'
export default {
  data() {
    return {
      nowData: 0,
      timeId: null,
      fullScreenStatus: {
        hot: false,
        map: false,
        rank: false,
        seller: false,
        stock: false,
        trend: false
      }
    }
  },
  created() {
    this.$socket.registerCallBack('fullScreen', this.fullScreenData)
    this.$socket.registerCallBack('themeChange', this.themeChangeData)
  },
  computed: {
    ...mapState(['theme']),
    iconStyle() {
      return {
        color: getThemeValue(this.theme).titleColor
      }
    },
    logoSrc() {
      return '/state/image/' + getThemeValue(this.theme).logoSrc
    },
    headerSrc() {
      return '/state/image/' + getThemeValue(this.theme).headerBorderSrc
    },
    qiehuanSrc() {
      return '/state/image/' + getThemeValue(this.theme).themeSrc
    },
    backGroundColor() {
      return {
        backgroundColor: getThemeValue(this.theme).backgroundColor
      }
    }
  },
  components: {
    Hot,
    Map,
    Rank,
    Seller,
    Stock,
    Trend
  },
  mounted() {
    this.timeId = setInterval(() => {
      this.nowData = Date.now()
    }, 1000)
  },
  methods: {
    changeFullScreen(chartName) {
      // this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // console.log(this.fullScreenStatus[chartName])
      // this.$nextTick(() => {
      //   this.$refs[chartName].screenAdaptation()
      // })

      // 全屏切换联动效果
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: !this.fullScreenStatus[chartName]
      })
    },
    fullScreenData(data) {
      const chartName = data.chartName
      const value = data.value
      this.fullScreenStatus[chartName] = value
      this.$nextTick(() => {
        this.$refs[chartName].screenAdaptation()
      })
    },
    // 主题切换
    changeTheme() {
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: 'themeChange',
        socketType: 'themeChange',
        chartName: '',
        value: this.theme
      })
    },
    themeChangeData() {
      this.$store.commit('changeTheme')
    }
  },
  destroyed() {
    clearTimeout(this.timeId)
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('themeChange')
  }
}
</script>
<style lang="less" scoped>
.fullScreenState {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 10;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 70%;
    transform: translateY(-80%);
    img {
      height: 50px;
      width: 150px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}

.fullscreen {
  position: absolute;
  right: 25px;
  top: 17px;
  cursor: pointer;
}
</style>
