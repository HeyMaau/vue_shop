<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card>
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
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditAddressDialog"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini"
                       @click="showExpressProgressDialog"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--  修改地址对话框  -->
    <el-dialog
        title="修改地址"
        :visible.sync="editAddressDialogVisible"
        width="50%"
        @close="editAddressDialogClose">
      <el-form :model="editAddressForm" :rules="editAddressFormRules" ref="editAddressFormRef" label-width="100px">
        <el-form-item label="省市区/县" prop="district">
          <el-cascader
              v-model="editAddressForm.district"
              :options="citydata"
              :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="editAddressForm.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editAddressDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editAddressDialogVisible = false">确 定</el-button>
  </span>
    </el-dialog>
    <!--  物流进度对话框  -->
    <el-dialog
        title="物流进度"
        :visible.sync="expressProgressDialogVisible"
        width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item
            v-for="(activity, index) in expressProgress"
            :key="index"
            :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from "@/components/order/citydata";

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
      total: 0,
      editAddressDialogVisible: false,
      editAddressForm: {
        district: [],
        address: ''
      },
      editAddressFormRules: {
        district: [
          {required: true, message: '请选择省市区/县', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ]
      },
      citydata,
      expressProgressDialogVisible: false,
      expressProgress: [{
        "time": "2018-05-10 09:39:00",
        "ftime": "2018-05-10 09:39:00",
        "context": "已签收,感谢使用顺丰,期待再次为您服务",
        "location": ""
      },
        {
          "time": "2018-05-10 08:23:00",
          "ftime": "2018-05-10 08:23:00",
          "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
          "location": ""
        },
        {
          "time": "2018-05-10 07:32:00",
          "ftime": "2018-05-10 07:32:00",
          "context": "快件到达 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-10 02:03:00",
          "ftime": "2018-05-10 02:03:00",
          "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
          "location": ""
        },
        {
          "time": "2018-05-09 23:05:00",
          "ftime": "2018-05-09 23:05:00",
          "context": "快件到达 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 21:21:00",
          "ftime": "2018-05-09 21:21:00",
          "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
          "location": ""
        },
        {
          "time": "2018-05-09 13:07:00",
          "ftime": "2018-05-09 13:07:00",
          "context": "顺丰速运 已收取快件",
          "location": ""
        },
        {
          "time": "2018-05-09 12:25:03",
          "ftime": "2018-05-09 12:25:03",
          "context": "卖家发货",
          "location": ""
        },
        {
          "time": "2018-05-09 12:22:24",
          "ftime": "2018-05-09 12:22:24",
          "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
          "location": ""
        },
        {
          "time": "2018-05-08 21:36:04",
          "ftime": "2018-05-08 21:36:04",
          "context": "商品已经下单",
          "location": ""
        }]
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
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    showEditAddressDialog() {
      this.editAddressDialogVisible = true
    },
    editAddressDialogClose() {
      this.$refs.editAddressFormRef.resetFields()
    },
    async getExpressProgress() {
      const {data: response} = await this.$http.get('/kuaidi/804909574412544580')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取物流信息失败！')
      } else {
        this.expressProgress = response.data
      }
    },
    showExpressProgressDialog() {
      // this.getExpressProgress()
      this.expressProgressDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>