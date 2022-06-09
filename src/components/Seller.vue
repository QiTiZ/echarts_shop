<template>
  <div id="contain">
    <div id="comMain" ref="sellerRef">
      <span class="iconfont icon-arrow-left-bold"></span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Seller',
  data() {
    return {
      chartInstance: null,
      sellerDataList: null,
      // 当前页
      currentPage: 1,
      // 总页面
      total: 0,
      timeId: 0
    }
  },
  created() {
    this.$socket.registerCallBack('sellerData', this.getData)
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
      socketType: 'sellerData',
      chartName: 'seller',
      value: ''
    })
    window.addEventListener('resize', this.screenAdaptation)
    this.screenAdaptation()
    // 鼠标事件
    this.chartInstance.on('mouseover', () => {
      clearInterval(this.timeId)
    })
    this.chartInstance.on('mouseout', () => {
      this.carousel()
    })
  },
  methods: {
    initChart() {
      // 初始化echarts
      this.chartInstance = this.$echarts.init(this.$refs.sellerRef, this.theme)
      const initOption = {
        title: {
          text: '▍ 商家销售量统计',
          left: 20,
          top: 20
        },
        grid: {
          left: '5%',
          top: '20%',
          right: '5%',
          bottom: '8%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}的销量是{c}'
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        series: [
          {
            type: 'bar',
            barWidth: '50',
            label: {
              show: true,
              position: 'right'
            }
          }
        ]
      }

      this.chartInstance.setOption(initOption)
    },
    // 获取数据
    getData(res) {
      // const { data: res } = await this.$http.get('seller')
      this.sellerDataList = res
      // 从大到小排序
      this.sellerDataList.sort((a, b) => {
        return b.value - a.value
      })
      // 每页展示五条数据
      this.total = res.length % 5 === 0 ? res.length / 5 : res.length / 5 + 1
      this.upDataList()
      this.carousel()
    },
    upDataList() {
      const startIndex = (this.currentPage - 1) * 5
      const endIndex = this.currentPage * 5

      const showData = this.sellerDataList.slice(startIndex, endIndex)
      const yData = showData.map((item) => {
        return item.name
      })

      const seriesData = showData.map((item) => {
        return item.value
      })
      const upDataOption = {
        yAxis: {
          data: yData
        },
        series: [
          {
            data: seriesData,
            itemStyle: {
              borderRadius: [0, 30, 30, 0],
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
      this.chartInstance.setOption(upDataOption)
    },
    carousel() {
      if (this.timeId) {
        clearInterval(this.timeId)
      }
      this.timeId = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.total) {
          this.currentPage = 1
        }
        this.upDataList()
      }, 3000)
    },
    // 屏幕适配
    screenAdaptation() {
      const titleSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
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
              borderRadius: [0, titleSize / 2, titleSize / 2, 0]
            }
          }
        ]
      }
      this.chartInstance.setOption(screenOption)
      this.chartInstance.resize()
    }
  },
  destroyed() {
    // 清空定时器
    clearInterval(this.timeId)
    window.removeEventListener('resize', this.screenAdaptation)
    this.$socket.unRegisterCallBack('sellerData')
  }
}
</script>

<style lang="less" scoped></style>
