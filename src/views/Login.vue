<template>
  <div class="login-page">
    <div class="login-form">
      <el-form
        label-width="80px"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button class="btn" type="primary" @click="submitForm('loginForm')"
            >提交</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import utils from "utils/utils";
import { login } from "services/login";
import md5 from "blueimp-md5";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.loginForm.password = md5(this.loginForm.password);
          login(JSON.stringify(this.loginForm)).then((res) => {
            if (res.code == this.$statusCode.SUCCESS) {
              const loginInfo = {};
              loginInfo.token = res.data.token;
              loginInfo.username = res.data.username;
              localStorage.setItem("loginInfo", JSON.stringify(loginInfo));
              this.$store.dispatch("getRoutes").then((res) => {
                if (res) {
                  this.$router.replace({ path: "/dashBoard" });
                }
              });
            } else {
              utils.showMessage(this.$status.ERROR, res.message);
            }
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
