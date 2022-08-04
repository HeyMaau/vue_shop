<template>
  <el-button type="info" @click="logout">退出</el-button>
</template>

<script>
export default {
  name: "ShopHome",
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push("/login")
    }
  }
}
</script>

<style scoped>

</style>