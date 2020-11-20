<template>
  <div>
    <div class="content-header">
                <h1>用户列表<small>用户管理</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
                    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="名称" v-model="pagination.queryString" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"></el-input>
                        <el-button @click="findPageByCondition" class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="handleCreate">新建</el-button>
                        <el-button type="primary" class="butT" @click="reset">清空</el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                        <el-table-column prop="birthday" label="生日" align="center"></el-table-column>
                        <el-table-column label="适用性别" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.gender == '0' ? '男' : scope.row.gender == '1' ? '女' : '不限'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="telephone" label="联系方式" align="center"></el-table-column>
                        <el-table-column prop="station" label="状态" align="center"></el-table-column>
                        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger"  @click="handleDelete(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination-container">
                        <el-pagination
                            class="pagiantion"
                            @current-change="handleCurrentChange"
                            :current-page="pagination.currentPage"
                            :page-size="pagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="pagination.total">
                        </el-pagination>
                    </div>

                    <!-- 新增标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="新增用户" :visible.sync="dialogFormVisible">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form label-position="right" label-width="100px" :model="formData" ref="addSetMealForm"  :rules="rules">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="用户名" prop="username" >
                                                        <el-input v-model="formData.username"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="用户密码" prop="password">
                                                        <el-input v-model="formData.password"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="适用性别">
                                                        <el-select v-model="formData.gender">
                                                            <el-option label="不限" value="0"></el-option>
                                                            <el-option label="男" value="1"></el-option>
                                                            <el-option label="女" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="生日">
                                                        <el-input v-model="formData.birthday"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="联系方式">
                                                        <el-input v-model="formData.telephone"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="备注" >
                                                        <el-input v-model="formData.remark"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="状态">
                                                        <el-input v-model="formData.station" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="角色信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
												<tr>
													<th>选择</th>
													<th>角色名称</th>
													<th>角色说明</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="c in tableData">
													<td>
														<input :id="c.id" v-model="roleIds" type="checkbox" :value="c.id">
													</td>
													<td><label :for="c.id">{{c.name}}</label></td>
													<td><label :for="c.id">{{c.keyword}}</label></td>
													<td><label :for="c.id">{{c.description}}</label></td>                                                    
												</tr>
												</tbody>
											</table>
										</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="handleAdd('addSetMealForm')">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <!-- 修改标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="修改用户" :visible.sync="dialogFormVisible4Edit">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form label-position="right" label-width="100px" :model="formData" ref="addSetMealForm"  :rules="rules">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="用户名" prop="username" >
                                                        <el-input v-model="formData.username"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="适用性别">
                                                        <el-select v-model="formData.gender">
                                                            <el-option label="不限" value="0"></el-option>
                                                            <el-option label="男" value="1"></el-option>
                                                            <el-option label="女" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="生日">
                                                        <el-input v-model="formData.birthday"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="联系方式">
                                                        <el-input v-model="formData.telephone"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="备注" >
                                                        <el-input v-model="formData.remark"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="状态">
                                                        <el-input v-model="formData.station" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="角色信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
												<tr>
													<th>选择</th>
													<th>角色名称</th>
													<th>角色说明</th>
												</tr>
												</thead>
												<tbody>
												<tr v-for="c in tableData">
													<td>
														<input :id="c.id" v-model="roleIds" type="checkbox" :value="c.id">
													</td>
													<td><label :for="c.id">{{c.name}}</label></td>
													<td><label :for="c.id">{{c.keyword}}</label></td>
													<td><label :for="c.id">{{c.description}}</label></td>                                                    
												</tr>
												</tbody>
											</table>
										</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="handleAdd('addSetMealForm')">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </div>
            </div>
  </div>
</template>

<script>
export default {
    data(){
        var checkUsername =(rule, value, callback) => {
           
            this.$http.get("api/user/findAll/"+value).then((res)=>{
                if(res.data.data){ 
                        callback(new Error('用户名重复') );
                }else{
                    callback();}
            })
        
      };

        return{
              autoUpload:true,//自动上传
                imageUrl:null,//模型数据，用于上传图片完成后图片预览
                activeName:'first',//添加/编辑窗口Tab标签名称
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize:10,
                    total:null,
                    queryString:null,
                },
                dataList: [],//列表数据
                formData: {},//表单数据
                tableData:[],//添加表单窗口中检查组列表数据
                roleIds:[],//添加表单窗口中检查组复选框对应id
                dialogFormVisible: false,//控制添加窗口显示/隐藏
                dialogFormVisible4Edit:false,//控制编辑窗口显示/隐藏
                rules: {// 添加用户的表格校验规则
                    password: [
                        { required: true, message: '用户密码必填', trigger: 'blur' },
                     { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                 username: [
                        { required: true, message: '用户姓名必填', trigger: 'blur' },
                        { min: 2, max: 50, message: '长度在 2 到 50个字符', trigger: 'blur' },
                        { validator: checkUsername , trigger: 'blur' }
                    ],
                    age: [
                        { required: true, message: '年龄必填项', trigger: 'blur' },
                        { type: 'number', min:1,message: '年龄必须为数字值' }
                    ]
                }
        }
    },
    //初始化分页数据
    created(){
        this.findPage()
    },

    //事件方法
    methods: {
       
          //页码改变事件
        handleCurrentChange(curPage){
            this.pagination.currentPage = curPage;
            this.findPage()
        },
        //条件查询
        findPageByCondition(){
            this.pagination.currentPage = 1
            this.findPage()
        },
          findPage() {
      //  第一次分页查询
      this.$http.post("api/user/findPage", this.pagination).then((res) => {
        if (res.data.flag) {
          this.dataList = res.data.data.rows;
          this.pagination.total = res.data.data.total;
        } else {
          this.$message.error(res.data.message);
        }
          });
     },
        handleCreate(){
             this.dialogFormVisible = true;
            //清空检查组信息
            this.formData = {};
            //清空检查项信息
            this.checkitemIds = [];
            //默认显示检查组窗口
            this.activeName = 'first'
            //查询所有检查项信息
            this.$http.get("api/role/findAll").then((res)=>{
                if(res.data.flag){
                    this.tableData = res.data.data
                }
            })
        },
        //重置查询条件
        reset(){
            this.pagination.queryString="";
            this.findPage()
        },
        
        //新增检查组信息
        handleAdd(ruleForm){           
            //校验表单数据
            this.$refs[ruleForm].validate((valid)=>{               
                if(valid){
                     //校验检查项是否选择
                    if(this.roleIds == 0){
                        this.$message.error("至少选择一个角色")
                        this.activeName = "second"
                        return
                    };
                    this.formData.roleIds =this.roleIds
                    this.$http.post("api/user/add",this.formData).then((res)=>{
                        if(res.data.flag){
                            //关闭窗口
                            this.dialogFormVisible = false;
                            this.dialogFormVisible4Edit =false;
                            //回到首页
                            this.findPage()
                        }else{
                            this.$message.error(res.data.message)
                        }
                    })
                }
            })
        },

         //弹出编辑窗口，并回显所有数据
        handleUpdate(row){
            //显示窗口
            this.dialogFormVisible4Edit = true;
            //回显用户信息
            this.formData = row;
            //回显角色信息
            //查询所有检查项信息
            this.$http.get("api/role/findAll").then((res)=>{
                if(res.data.flag){
                    this.tableData = res.data.data
                }
            })
        },

        //提交修改后的检查组信息
        handleEdit(ruleForm){
            this.handleAdd(ruleForm)
        },

    },
    
}
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.datatable {
  position: relative;
  box-sizing: border-box;
  -webkit-box-flex: 1;
  width: 100%;
  max-width: 100%;
  font-size: 14px;
  color: rgb(96, 98, 102);
  overflow: hidden;
  flex: 1 1 0%;
}
.datatable td,
.datatable th {
  padding: 12px 0;
  min-width: 0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  text-align: left;
}
</style>
