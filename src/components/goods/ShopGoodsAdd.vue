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
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyAttrList" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
                :action="uploadPicUrl"
                :headers="httpHeader"
                :on-success="onPicUploadSuccess"
                :on-preview="handlePicPreview"
                :on-remove="handlePicRemove"
                list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--      富文本编辑器      -->
            <quill-editor v-model="addGoodsForm.goods_introduce"/>
            <el-button type="primary" class="btn-add-goods" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!--  上传图片预览  -->
    <el-dialog
        title="图片预览"
        :visible.sync="previewPicDialogVisible"
        width="50%">
      <img :src="previewPicUrl" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: "ShopGoodsAdd",
  created() {
    this.getCategoryList()
  },
  data() {
    //用于校验添加商品中需要输入数字的表单
    let checkNumber = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error('价格不能为空'));
      }
      callback()
    }
    return {
      activeStep: '0',
      //是否进入了商品参数
      isEnterStep1: false,
      //是否进入了商品属性
      isEnterStep2: false,
      addGoodsForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        pics: [],
        goods_introduce: ''
      },
      addGoodsFormRules: {
        goods_name: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
        ],
        goods_price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        goods_weight: [
          {required: true, message: '请输入商品重量', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
        ],
        goods_number: [
          {required: true, message: '请输入商品数量', trigger: 'blur'},
          {validator: checkNumber, trigger: 'blur'}
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
      manyParamList: [],
      onlyAttrList: [],
      uploadPicUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      httpHeader: {
        Authorization: sessionStorage.getItem('token')
      },
      previewPicDialogVisible: false,
      previewPicUrl: ''
    }
  },
  methods: {
    /**
     * 获取分类数据
     * @returns {Promise<void>}
     */
    async getCategoryList() {
      const {data: response} = await this.$http.get('categories')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品分类数据失败！')
      } else {
        this.categoryList = response.data
      }
    },

    /**
     * 获取商品动态参数
     * @returns {Promise<void>}
     */
    async getGoodsManyParams() {
      const {data: response} = await this.$http.get(`categories/${this.categoryId}/attributes`, {
        params: {
          sel: 'many'
        }
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品参数数据失败！')
      } else {
        response.data.forEach(item => {
          item.attr_vals = item.attr_vals.split(' ')
        })
        this.manyParamList = response.data
      }
    },

    /**
     * 获取商品静态属性
     */
    async getGoodsOnlyAttrs() {
      const {data: response} = await this.$http.get(`categories/${this.categoryId}/attributes`, {
        params: {
          sel: 'only'
        }
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取商品属性数据失败！')
      } else {
        this.onlyAttrList = response.data
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
        this.getGoodsManyParams()
        this.isEnterStep1 = true
      } else if (this.activeStep === '2') {
        this.isEnterStep2 = this
        this.getGoodsOnlyAttrs()
      } else if (this.activeStep === '4') {
        //进入商品内容TAB，如果之前没有点击过商品参数和商品属性，需要拉取一下参数，不然提交的时候，这两个表单项是空的
        if (!(this.isEnterStep1 && this.isEnterStep2)) {
          this.getGoodsManyParams()
          this.getGoodsOnlyAttrs()
        }
      }
    },
    handlePicPreview(file) {
      console.log(file)
      this.previewPicDialogVisible = true
      this.previewPicUrl = file.response.data.url
    },
    handlePicRemove(file) {
      const picPath = file.response.data.tmp_path
      const index = this.addGoodsForm.pics.findIndex(value => {
        return value.pic === picPath
      });
      this.addGoodsForm.pics.splice(index, 1)
    },
    onPicUploadSuccess(response) {
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('上传商品图片失败！')
      } else {
        this.$message.success('上传商品图片成功！')
        const picInfo = {
          'pic': response.data.tmp_path
        }
        this.addGoodsForm.pics.push(picInfo)
      }
    },
    /**
     * 添加商品
     */
    addGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (valid) {
          //先深拷贝addGoodsForm，避免影响原有界面数据
          const addGoodsFormClone = _.cloneDeep(this.addGoodsForm)
          //拼接分类列表
          addGoodsFormClone.goods_cat = addGoodsFormClone.goods_cat.join(',')
          //拼接动态参数
          const attrs = []
          this.manyParamList.forEach(item => {
            const attr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            attrs.push(attr)
          })
          //拼接静态属性
          this.onlyAttrList.forEach(item => {
            const attr = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            attrs.push(attr)
          })
          addGoodsFormClone.attrs = attrs
          const {data: response} = await this.$http.post('goods', addGoodsFormClone)
          console.log(response)
          if (response.meta.status !== 201) {
            this.$message.error('添加商品失败！')
          } else {
            this.$message.success('添加商品成功！')
            this.$router.push('/goods')
          }
          console.log(addGoodsFormClone)
        }
      })
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

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}

.preview-img {
  width: 100%;
}

.btn-add-goods {
  margin-top: 15px;
}
</style>