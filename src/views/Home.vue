<template>
  <div class="home-page">
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :default-openeds="defaultOpends"
        >
          <router-link to="/dashBoard">
            <el-menu-item index="dashBoard">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item></router-link
          >
          <!-- 动态路由 -->
          <side-menu
            v-for="item in menuRoutes"
            :key="item.name"
            :item="item"
          ></side-menu>
          <router-link to="/about">
            <el-menu-item index="about">
              <i class="el-icon-menu"></i>
              <span slot="title">关于</span>
            </el-menu-item></router-link
          >
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-container">
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <!-- <el-breadcrumb-item v-for="item in breadcrumb" :key=""></el-breadcrumb-item> -->
             
              <!-- <el-breadcrumb-item to="/dashBoard">首页</el-breadcrumb-item>
              <el-breadcrumb-item>权限管理</el-breadcrumb-item> -->
            </el-breadcrumb>
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link"
                >个人中心
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1">修改信息</el-dropdown-item>
                <el-dropdown-item command="2">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <el-main><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { loginOut } from "services/login";
import SideMenu from "components/SideMenu";
import utils from "utils/utils";
import { resetRouter } from "router";
export default {
  name: "home",
  data() {
    return {
      // menuRoutes: [],
      // defaultActive: "dashBoard",
      defaultOpends: [],
      breadcrumb:[],
    };
  },
  computed: {
    menuRoutes() {
      return this.$store.state.asyncRoutesResult;
    },
    defaultActive() {
      return this.$route.name;
    },
  },
  mounted() {
    // this.menuRoutes = JSON.parse(localStorage.getItem("menuRoutes"));
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "1":
          break;
        case "2":
          this.$confirm("是否退出登录?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              this.loginOut();
            })
            .catch(() => {});
          break;
        default:
          break;
      }
    },
    loginOut() {
      loginOut().then((res) => {
        if (res.code == this.$statusCode.SUCCESS) {
          localStorage.removeItem("loginInfo");
          localStorage.removeItem("menuRoutes");
          resetRouter();
          this.$router.replace({ path: "/login" });
        } else {
          utils.showMessage(this.$status.ERROR, res.message);
        }
      });
    },
  },
  components: {
    SideMenu,
  },
};
</script>
