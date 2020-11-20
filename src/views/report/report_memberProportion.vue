<template>
  <div class="hold-transition">
    <div class="content-header">
      <h1>
        统计分析
        <small>会员占比</small>
      </h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>统计分析</el-breadcrumb-item>
        <el-breadcrumb-item>会员占比</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <!-- <span   id="chart1" style="height:600px;"></span>
        <span   id="chart2" style="height:600px;"></span> -->

        <div id="chart1" style="height:600px;"></div>
        <div id="chart2" style="height:600px;"></div>
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
    //会员占比（按照年龄阶段进行查询）
this.$http.get("api/report/findMemberProportionByAge").then((resp)=>{
  if(resp.data.flag){
var myChart1 = this.$echarts.init(document.getElementById("chart1"));
    myChart1.setOption({
      title: {
        text: "会员年龄占比",
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
          name: "会员年龄占比",
          type: "pie",
          radius: "55%",
          center: ["50%", "40%"],
          data: resp.data.data,
          
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

  }
}
),


    //会员占比（按照性别进行查询）
this.$http.get("api/report/findMemberProportionBySex").then((resp)=>{
  if(resp.data.flag){
var myChart2 = this.$echarts.init(document.getElementById("chart2"));
    myChart2.setOption({
      title: {
        text: "会员性别占比",
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
          name: "会员性别占比",
          type: "pie",
          radius: "55%",
          center: ["50%", "40%"],

          data:resp.data.data,
          
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

  }
})

  },
};
</script>