<template>
  <div id="contain">
    <div class="title" :style="titleSizeee">
      <span>{{ '▍  ' + showTitle }}</span>
      <span
        :style="titleSizeee"
        class="iconfont icon-arrow-down-bold"
        id="downStyle"
        @click="showName = !showName"
      ></span>
      <div
        class="selectTitle"
        v-for="item in selectCaption"
        :key="item.key"
        v-show="showName"
        @click="changeType(item.key)"
        :style="marginStyle"
      >
        {{ item.text }}
      </div>
    </div>
    <div id="comMain" ref="sellerRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getThemeValue } from '../utils/theme_utils'
export default {
  name: 'Trend',
  data() {
    return {
      chartInstance: null,
      trendDataList: null,
      // 类型
      dataType: 'map',
      titleSize: 0,
      showName: false
    }
  },
  created() {
    this.$socket.registerCallBack('trendData', this.getData)
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
      socketType: 'trendData',
      chartName: 'trend',
      value: ''
    })
    window.addEventListener('resize', this.screenAdaptation)
    this.screenAdaptation()
  },
  computed: {
    // 标题
    showTitle() {
      if (!this.trendDataList) {
        return ''
      } else {
        return this.trendDataList[this.dataType].title
      }
    },
    // 可选标题
    selectCaption() {
      if (!this.trendDataList) {
        return []
      } else {
        return this.trendDataList.type.filter((item) => {
          return item.key !== this.dataType
        })
      }
    },
    // 标题文字大小
    titleSizeee() {
      if (!this.trendDataList) {
        return ''
      } else {
        return {
          fontSize: this.titleSize + 'px',
          color: getThemeValue(this.theme).titleColor
        }
      }
    },
    // 标题距离左边距离
    marginStyle() {
      return {
        marginLeft: this.titleSize * 0.9 + 'px'
      }
    },
    ...mapState(['theme'])
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme)
      const initOption = {
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          top: '20%',
          icon: 'circle'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          top: '35%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        }
      }
      this.chartInstance.setOption(initOption)
    },
    getData(res) {
      // const { data: res } = await this.$http.get('trend')

      this.trendDataList = res
      this.upDataList()
    },
    upDataList() {
      const xData = this.trendDataList.common.month

      // 渐变颜色数据列表
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]

      const legendName = this.trendDataList[this.dataType].data.map((item) => {
        return item.name
      })

      const seriesData = this.trendDataList[this.dataType].data.map(
        (item, index) => {
          return {
            type: 'line',
            name: item.name,
            data: item.data,
            areaStyle: {},
            stack: this.dataType,
            // 渐变颜色
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  // 从上往下渐变
                  {
                    offset: 0, // 0%处的颜色
                    color: colorArr1[index]
                  },
                  {
                    offset: 1, // 100%处的颜色
                    color: colorArr2[index]
                  }
                ]
              }
            }
          }
        }
      )
      const upOption = {
        xAxis: {
          data: xData
        },
        legend: {
          data: legendName
        },
        series: seriesData
      }
      this.chartInstance.setOption(upOption)
    },
    // 点击不同标题更改图表
    changeType(e) {
      this.dataType = e
      this.upDataList()
    },
    screenAdaptation() {
      this.titleSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      const screenOption = {
        legend: {
          itemWidth: this.titleSize / 1.2,
          itemHeight: this.titleSize / 1.2,
          textStyle: {
            fontSize: this.titleSize / 2
          }
        }
      }
      this.chartInstance.setOption(screenOption)
      this.chartInstance.resize()
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdaptation)
    this.$socket.unRegisterCallBack('trendData')
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  top: 9px;
  left: 25px;
  z-index: 1;
  color: #fff;
  font-weight: bold;
}
#downStyle {
  margin-left: 15px;
  cursor: pointer;
}
</style>
