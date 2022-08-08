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
        <!--    添加用户    -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserVisible = true">添加用户</el-button>
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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="showEditUserDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"
                       @click="removeUserById(scope.row.id)"></el-button>
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
    <!--  添加用户对话框  -->
    <el-dialog
        title="添加用户"
        :visible.sync="addUserVisible"
        width="50%"
        @close="addUserDialogClose">
      <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser">确 定</el-button>
  </span>
    </el-dialog>
    <!--  修改用户对话框  -->
    <el-dialog
        title="修改用户"
        :visible.sync="editUserVisible"
        width="50%"
        @close="editUserDialogClose">
      <!--   与添加用户共用校验规则   -->
      <el-form :model="editUserForm" :rules="addUserRules" ref="editUserFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ShopUsers",
  created() {
    this.getUserList()
  },
  data() {
    var checkEmail = (rule, value, callback) => {
      const regex = /^\w+@[\da-z.-]+\.([a-z]{2,6}|[\u2E80-\u9FFF]{2,3})$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的邮箱地址'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regex = /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/
      if (regex.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的手机号码'))
      }
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      users: [],
      addUserVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 5, message: '用户名长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      editUserVisible: false,
      editUserForm: {},
    }
  },
  methods: {
    async getUserList() {
      const {data: response} = await this.$http.get('users', {
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
    },
    addUserDialogClose() {
      this.$refs.addUserFormRef.resetFields()
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async validated => {
        if (validated) {
          const {data: response} = await this.$http.post('users', this.addUserForm)
          console.log(response)
          if (response.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          } else {
            this.$message.success('添加用户成功！')
            this.addUserVisible = false
            this.getUserList()
          }
        }
      })
    },
    async showEditUserDialog(id) {
      const {data: response} = await this.$http.get('users/' + id)
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('查询用户信息失败！')
      } else {
        this.editUserForm = response.data
        this.editUserVisible = true
      }
    },
    editUserDialogClose() {
      this.$refs.editUserFormRef.resetFields()
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async validated => {
        if (validated) {
          const {data: response} = await this.$http.put('users/' + this.editUserForm.id, {
            email: this.editUserForm.email,
            mobile: this.editUserForm.mobile
          })
          console.log(response)
          if (response.meta.status !== 200) {
            this.$message.error('修改用户失败！')
          } else {
            this.$message.success('修改用户成功！')
            this.editUserVisible = false
            this.getUserList()
          }
        }
      })
    },
    removeUserById(id) {
      console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: response} = await this.$http.delete('users/' + id)
        console.log(response)
        if (response.meta.status !== 200) {
          this.$message.error('删除用户失败！')
        } else {
          this.$message.success('删除用户成功！')
          this.getUserList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除用户'
        })
      })
    }
  }
}
</script>

<style scoped>

</style>