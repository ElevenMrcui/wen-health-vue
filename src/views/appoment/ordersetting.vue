<template>
  <div>
    <div class="content-header">
      <h1>
        预约设置
        <small>预约管理</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>预约管理</el-breadcrumb-item>
        <el-breadcrumb-item>预约设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="ordersetting">
          <el-card class="box-card">
            <div class="boxMain">
              <el-button style="margin-bottom: 20px;margin-right: 20px" type="primary" @click="downloadTemplate">模板下载</el-button>
              <el-upload
                action="api/orderSetting/importOrderSettings"
                name="excelFile"
                :before-upload="beforeAvatarUpload"
                :on-success="handleSuccess"
                :show-file-list="false"
              >
                <el-button type="primary">上传文件</el-button>
              </el-upload>
            </div>
            <div>
              操作说明：请点击"模板下载"按钮获取模板文件，在模板文件中录入预约设置数据<br>
              <span style="color: red">日期格式为：yyyy/MM/dd</span><br>
              点击"上传文件"按钮上传模板文件。
            </div>
          </el-card>

          <el-calendar v-model="curday">
            <template
              slot="dateCell"
              slot-scope="{date, data}">
              <div v-if="settingData[data.day]">
                <div v-if="settingData[data.day].number == settingData[data.day].reservations" 
                  style="background-color:red;height:85px;">
                 <div><font color='blue'>{{data.day}}</font></div>
                  <div>{{settingData[data.day].reservations}}/{{settingData[data.day].number}}</div>
                  <div>已满</div>
                </div>

                <div v-else style="background-color:lightblue;height:85px;">
                  <div><font color='blue'>{{data.day}}</font></div>
                  <div>{{settingData[data.day].reservations}}/{{settingData[data.day].number}}</div>
                  <div><button
                   @click="goSetting(data.day)"><i class="el-icon-setting"></i>设置</button></div>
                </div>
              </div>

              <div v-else>
                <div v-if="data.type == 'current-month'" style="padding-top:25px;">
                    <font color='blue'>{{data.day}}</font>
                    <button @click="goSetting(data.day)"><i class="el-icon-setting"></i>设置</button>
                </div>
                <div v-else style="background-color:rgb(192,196,204);height:85px;width100%;">
                </div>
              </div>

            </template>
          </el-calendar>
        </div>
      </div>
    </div>

     <el-dialog title="预约设置" :visible.sync="settingDialog" width="30%" top="15%">
       <div>日期:{{settingDay}}</div>
       <el-input v-model="number" placeholder="输入预约总人数"></el-input>
       <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdate">确定</el-button>
      </div>
     </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      curday: new Date(),
      settingData:{},
      settingDay:'',
      settingDialog:false,
      number:'',
    };
  },
  methods:{	

    //下载文件
    downloadTemplate(){
      //a标签属性的target ： _blank(打开新窗口), _parent(本窗口打开), _self(覆盖本窗口) 
      window.open('api/template/ordersetting_template.xlsx','_parent');
    },

    //上传文件
    beforeAvatarUpload(file){
      //判断文件上传类型
      const isXlsx = file.type ===  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if(!isXlsx){
        this.$message.error('请上传xlsx文件');
      }
      return isXlsx;
    },

    //文件上传成功
    handleSuccess(res,file){
      if(res.flag){
        this.$message.success("文件上传成功");
      }else{
        this.$message.error(res.message)
      }
    },

    //查询预约数据
    findSettingDate(year,month){
        this.$http.get("api/orderSetting/findSettingData/"+year+"/"+month).then((res)=>{
          if(res.data.flag){
            this.settingData = res.data.data
          }else{
            this.$message.error(res.data.message)
          }
        })
    },

    //设置弹窗
    goSetting(day){
      this.settingDay = day;
      this.settingDialog = true
    },

    //
    loadData(){
      this.findSettingDate(this.curday.getFullYear(),this.curday.getMonth()+1);
    },

    //
    handleUpdate(){
      //定义检查输入数据的正则表达式
      let reg = /^[0-9]*[1-9][0-9]*$/
      let flag = reg.test(this.number);
      if(flag){
        //判断输入的数据是否大于已预约数
        if(this.number > this.settingData[this.settingDay].reservations){
            this.$http.put("api/orderSetting/updateNumberByOrderDate/"+this.number+"/"+this.settingDay).then((res)=>{
                if(res.data.flag){

                  this.settingData[this.settingDay].number = this.number
                  this.settingDialog = false
                }else{
                  this.$message.error(res.data.message)
                }
            })
        }else{
          this.$message.error("当前预约总数小于已预约数")
      }
      }else{
        this.$message.error("请输入正整数！")
      }
    }
  },

  watch:{
    //监听日期改变事件
    curday(newDate,oldDate){
      if(oldDate.getMonth() != newDate.getMonth()){
        this.loadData();
      }
    }
  },

  created(){
    // this.settingData = {
    //   "2020-09-01":{number:200,reservations:200},
    //   "2020-09-02":{number:200,reservations:200},
    //   "2020-09-05":{number:200,reservations:100},
    //   "2020-09-15":{number:200,reservations:50},
    //   "2020-09-28":{number:100,reservations:90}
    // }
    this.findSettingDate(this.curday.getFullYear(),this.curday.getMonth()+1);
    }
  };
</script>

<style scoped>
.el-calendar-table .el-calendar-day{
  padding: 0;
}
</style>
