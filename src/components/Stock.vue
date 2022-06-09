<template>
  <div id="contain">
    <div id="comMain" ref="stockRef"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Stock',
  data() {
    return {
      chartInstance: null,
      stockDataList: null,
      currentIndex: 0,
      timeId: ''
    }
  },
  created() {
    this.$socket.registerCallBack('stockData', this.getData)
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
      socketType: 'stockData',
      chartName: 'stock',
      value: ''
    })
    window.addEventListener('resize', this.screenAdaptation)
    this.screenAdaptation()
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stockRef, this.theme)
      const initOption = {
        title: {
          text: '▍ 库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.chartInstance.setOption(initOption)
    },
    getData(res) {
      // const { data: res } = await this.$http.get('stock')
      this.stockDataList = res
      this.upDataList()
      this.carousel()
    },
    upDataList() {
      // 圆环中心坐标
      const centerCoord = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]

      // 圆环颜色配置
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const startIndex = this.currentIndex * 5
      const endIndex = (this.currentIndex + 1) * 5

      const showData = this.stockDataList.slice(startIndex, endIndex)
      const seriesData = showData.map((item, index) => {
        return {
          type: 'pie',
          name: item.name,
          center: centerCoord[index],
          emphasis: {
            scale: false
          },
          label: {
            position: 'center',
            color: colorArr[index][0]
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: item.sales,
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
                      color: colorArr[index][0]
                    },
                    {
                      offset: 1, // 100%处的颜色
                      color: colorArr[index][1]
                    }
                  ]
                }
              }
            },
            {
              name: item.name + '\n\n' + item.sales,
              value: item.stock,
              itemStyle: {
                color: '#333843'
              }
            }
          ]
        }
      })
      const upOption = {
        series: seriesData
      }
      this.chartInstance.setOption(upOption)
    },
    carousel() {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > this.stockDataList.length / 5 - 1) {
          this.currentIndex = 0
        }
        this.upDataList()
      }, 3000)
    },
    screenAdaptation() {
      const titleSize = (this.$refs.stockRef.offsetWidth / 100) * 4.5
      const outRadius = titleSize * 2.3
      const inRadius = titleSize * 2

      const screenOption = {
        title: {
          textStyle: {
            fontSize: titleSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [inRadius, outRadius],
            label: {
              fontSize: titleSize / 2
            }
          },
          {
            type: 'pie',
            radius: [inRadius, outRadius],
            label: {
              fontSize: titleSize / 2
            }
          },
          {
            type: 'pie',
            radius: [inRadius, outRadius],
            label: {
              fontSize: titleSize / 2
            }
          },
          {
            type: 'pie',
            radius: [inRadius, outRadius],
            label: {
              fontSize: titleSize / 2
            }
          },
          {
            type: 'pie',
            radius: [inRadius, outRadius],
            label: {
              fontSize: titleSize / 2
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
    this.$socket.unRegisterCallBack('stockData')
  }
}
</script>

<style lang="less" scoped></style>
