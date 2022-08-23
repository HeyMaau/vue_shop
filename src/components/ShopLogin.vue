<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" show-password></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShopLogin",
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async validate => {
        if (!validate) {
          return
        }
        const {data: response} = await this.$http.post("login", this.loginForm)
        console.log(response)
        if (response.meta.status === 200) {
          this.$message({
            message: '登录成功',
            type: "success"
          })
          sessionStorage.setItem("token", response.data.token)
          this.$router.push('/home')
        } else {
          this.$message({
            message: '登录失败',
            type: "error"
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  background-color: white;
  width: 450px;
  height: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  border-radius: 5px;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    background-color: white;
    position: absolute;
    left: 50%;
    border: 1px solid #eee;
    box-shadow: 0 0 10px #ddd;
    border-radius: 50%;
    padding: 10px;
    transform: translate(-50%, -50%);

    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  padding: 0 20px;
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
}

.login_btns {
  display: flex;
  justify-content: flex-end;
}
</style>