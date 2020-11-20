<template>
<div class="hold-transition">
  <div class="content-header">
                <h1>统计分析<small>会员数量</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>统计分析</el-breadcrumb-item>
                    <el-breadcrumb-item>会员数量</el-breadcrumb-item>
                </el-breadcrumb> <br><br>

   <el-form :inline="true" :model="formInline" class="demo-form-inline">
           
      <!-- <span class="demonstration">默认</span> -->
    <el-date-picker
      v-model="date.begin"
      type="date"
      placeholder="开始日期">
    </el-date-picker>
    
    <el-date-picker
      v-model="date.end"
      type="date"
      placeholder="结尾日期">
    </el-date-picker>
    <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
    </el-form-item> 
  </el-form>

   
        </div>

            <div class="app-container">
                <div class="box">
                    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
                    <div id="chart1" style="height:600px;"></div>
                </div>
            </div>      
</div>
</template>

<script>
export default {
    data() {
        return {
            date:{
                begin:'',
                end:''
            }
        }
    },
           
            methods: {
                onSubmit() {
                   this.$http.post('api/report/memberReportByLastYear',this.date).then((res)=>{
                     if(res.data.flag){
                      var myChart = this.$echarts.init(document.getElementById("chart1"));

                         myChart.setOption({
                             title:{
                                 text:'会员数量'
                             },
                             tooltip: {
                                 trigger: 'axis',
                                 formatter: res.data.data.memberCounts
                                 //数量
                                 //data:res.data.data.memberCount
                            },
                             xAxis: {
                                 type: 'category',
                                 data: res.data.data.monthList
                               //日期
                               //  data: res.data.data.monthList
                             },
                             yAxis: {
                                 type: 'value'
                             },
                             series: [{
                                //数量
                                 //data:res.data.data.memberCount
                                 data: res.data.data.memberCounts,
                                 name:'会员数量',
                                 type: 'line'
                             }]
                         });
                     }else{
                         this.$message.error=res.data.message
                     }

               })
                }    
            },
            created(){
                var dateTime = new Date();
                var lastYear = dateTime.getFullYear()-1;
                var month = dateTime.getMonth()+1;
                var date = dateTime.getDate()
                this.date.begin=lastYear+'-'+month+'-'+date
                this.date.end= dateTime
                this.onSubmit()
            },
};
</script>