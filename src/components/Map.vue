<template>
  <div id="contain" @dblclick="backChina">
    <div id="comMain" ref="mapRef"></div>
  </div>
</template>

<script>
import axios from 'axios'
import { getProvinceMapInfo } from '../utils/mapPinyin'
import { mapState } from 'vuex'

export default {
  name: 'Map',
  data() {
    return {
      chartInstance: null,
      mapDataList: []
    }
  },
  created() {
    this.$socket.registerCallBack('mapData', this.getData)
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
      socketType: 'mapData',
      chartName: 'map',
      value: ''
    })
    window.addEventListener('resize', this.screenAdaptation)
    this.screenAdaptation()
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.mapRef, this.theme)

      const { data: res } = await axios.get(
        'http://localhost:8080/state/map/china.json'
      )
      this.$echarts.registerMap('china', res)
      const initOption = {
        title: {
          text: '▍ 商家分布',
          left: 20,
          top: 20
        },
        legend: {
          left: 40,
          bottom: 30,
          // 垂直方向
          orient: 'vertical',
          itemGap: 20
        },
        geo: [
          {
            type: 'map',
            map: 'china',
            top: '10%',
            bottom: '8%',
            itemStyle: {
              areaColor: '#2E72BF'
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
    },
    getData(res) {
      // const { data: res } = await this.$http.get('map')
      this.mapDataList = res
      this.upDataList()

      // 点击省市区进入详细地图
      this.chartInstance.on('click', async (e) => {
        const provinceData = getProvinceMapInfo(e.name)
        const { data: res } = await axios.get(
          'http://localhost:8080/' + provinceData.path
        )

        this.$echarts.registerMap('province', res)
        const provinceOption = {
          geo: [
            {
              type: 'map',
              map: 'province'
            }
          ]
        }

        this.chartInstance.setOption(provinceOption)
      })
    },
    upDataList() {
      // 涟漪图
      const seriesData = this.mapDataList.map((item) => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            // 空心涟漪效果
            brushType: 'stroke'
          }
        }
      })
      const upOption = {
        series: seriesData
      }
      this.chartInstance.setOption(upOption)
    },
    // 分辨率
    screenAdaptation() {
      const titleSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6
      const screenOption = {
        title: {
          textStyle: {
            fontSize: titleSize
          }
        },
        legend: [
          {
            itemWidth: titleSize / 1.2,
            itemHeight: titleSize / 1.2,
            textStyle: {
              fontSize: titleSize / 2
            }
          }
        ]
      }
      this.chartInstance.setOption(screenOption)
      this.chartInstance.resize()
    },
    // 双击返回中国地图
    backChina() {
      const backChinaOption = {
        geo: {
          type: 'map',
          map: 'china'
        }
      }

      this.chartInstance.setOption(backChinaOption)
    }
  },
  destroyed() {
    window.removeEventListener('resize', this.screenAdaptation)
    this.$socket.unRegisterCallBack('mapData')
  }
}
</script>

<style lang="less" scoped></style>
