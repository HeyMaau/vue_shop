<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片区域  -->
    <el-card>
      <!--   警告！   -->
      <el-alert
          title="注意：只允许为第三级分类设置相关参数！"
          type="warning"
          :closable="false"
          show-icon>
      </el-alert>
      <!--   级联选择区域   -->
      <el-row class="category-cascader">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
              v-model="selectedCategoryKeys"
              :options="categoryList"
              :props="cascaderProps"
              @change="handleCategoryChange"></el-cascader>
        </el-col>
      </el-row>
      <!--   Tab区域   -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <!--    动态参数    -->
        <el-tab-pane label="动态参数" name="many">
          <div v-if="activeTabName === 'many'">
            <!--     添加参数按钮     -->
            <el-button type="primary" :disabled="btnClickable" @click="addParamsDialogVisible = true">添加参数</el-button>
            <!--     表格区域     -->
            <el-table
                :data="categoryParamList"
                border
                stripe
                style="width: 100%">
              <!--      展开列      -->
              <el-table-column
                  type="expand">
              </el-table-column>
              <el-table-column
                  type="index"
                  label="#">
              </el-table-column>
              <el-table-column
                  prop="attr_name"
                  label="参数名称">
              </el-table-column>
              <el-table-column
                  label="操作">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!--    静态属性    -->
        <el-tab-pane label="静态属性" name="only">
          <div v-if="activeTabName === 'only'">
            <!--     添加属性按钮     -->
            <el-button type="primary" :disabled="btnClickable" @click="addParamsDialogVisible = true">添加属性</el-button>
            <!--     表格区域     -->
            <el-table
                :data="categoryParamList"
                stripe
                border
                style="width: 100%">
              <!--      展开列      -->
              <el-table-column
                  type="expand">
              </el-table-column>
              <el-table-column
                  type="index"
                  label="#">
              </el-table-column>
              <el-table-column
                  prop="attr_name"
                  label="属性名称">
              </el-table-column>
              <el-table-column
                  label="操作">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!--  添加参数对话框  -->
    <el-dialog
        :title="'添加' + addParamsDialogTitle"
        :visible.sync="addParamsDialogVisible"
        width="50%"
        @close="addParamsDialogClose">
      <el-form :model="addParamsForm" :rules="addParamsFormRules" ref="addParamsFormRef" label-width="100px">
        <el-form-item :label="addParamsDialogTitle" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addParamsDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ShopCategoryParams",
  created() {
    this.getCategoryList()
  },
  data() {
    return {
      categoryList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedCategoryKeys: [],
      activeTabName: 'many',
      categoryParamList: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        attr_name: [
          {required: true, message: '请输入参数名称', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    async getCategoryList() {
      const {data: response} = await this.$http.get('categories')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品分类失败！')
      } else {
        this.categoryList = response.data
      }
    },
    handleCategoryChange(selectedKeys) {
      //只允许选中三级分类，因此数组长度不等于3时，直接将数组清空
      if (selectedKeys.length !== 3) {
        this.selectedCategoryKeys = []
        this.categoryParamList = []
        return
      }
      this.getCategoryParamList()
      console.log(selectedKeys)
    },
    handleTabClick() {
      this.categoryParamList = []
      if (this.selectedCategoryKeys.length === 3) {
        this.getCategoryParamList()
      }
    },
    async getCategoryParamList() {
      const {data: response} = await this.$http.get(`categories/${this.categoryId}/attributes`, {
        params: {
          sel: this.activeTabName
        }
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取分类参数失败！')
      } else {
        this.categoryParamList = response.data
      }
    },
    addParamsDialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    addParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (valid) {
          const {data: response} = await this.$http.post(`categories/${this.categoryId}/attributes`, {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeTabName
          })
          console.log(response)
          if (response.meta.status !== 201) {
            this.$message.error('添加参数失败！')
          } else {
            this.$message.success('添加参数成功！')
            this.addParamsDialogVisible = false
            this.getCategoryParamList()
          }
        }
      })
    }
  },
  computed: {
    //添加按钮是否可点击
    btnClickable() {
      //如果选中了三级分类则可以点击
      if (this.selectedCategoryKeys.length === 0) {
        return true
      }
      return false
    },
    categoryId() {
      //都只获取三级分类的ID
      return this.selectedCategoryKeys[2]
    },
    addParamsDialogTitle() {
      if (this.activeTabName === 'only') {
        return '静态属性'
      }
      return '动态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.category-cascader {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>