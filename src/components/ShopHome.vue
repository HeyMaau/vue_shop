<template>
  <el-container class="home-container">
    <!--  头部区域  -->
    <el-header>
      <div>
        <img src="../assets/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!--   侧边区域   -->
      <el-aside :width="isCollapsed ? '64px' : '200px'">
        <!--    折叠按钮    -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
            :collapse-transition="false"
            :collapse="isCollapsed"
            unique-opened
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409eff">
          <!--    一级导航      -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!--     二级导航       -->
            <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span>{{ subItem.authName }}</span></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name: "ShopHome",
  created() {
    this.getMenuList()
  },
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapsed: false
    }
  },
  methods: {
    logout() {
      sessionStorage.clear()
      this.$router.push("/login")
    },
    async getMenuList() {
      const {data: response} = await this.$http.get('/menus')
      if (response.meta.status !== 200) {
        this.$message({
          message: response.meta.msg,
          type: "error"
        })
      } else {
        this.menuList = response.data
      }
    },
    toggleCollapse() {
      this.isCollapsed = !this.isCollapsed
    }
  }
}
</script>

<style lang="less" scoped>

.home-container {
  height: 100%;
}

.iconfont {
  margin-right: 10px;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  color: white;
  font-size: 20px;

  div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.toggle-button {
  background-color: #4a5064;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  line-height: 24px;
  font-size: 10px;
  cursor: pointer;
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: 0;
  }
}

.el-main {
  background-color: #eaedf1;
}

</style>