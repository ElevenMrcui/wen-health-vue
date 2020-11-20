<template>
  <div class="hold-transition">
    <div class="content-header">
      <h1>
        统计分析
        <small>套餐占比</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计分析</el-breadcrumb-item>
        <el-breadcrumb-item>套餐占比</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div id="chart1" style="height:600px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted: function () {
    this.$http.get("api/report/setmealProportion").then((resp)=>{
      if(resp.data.flag){
    var myChart1 = this.$echarts.init(document.getElementById("chart1"));
      myChart1.setOption({
      title: {
        text: "套餐预约占比",
        subtext: "",
        x: "center",
      },
      tooltip: {
        //提示框组件
        trigger: "item", //触发类型，在饼形图中为item
        formatter: "{a} <br/>{b} : {c} ({d}%)", //提示内容格式
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: "套餐预约占比",
          type: "pie",
          radius: "55%",
          center: ["50%", "60%"],
          data: resp.data.data ,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    });

      }else{
        this.$message.error(resp.data.message)
      }
    })
  
    
  },
};
</script>