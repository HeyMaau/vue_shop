<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card class="box-card">
      <!--   搜索框   -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!--   表格区域   -->
      <el-table
          :data="orderList"
          style="width: 100%">
        <!--    索引列    -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
            prop="order_number"
            label="订单编号">
        </el-table-column>
        <el-table-column
            prop="order_price"
            label="订单价格">
        </el-table-column>
        <el-table-column
            label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            prop="is_send"
            label="是否发货">
        </el-table-column>
        <el-table-column
            label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dataFormater }}}
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ShopOrder",
  created() {
    this.getOrderList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      orderList: [],
      total: 0
    }
  },
  methods: {
    async getOrderList() {
      const {data: response} = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取订单数据失败！')
      } else {
        this.orderList = response.data.goods
        this.total = response.data.total
      }
    }
  }
}
</script>

<style scoped>

</style>