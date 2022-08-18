<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card>
      <!--   提示Banner   -->
      <el-alert
          title="添加商品信息"
          type="info"
          center
          :closable="false"
          show-icon>
      </el-alert>
      <!--   步骤条   -->
      <el-steps :space="200" :active="activeStep - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--   表单区域   -->
      <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-width="100px"
               label-position="top">
        <!--   Tabs区域   -->
        <el-tabs :tab-position="'left'" v-model="activeStep" :before-leave="beforeTabLeave" @tab-click="handleTabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                  v-model="addGoodsForm.goods_cat"
                  :options="categoryList"
                  :props="cascaderProps"
                  @change="handleCascaderChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyParamList" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val, index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ShopGoodsAdd",
  created() {
    this.getCategoryList()
  },
  data() {
    return {
      activeStep: '0',
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0
      },
      addGoodsFormRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'},
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'},
        ],
        goods_cat: [
          {required: true, message: '请选择商品分类', trigger: 'blur'},
        ]
      },
      categoryList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyParamList: []
    }
  },
  methods: {
    async getCategoryList() {
      const {data: response} = await this.$http.get('categories')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品分类数据失败！')
      } else {
        this.categoryList = response.data
      }
    },
    async getGoodsAttrs() {
      const {data: response} = await this.$http.get(`categories/${this.categoryId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品属性数据失败！')
      } else {
        response.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.manyParamList = response.data
      }
    },
    handleCascaderChange() {
      if (this.addGoodsForm.goods_cat.length !== 3) {
        this.addGoodsForm.goods_cat = []
      }
    },
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    handleTabClick() {
      if (this.activeStep === '1') {
        this.getGoodsAttrs()
      }
    }
  },
  computed: {
    categoryId() {
      if (this.addGoodsForm.goods_cat.length === 3) {
        return this.addGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style scoped>

</style>