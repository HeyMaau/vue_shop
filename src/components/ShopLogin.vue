<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png">
      </div>
      <el-form class="login_form">
        <el-form-item>
          <el-input prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input prefix-icon="iconfont icon-3702mima"></el-input>
        </el-form-item>
        <el-form-item class="login_btns">
          <el-button type="primary">登录</el-button>
          <el-button type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ShopLogin"
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
  justify-content: end;
}
</style>