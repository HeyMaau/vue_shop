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
        <!--    折叠行    -->
        <el-table-column
            type="expand">
          <template slot-scope="scope">
            <!--     一级权限       -->
            <el-row v-for="(item1, index1) in scope.row.children" :key="item1.id"
                    :class="['bdbottom' ,index1 === 0 ? 'bdtop' : '', 'vcenter', 'expandpadding']">
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!--        二级权限        -->
                <el-row v-for="(item2, index2) in item1.children" :key="item2.id"
                        :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!--        三级权限          -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                            @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditRoleDialog(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="showRightsSettingDialog(scope.row)">
              分配权限
            </el-button>
          </template>
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
    <!--  修改角色对话框  -->
    <el-dialog
        title="修改角色"
        :visible.sync="editRoleDialogVisible"
        width="50%"
        @close="editRoleDialogClose">
      <!--   与添加角色共用校验规则   -->
      <el-form :model="editRoleForm" :rules="addRoleRules" ref="editRoleFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="editRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRole">确 定</el-button>
  </span>
    </el-dialog>
    <!--  分配权限对话框  -->
    <el-dialog
        title="分配权限"
        :visible.sync="rightsSettingDialogVisible"
        width="50%">
      <el-tree :data="rightList" :props="rightListProps" show-checkbox default-expand-all node-key="id"
               :default-checked-keys="defaultKeys" ref="rightListRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="rightsSettingDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allocateRights">确 定</el-button>
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
      },
      editRoleDialogVisible: false,
      editRoleForm: {},
      rightsSettingDialogVisible: false,
      rightList: [],
      rightListProps: {
        children: 'children',
        label: 'authName'
      },
      defaultKeys: [],
      roleId: ''
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
    },
    async removeRoleById(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: response} = await this.$http.delete('roles/' + id)
        console.log(response)
        if (response.meta.status !== 200) {
          this.$message.error('删除角色失败！')
        } else {
          this.$message.success('删除用户成功！')
          this.getRoleList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除角色'
        })
      })
    },
    async showEditRoleDialog(id) {
      const {data: response} = await this.$http.get('roles/' + id)
      if (response.meta.status !== 200) {
        this.$message.error('获取角色信息失败！')
      } else {
        this.editRoleDialogVisible = true
        this.editRoleForm = response.data
      }
    },
    editRoleDialogClose() {
      this.$refs.editRoleFormRef.resetFields()
    },
    editRole() {
      this.$refs.editRoleFormRef.validate(async validated => {
        if (validated) {
          const {data: response} = await this.$http.put('roles/' + this.editRoleForm.roleId, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })
          if (response.meta.status !== 200) {
            this.$message.error('修改角色信息失败！')
          } else {
            this.$message.success('修改角色信息成功！')
            this.editRoleDialogVisible = false
            this.getRoleList()
          }
        }
      })
    },
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const {data: response} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        console.log(response)
        if (response.meta.status !== 200) {
          this.$message.error('删除权限失败！')
        } else {
          this.$message.success('删除权限成功！')
          role.children = response.data
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除用户'
        })
      })
    },
    async showRightsSettingDialog(role) {
      this.roleId = role.id
      const {data: response} = await this.$http.get('rights/tree')
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('获取权限列表失败！')
      } else {
        this.rightsSettingDialogVisible = true
        this.rightList = response.data
        this.defaultKeys = []
        this.getLeafKeys(role, this.defaultKeys)
      }
    },
    //递归获取三级权限节点及ID
    getLeafKeys(node, keyArr) {
      //没有children字段，说明是三级节点
      if (!node.children) {
        keyArr.push(node.id)
        return
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, keyArr)
      })
    },
    async allocateRights() {
      const rightArr = [
        ...this.$refs.rightListRef.getCheckedKeys(),
        ...this.$refs.rightListRef.getHalfCheckedKeys()
      ]
      const rights = rightArr.join(",")
      const {data: response} = await this.$http.post(`roles/${this.roleId}/rights`, {
        rids: rights
      })
      console.log(response)
      if (response.meta.status !== 200) {
        this.$message.error('分配权限失败！')
      } else {
        this.$message.success('分配权限成功！')
        this.rightsSettingDialogVisible = false
        this.getRoleList()
      }
    }
  }
}
</script>

<style lang="less" scoped>

.el-tag {
  margin: 7px
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}

.expandpadding {
  padding-left: 40px;
  padding-right: 40px;
}
</style>