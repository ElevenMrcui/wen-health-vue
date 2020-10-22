<template>
  <div class="login-container">
    <div class="loginBox">
      <el-form ref="loginForm" :rules="rules" :model="userInfo" class="login-form">
        <el-form-item label="账号:" prop="username">
          <el-input v-model="userInfo.username" placeholder="请输入账号...">
          </el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="userInfo.password" placeholder="请输入密码..." show-password>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="login">登入</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data(){
    return{
      userInfo:{
        username:'',
        password:''
      },
      rules:{
        username:[
            { required: true, message: '请输入账号'},
          ],
        password:[
            { required: true, message: '请输入密码'},
          ],
      }
    }
  },
  methods:{
    login:function(){
      //跳转到主页
      this.$router.replace({ name: "index" });

      // this.$refs.loginForm.validate((valid) =>{
      //   if(valid){
      //     this.$http.post('api/login',this.userInfo).then(res =>{
      //       console.info(res.data.message)
      //       if(res.data.flag){
      //         // 用户认证成功 将用户信息和token存储起来
      //         window.sessionStorage.setItem("token",res.data.message)
      //         window.sessionStorage.setItem("username",this.userInfo.username)
      //         //跳转到主页
      //         this.$router.replace({ name: "index" });
      //       }else{
      //         this.$message.error(res.data.message);
      //       }
      //     });
          
      //   }
      // });
    },
  }
};
</script>
<style lang="scss">
@import "../assets/css/login.css";
</style>