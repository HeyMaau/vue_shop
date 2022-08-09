<template>
  <div>
    <!--  面包屑区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片区域-->
    <el-card>
      <!--   添加角色   -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--   表格区域   -->
      <el-table
          :data="roleList"
          border
          stripe>
        <el-table-column
            type="expand">
        </el-table-column>
        <el-table-column
            type="index" label="#">
        </el-table-column>
        <el-table-column
            prop="roleName"
            label="角色名称">
        </el-table-column>
        <el-table-column
            prop="roleDesc"
            label="角色姓名">
        </el-table-column>
        <el-table-column
            label="操作">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  添加角色对话框  -->
    <el-dialog
        title="添加角色"
        :visible.sync="addRoleDialogVisible"
        width="50%"
        @close="addRoleDialogClose">
      <el-form :model="addRoleForm" :rules="addRoleRules" ref="addRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ShopRoles",
  created() {
    this.getRoleList()
  },
  data() {
    return {
      addRoleDialogVisible: false,
      roleList: [],
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
        ],
        roleDesc: [
          {required: true, message: '请输入角色描述', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    async getRoleList() {
      const {data: response} = await this.$http.get('roles')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取角色列表失败！')
      } else {
        this.roleList = response.data
      }
    },
    addRole() {
      this.$refs.addRoleFormRef.validate(async validated => {
        if (validated) {
          const {data: response} = await this.$http.post('roles', this.addRoleForm)
          console.log(response)
          if (response.meta.status !== 201) {
            this.$message.error('添加角色失败！')
          } else {
            this.$message.success('添加角色成功！')
            this.addRoleDialogVisible = false
            this.getRoleList()
          }
        }
      })

    },
    addRoleDialogClose() {
      this.$refs.addRoleFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>

</style>