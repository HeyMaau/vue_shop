<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!--    搜索区域    -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!--   表格区域   -->
      <el-table
          stripe
          :data="users"
          border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
            prop="username"
            label="姓名">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="角色">
        </el-table-column>
        <el-table-column
            label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state" @change="handleStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页区域   -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ShopUsers",
  created() {
    this.getUserList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      users: []
    }
  },
  methods: {
    async getUserList() {
      const {data: response} = await this.$http.get('/users', {
        params: this.queryInfo
      })
      if (response.meta.status !== 200) {
        this.$message.error(response.meta.msg)
      } else {
        this.total = response.data.total
        this.users = response.data.users
      }
      console.log(response)
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getUserList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async handleStateChange(newState) {
      console.log(newState)
      const {data: response} = await this.$http.put(`users/${newState.id}/state/${newState.mg_state}`)
      if (response.meta.status !== 200) {
        this.$message.error(response.meta.msg)
      } else {
        this.$message.success('更新用户状态成功！')
      }
    }
  }
}
</script>

<style scoped>

</style>