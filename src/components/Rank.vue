<template>
  <div id="contain">
    <div id="comMain" ref="rankRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Rank',
  data() {
    return {
      chartInstance: null,
      rankDataList: null,
      startIndex: 0,
      endIndex: 9,
      timeId: ''
    }
  },
  created() {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  computed: {
    ...mapState(['theme'])
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
      socketType: 'rankData',
      chartName: 'rank',
      value: ''
    })
    window.addEventListener('resize', this.screenAdaptation)
    this.screenAdaptation()
    this.chartInstance.on('mouseover', () => {
      clearInterval(this.timeId)
    })

    this.chartInstance.on('mouseout', () => {
      this.carousel()
    })
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rankRef, this.theme)
      const initOption = {
        title: {
          text: '▍ 地区销售排行',
          left: 20,
          top: 20
        },
        grid: {
          top: '30%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {},
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData(res) {
      // const { data: res } = await this.$http.get('rank')
      this.rankDataList = res
      this.rankDataList.sort((a, b) => {
        return b.value - a.value
      })
      this.upDataList()
      this.carousel()
    },
    upDataList() {
      const xData = this.rankDataList.map((item) => {
        return item.name
      })
      const seriesData = this.rankDataList.map((item) => {
        return item.value
      })
      const upOption = {
        xAxis: {
          data: xData
        },
        // 缩放
        dataZoom: {
          show: false,
          startValue: this.startIndex,
          endValue: this.endIndex
        },
        series: [
          {
            data: seriesData
          }
        ]
      }
      this.chartInstance.setOption(upOption)
    },
    // 定时器
    carousel() {
      if (!this.timeId) {
        clearInterval(this.timeId)
      }

      this.timeId = setInterval(() => {
        this.startIndex++
        this.endIndex++
        if (this.endIndex > this.rankDataList.length - 1) {
          this.startIndex = 0
          this.endIndex = 9
        }
        this.upDataList()
      }, 3000)
    },
    // 分辨率适配
    screenAdaptation() {
      const titleSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6
      const screenOption = {
        title: {
          textStyle: {
            fontSize: titleSize
          }
        },
        series: [
          {
            barWidth: titleSize,
            itemStyle: {
              borderRadius: [titleSize / 2, titleSize / 2, 0, 0],
              color: {
                x: 0,
                y: 1,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: '#5052EE' // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: '#AB6EE5' // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            }
          }
        ]
      }
      this.chartInstance.setOption(screenOption)
      this.chartInstance.resize()
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdaptation)
    clearInterval(this.timeId)
    this.$socket.unRegisterCallBack('rankData')
  }
}
</script>

<style lang="less" scoped></style>
