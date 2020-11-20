<template>
  <div class="hold-transition skin-purple sidebar-mini">
    <el-container>
      <el-header class="main-header" style="height:70px;">
        <nav class="navbar navbar-static-top">
          <!-- Logo -->
          <a href="#" class="logo" style="text-align:center">
            <span class="logo-lg">
              <img src="../assets/img/logo.png" />
            </span>
          </a>
          <div class="right-menu">
            <span class="help">
              <i class="fa fa-exclamation-circle" aria-hidden="true"></i>帮助
            </span>
            <el-dropdown class="avatar-container right-menu-item" trigger="click">
              <div class="avatar-wrapper">
                <img src="../assets/img/user2-160x160.jpg" class="user-avatar" />
                  {{username}}
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item divided>
                  <span style="display:block;"@click="updateUserMessage" >修改密码</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <span style="display:block;">
                    <a @click="logout">退出</a>
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </nav>
      </el-header>
      <el-aside width="200px">
        <el-menu>
          <el-submenu v-for="menu in menuList" :index="menu.path" :key="menu.path">
            <template slot="title">
              <i class="fa" :class="menu.icon"></i>
              {{menu.name}}
            </template>
            <template v-for="child in menu.children">
              <el-menu-item :index="child.path" :key="child.path">
                <a @click="goMenu(child.linkUrl)" href="javascript:void(0);">{{child.name}}</a>
              </el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
          <template>
            <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
              <el-input v-model="username" width="15%" placeholder="用户名"></el-input>
               <el-input v-model="password" width="15%" placeholder="请输入密码"></el-input>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
          </template> 
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
//import mList from "./menu.json";
export default {
    data(){
        return{
            menuList:[],
            username:'',
            dialogVisible:false
        }
    },
    methods:{
        //修改用户信息
        updateUserMessage(){
          this.dialogVisible = true
          this.username = window.sessionStorage.getItem("username")
        },

         //  用户退出功能
        logout(){
         window.sessionStorage.removeItem("username")
         window.sessionStorage.removeItem("token")
         this.$router.replace({ name: "/login" });
        },

        goMenu:function(_name){
          if(_name != this.$router.currentRoute.name)
            this.$router.replace({ name: _name });
          else if(!_name)
            this.$message.warning("暂未开通该功能");
        },
    },
    created(){
        //this.menuList = mList;
        this.username = window.sessionStorage.getItem("username")
        this.$http.get("api/menu/findMenuByUsername/"+this.username).then((res)=>{
           if (res.data.flag) {
             this.menuList=res.data.data
             console.log(this.menuList);
           } 
        })
    }
}
</script>
<style lang="scss">
@import "../assets/css/style.css";
</style>
<style type="text/css" scoped>
.el-main {
  position: absolute;
  top: 70px;
  bottom: 0px;
  left: 200px;
  right: 10px;
  padding: 0;
}
</style>