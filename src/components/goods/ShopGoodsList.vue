<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card>
      <!--   搜索栏   -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable placeholder="请输入内容" v-model="queryInfo.query" @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goToAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!--   表格区域   -->
      <el-table
          :data="goodsList"
          border
          stripe
          style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column
            prop="goods_name"
            label="商品名称"
            min-width="55">
        </el-table-column>
        <el-table-column
            prop="goods_price"
            label="商品价格"
            min-width="10">
        </el-table-column>
        <el-table-column
            prop="goods_weight"
            label="商品重量"
            min-width="10">
        </el-table-column>
        <el-table-column
            label="创建时间"
            min-width="15">
          <template slot-scope="scope">
            {{ scope.row.add_time | dataFormater }}
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            min-width="10">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页   -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="this.queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
          background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ShopGoodsList",
  created() {
    this.getGoodsList()
  },
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsList: []
    }
  },
  methods: {
    async getGoodsList() {
      const {data: response} = await this.$http.get('goods', {
        params: this.queryInfo
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品列表数据失败！')
      } else {
        this.total = response.data.total
        this.goodsList = response.data.goods
      }
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    removeGoodsById(goodsInfo) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: response} = await this.$http.delete('goods/' + goodsInfo.goods_id)
        console.log(response)
        if (response.meta.status !== 200) {
          this.$message.error('删除商品失败！')
        } else {
          this.$message.success('删除商品成功！')
          this.getGoodsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    goToAddPage() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style scoped>

</style>