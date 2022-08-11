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
          <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格区域-->
      <zk-table :data="categoryList" :columns="columns" show-index border :show-row-hover="false"
                :expand-type="false" :selection-type="false" index-text="#" class="tree-table">
        <!--    是否有效列    -->
        <template slot="valid" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color: green"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!--    排序列    -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--    操作列    -->
        <template slot="operate" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCategoryDialog(scope.row)">编辑
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCategoryById(scope.row)">删除</el-button>
        </template>
      </zk-table>
      <!--分页区域-->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 15]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
    <!--  添加分类对话框  -->
    <el-dialog
        title="添加分类"
        @close="addCategoryDialogClose"
        :visible.sync="addCategoryDialogVisible"
        width="50%">
      <!--   表单区域   -->
      <el-form :model="addCategoryForm" :rules="addCategoryFormRules" ref="addCategoryFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCategoryForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
              v-model="selectedParentCategoryKeys"
              :options="parentCategoryList"
              :props="cascaderProps"
              clearable
              @change="handleParentCategoryChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCategory">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改分类对话框  -->
    <el-dialog
        title="修改分类"
        :visible.sync="editCategoryDialogVisible"
        width="50%">
      <!--   表单区域   -->
      <!--   与添加分类共用校验规则   -->
      <el-form :model="editCategoryForm" :rules="addCategoryFormRules" ref="editCategoryFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editCategoryForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCategory">确 定</el-button>
  </span>
    </el-dialog>
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
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'valid',
        },
        {
          label: '排序',
          type: 'template',
          template: 'order',
        },
        {
          label: '操作',
          type: 'template',
          template: 'operate',
        }
      ],
      addCategoryDialogVisible: false,
      addCategoryForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCategoryFormRules: {
        cat_name: [
          {required: true, message: '请输入活动名称', trigger: 'blur'}
        ]
      },
      parentCategoryList: [],
      selectedParentCategoryKeys: [],
      cascaderProps: {
        expandTrigger: 'hover',
        children: 'children',
        label: 'cat_name',
        value: 'cat_id',
        checkStrictly: true
      },
      editCategoryDialogVisible: false,
      editCategoryForm: {}
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
    },
    handleSizeChange(newPageSize) {
      this.queryInfo.pagesize = newPageSize
      this.getCategoryList()
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pagenum = currentPage
      this.getCategoryList()
    },
    showAddCategoryDialog() {
      this.getParentCategoryList()
      this.addCategoryDialogVisible = true
    },
    async getParentCategoryList() {
      const {data: response} = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取父级分类失败！')
      } else {
        this.parentCategoryList = response.data
      }
    },
    handleParentCategoryChange(selectedKeys) {
      this.addCategoryForm.cat_level = selectedKeys.length
      this.addCategoryForm.cat_pid = selectedKeys[selectedKeys.length - 1]
    },
    addCategoryDialogClose() {
      this.selectedParentCategoryKeys = []
      this.$refs.addCategoryFormRef.resetFields()
      this.addCategoryForm.cat_level = 0
      this.addCategoryForm.cat_pid = 0
    },
    addCategory() {
      this.$refs.addCategoryFormRef.validate(async valid => {
        if (valid) {
          const {data: response} = await this.$http.post('categories', this.addCategoryForm)
          console.log(response)
          if (response.meta.status !== 201) {
            this.$message.error('添加分类失败！')
          } else {
            this.$message.success('添加分类成功！')
            this.addCategoryDialogVisible = false
            this.getCategoryList()
          }
        }
      })
    },
    showEditCategoryDialog(categoryInfo) {
      this.editCategoryDialogVisible = true
      this.editCategoryForm = categoryInfo
    },
    editCategory() {
      this.$refs.editCategoryFormRef.validate(async valid => {
        if (valid) {
          console.log(this.editCategoryForm)
          const {data: response} = await this.$http.put('categories/' + this.editCategoryForm.cat_id, {
            cat_name: this.editCategoryForm.cat_name
          })
          console.log(response)
          if (response.meta.status !== 200) {
            this.$message.error('修改分类失败！')
          } else {
            this.$message.success('修改分类成功！')
            this.getCategoryList()
            this.editCategoryDialogVisible = false
          }
        }
      })
    },
    removeCategoryById(categoryInfo) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: response} = await this.$http.delete('categories/' + categoryInfo.cat_id)
        console.log(response)
        if (response.meta.status !== 200) {
          this.$message.error('删除分类失败！')
        } else {
          this.$message.success('删除分类成功！')
          this.getCategoryList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除分类'
        })
      })
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style scoped>
.tree-table {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>