<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card class="box-card">
      <!--   添加分类   -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <zk-table :data="categoryList" :columns="columns" show-index border :show-row-hover="false"
                :expand-type="false" :selection-type="false" index-text="#">

      </zk-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ShopCategory",
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      categoryList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        }
      ]
    }
  },
  methods: {
    async getCategoryList() {
      const {data: response} = await this.$http.get('categories', {
        params: this.queryInfo
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品分类失败！')
      } else {
        this.total = response.data.total
        this.categoryList = response.data.result
      }
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style scoped>

</style>