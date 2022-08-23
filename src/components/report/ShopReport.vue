<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card>
      <!--   图标区域   -->
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  name: "ShopReport",
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      },
      charData: {}
    }
  },
  methods: {
    async getChartData(myChart) {
      const {data: response} = await this.$http.get('reports/type/1')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取报表失败！')
      } else {
        this.charData = _.merge(response.data, this.options)
        myChart.setOption(this.charData);
      }
    }
  },
  mounted() {
    let myChart = echarts.init(document.getElementById('main'))
    this.getChartData(myChart)
  }
}
</script>

<style scoped>

</style>