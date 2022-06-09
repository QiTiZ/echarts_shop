<template>
  <div id="contain">
    <div id="comMain" ref="sellerRef"></div>
    <span
      id="arrowLeft"
      class="iconfont icon-arrow-left-bold"
      @click="prev"
      :style="arrowStyle"
    ></span>
    <span
      id="arrowRight"
      class="iconfont icon-arrow-right-bold"
      @click="next"
      :style="arrowStyle"
    ></span>
    <div class="bottomRightText" :style="arrowStyle">{{ rightBottomText }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'

export default {
  name: '',
  data() {
    return {
      chartInstance: null,
      hotDataList: null,
      currentIndex: 0,
      titleSize: 0
    }
  },
  created() {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  watch: {
    theme() {
      this.chartInstance.dispose()
      this.initChart()
      this.screenAdaptation()
      this.upDataList()
    }
  },
  mounted() {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      socketType: 'hotData',
      chartName: 'hot',
      value: ''
    })
    window.addEventListener('resize', this.screenAdaptation)
    this.screenAdaptation()
  },
  computed: {
    rightBottomText() {
      if (!this.hotDataList) {
        return ''
      } else {
        return this.hotDataList[this.currentIndex].name
      }
    },
    arrowStyle() {
      if (!this.hotDataList) {
        return ''
      } else {
        return {
          fontSize: this.titleSize / 2 + 'px',
          color: getThemeValue(this.theme).titleColor
        }
      }
    },
    ...mapState(['theme'])
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme)
      const initOption = {
        title: {
          text: '▍ 热销商品占比',
          left: 20,
          top: 20
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true,
          // trigger: 'item',
          formatter: '{b}的销量占比为{d}' + '%'
        },
        series: [
          {
            type: 'pie',
            radius: '50%'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData(res) {
      // const { data: res } = await this.$http.get('hot')
      this.hotDataList = res
      this.upDataList()
    },
    upDataList() {
      const legendName = this.hotDataList[this.currentIndex].children.map(
        (item) => {
          return item.name
        }
      )
      const seriesData = this.hotDataList[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value
          }
        }
      )

      const upOption = {
        legend: {
          data: legendName
        },
        series: [{ data: seriesData }]
      }
      this.chartInstance.setOption(upOption)
    },
    prev() {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.hotDataList.length - 1
      }
      this.upDataList()
    },
    next() {
      this.currentIndex++
      if (this.currentIndex > this.hotDataList.length - 1) {
        this.currentIndex = 0
      }
      this.upDataList()
    },
    screenAdaptation() {
      this.titleSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      const screenOption = {
        title: {
          textStyle: {
            fontSize: this.titleSize
          }
        },
        legend: {
          itemWidth: this.titleSize / 1.2,
          itemHeight: this.titleSize / 1.2,
          textStyle: {
            fontSize: this.titleSize / 2
          }
        },
        series: [
          {
            radius: this.titleSize * 4.5,
            center: ['50%', '60%']
          }
        ]
      }
      this.chartInstance.setOption(screenOption)
      this.chartInstance.resize()
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdaptation)
    this.$socket.unRegisterCallBack('hotData')
  }
}
</script>

<style lang="less" scoped>
#arrowLeft {
  position: absolute;
  top: 50%;
  left: 15%;
  transform: translateY(250%);
  color: #fff;
  cursor: pointer;
}

#arrowRight {
  position: absolute;
  top: 50%;
  right: 15%;
  transform: translateY(250%);
  color: #fff;
  cursor: pointer;
}

.bottomRightText {
  position: absolute;
  bottom: 10%;
  right: 10%;
  z-index: 1;
  color: #fff;
}
</style>
