<template>
  <el-row>
    <el-col :span="6" :offset="9">
      <el-card class="box-card"
               shadow="never"
               style="border: none;">
        <img src="../assets/logo.png" class="logo-img" alt="logo"/><br>
        <p class="logo-family">欢迎登录管理员系统</p><br>
        <el-form :model="loginForm"
                 status-icon
                 :rules="rules"
                 ref="loginForm"
                 class="demo-ruleForm">
          <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" autocomplete="off" prefix-icon="el-icon-user">
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off" prefix-icon="el-icon-lock">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary"
                       :style="{ width: '100%'}"
                       @click="submitForm('loginForm')">登 录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

export default {
  name: "Login",
  data() {
    const validateUsercode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    return {
      show: true,
      loginForm: {
        account: 'admin',
        password: '123',
      },
      rules: {
        account: [
          {validator: validateUsercode, trigger: 'blur'}
        ],
        password: [
          {validator: validatePassword, trigger: 'blur'}
        ],
      }
    };
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    submitForm(formName) {
    // submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/user/login', {
            account: this.loginForm.account,
            password: this.loginForm.password,
          }).then((response) => {
            console.log(response.data)
            localStorage.setItem("token", response.data.data.token)
            this.$store.commit('SET_TOKEN', response.data.data.token)
            console.log(response.data.data.token)
            this.$router.push('/home');
          }).catch((error) => { console.log(error); })
        }
      });
      // this.getCaptcha();
      // this.$router.push('/home');
    },
  }
}
</script>

<style scoped>
.logo-img {
  width: 80px;
  height: 80px;
}

.box-card {
  margin-top: 150px;
  text-align: center;
}

.logo-family {
  font-size: 16px;
  color: #409eff;
  font-weight: bold;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}
</style>