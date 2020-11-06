<template>
  <div>
    <div class="content-header">
      <h1>检查项历史数据<small>恢复数据</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>恢复数据</el-breadcrumb-item>
        <el-breadcrumb-item>检查项历史数据</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="app-container">
    <div class="box">
    <div class="filter-container">

    <div>
        
        <el-table ref="table" size="small" current-row-key="id"  tooltip-effect="dark" @selection-change="handleSelectionChange"  :data="dataList" stripe highlight-current-row>
            
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column type="index" align="center" label="序号"></el-table-column>
          
            <el-table-column prop="code" label="项目编码" align="center" ></el-table-column>

            <el-table-column prop="name" label="项目名称" align="center"></el-table-column>  

            <el-table-column label="适用性别" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.sex == "0" ? "不限" : scope.row.sex == "1" ? "男" : "女" }}</span>
                </template>
            </el-table-column> 

            <el-table-column prop="age" label="适用年龄" align="center"></el-table-column>
          
            <el-table-column prop="remark" label="项目说明" align="center" ></el-table-column>

            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="recovery(scope.row)" >恢复</el-button >
                </template>
            </el-table-column>
        </el-table>
    </div>


    <div class="pagination-container">
        <div style="margin-top: 20px" >
            <el-button type="primary" @click="restoreAll">恢复选中数据</el-button>
            <el-button type="primary" @click="toggleSelection">取消选择</el-button>
        </div>

      <el-pagination
        class="pagiantion"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    </div>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    
        pagination: {
            //分页相关模型数据
            currentPage: 1, //当前页码
            pageSize: 5, //每页显示的记录数
            total: 0, //总记录数
            queryString: null, //查询条件   双向绑定
        },
        dataList: [], //当前页要展示的分页列表数据  [{},{}]  List<T>
        formData: {}, //表单数据  添加检查项  formData提交给后台
        multipleSelection: []
    };
  },

  //钩子函数，VUE对象初始化完成后自动执行
  created() {
    this.findPage();
  },

  methods: {

      //点击按钮恢复选中数据
      restoreAll(){
        //alert(JSON.stringify(this.multipleSelection))
        this.$http.post("api/checkitem/restoreAll",this.multipleSelection).then((res)=>{
            if(res.data.flag){
                this.$message.success("已恢复所有数据")
                this.pagination.currentPage = 1;
                this.findPage()
            }else{
                this.$message.error(res.data.message)
            }
        })
      },

      //点击取消按钮时取消所有选中
      toggleSelection() {
          this.$refs.table.clearSelection(); 
      },

      //点击复选框是multipleSelection数组元素+1   
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

    // 分页查询
    findPage() {
      //  第一次分页查询
      this.$http.post("api/checkitem/findDeletedPage", this.pagination).then((res) => {
        if (res.data.flag) {
          this.dataList = res.data.data.rows;
          this.pagination.total = res.data.data.total;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

     //点击页码进行分页查询
    handleCurrentChange(curpage) {
      this.pagination.currentPage = curpage;
      this.findPage();
    },

    //恢复数据
    recovery(row){
        //alert(JSON.stringify(row))
        this.$http.get("api/checkitem/recovery/"+row.id).then((res) => {
            if(res.data.flag){
                this.$message.success("恢复成功")
                this.pagination.currentPage = 1;
                this.findPage()
            }else{
                this.$message.error(res.data.message)
            }
        })
    }
  }
};
</script>