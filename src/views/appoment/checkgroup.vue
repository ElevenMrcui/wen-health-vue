<template>
  <div>
        <div class="content-header">
                <h1>检查组管理<small>预约管理</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>预约管理</el-breadcrumb-item>
                    <el-breadcrumb-item>检查组管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="编码/名称/助记码" v-model="pagination.queryString" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"></el-input>
                        <el-button @click="findPageByCondition" class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="handleCreate()">新建</el-button>
                        <el-button type="primary" class="butT" @click="reset">重置</el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="code" label="检查组编码" align="center"></el-table-column>
                        <el-table-column prop="name" label="检查组名称" align="center"></el-table-column>
                        <el-table-column label="适用性别" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.sex == '0' ? '不限' : scope.row.sex == '1' ? '男' : '女'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="helpCode" label="助记码" align="center"></el-table-column>
                        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
                        <el-dialog title="新增检查组" :visible.sync="dialogFormVisible">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form :model="formData" ref="dataAddForm" label-position="right" label-width="100px" :rules="rules" >
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="编码" prop="code">
                                                        <el-input v-model="formData.code"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="名称" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="适用性别">
                                                        <el-select v-model="formData.sex">
                                                            <el-option label="不限" value="0"></el-option>
                                                            <el-option label="男" value="1"></el-option>
                                                            <el-option label="女" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="助记码">
                                                        <el-input v-model="formData.helpCode"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="说明">
                                                        <el-input v-model="formData.remark" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="注意事项">
                                                        <el-input v-model="formData.attention" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="检查项信息" name="second">
									<div class="checkScrol">
                                        <table class="datatable">
                                            <thead>
                                            <tr>
                                                <th>选择</th>
                                                <th>项目编码</th>
                                                <th>项目名称</th>
                                                <th>项目说明</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="c in tableData" v-bind:key="c">
                                                <td>
                                                    <input :id="c.id" v-model="checkitemIds" type="checkbox" :value="c.id">
                                                </td>
                                                <td><label :for="c.id">{{c.code}}</label></td>
                                                <td><label :for="c.id">{{c.name}}</label></td>
                                                <td><label :for="c.id">{{c.remark}}</label></td>
                                            </tr>
                                            </tbody>
                                        </table>
									</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取消</el-button>
                                <el-button type="primary" @click="handleAdd('dataAddForm')">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <!-- 编辑标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="编辑检查组" :visible.sync="dialogFormVisible4Edit">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form :model="formData" ref="dataEditForm" :rules="rules" label-position="right" label-width="100px">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="编码" prop="code">
                                                        <el-input v-model="formData.code"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="名称" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="适用性别">
                                                        <el-select v-model="formData.sex">
                                                            <el-option label="不限" value="0"></el-option>
                                                            <el-option label="男" value="1"></el-option>
                                                            <el-option label="女" value="2"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="助记码">
                                                        <el-input v-model="formData.helpCode"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="说明">
                                                        <el-input v-model="formData.remark" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="注意事项">
                                                        <el-input v-model="formData.attention" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="检查项信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
													<tr>
														<th>选择</th>
														<th>项目编码</th>
														<th>项目名称</th>
														<th>项目说明</th>
													</tr>
												</thead>
												<tbody>
													<tr v-for="c in tableData">
														<td>
															<input :id="c.id" v-model="checkitemIds" type="checkbox" :value="c.id">
														</td>
														<td><label :for="c.id">{{c.code}}</label></td>
														<td><label :for="c.id">{{c.name}}</label></td>
														<td><label :for="c.id">{{c.remark}}</label></td>
													</tr>
												</tbody>
											</table>
										</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible4Edit = false">取消</el-button>
                                <el-button type="primary" @click="handleEdit('dataEditForm')">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>
                </div>
            </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
                activeName:'first',//添加/编辑窗口Tab标签名称
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize:10,
                    total:100,
                    queryString:null,
                },
                dataList: [],//列表数据
                formData: {},//表单数据
                tableData:[],//新增和编辑表单中对应的检查项列表数据
                checkitemIds:[],//新增和编辑表单中检查项对应的复选框，基于双向绑定可以进行回显和数据提交
                dialogFormVisible: false,//控制添加窗口显示/隐藏
                dialogFormVisible4Edit:false,//控制编辑窗口显示/隐藏
                rules: {//校验规则
                    code: [
                        { required: true, message: '项目编码为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '项目名称为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ]
                }
    };
  },

    created() {    
        //初始化时查询所有检查组
        this.findPage()  
    },
    
    methods: {
        //检查组分页查询
        findPage(){
            this.$http.post("api/checkGroup/findPage", this.pagination).then((res) => {
                if (res.data.flag) {
                    this.dataList = res.data.data.rows;
                    this.pagination.total = res.data.data.total;
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        
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

        //重置查询条件
        reset(){
            this.pagination.queryString="";
            this.findPage()
        },

        //弹出新增检查组窗口并查询所有检查项信息
        handleCreate(){
            this.dialogFormVisible = true;
            //清空检查组信息
            this.formData = {};
            //清空检查项信息
            this.checkitemIds = [];
            //默认显示检查组窗口
            this.activeName = 'first'
            //查询所有检查项信息
            this.$http.get("api/checkitem/findAll").then((res)=>{
                if(res.data.flag){
                    this.tableData = res.data.data
                }
            })
        },

        //新增检查组信息
        handleAdd(ruleForm){        
            //校验表单数据
            this.$refs[ruleForm].validate((valid)=>{
                if(valid){
                     //校验检查项是否选择
                    if(this.checkitemIds == 0){
                        this.$message.error("至少选择一个检查项")
                        this.activeName = "second"
                        return
                    };

                    this.formData.checkitemIds =this.checkitemIds
                    this.$http.post("api/checkGroup/add",this.formData).then((res)=>{
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
            //回显检查组信息
            this.formData = row;
            //回显检查项信息
            this.$http.get("api/checkGroup/findAllCheckItemByGroupId/"+row.id).then((res)=>{
                if(res.data.flag){
                    this.tableData = res.data.data.checkItemList;
//                    alert(JSON.stringify(this.tableData))
                    this.checkitemIds = res.data.data.checkitemIds
//                    alert(JSON.stringify(this.checkitemIds))
                }else{
                    this.$message.error(res.data.message)
                }
            })
        },

        //提交修改后的检查组信息
        handleEdit(ruleForm){
            this.handleAdd(ruleForm)
        },

        //逻辑删除检查组信息
        handleDelete(row){
            //弹出确认删除提示框  
            this.$confirm('是否确认删除?', '提示', {  
                confirmButtonText: '确定',  
                cancelButtonText: '取消',  
                type: 'warning'  
            }).then(() => {  
                //发送请求删除检查项  
                this.$http.delete("api/checkGroup/delete/"+row.id).then((res)=>{  
                    if (res.data.flag){  
                        this.$message.success("删除成功")  
                         //判断当前页是否还有数据，没有跳转上一页
                        if(this.dataList.length === 1){
                            this.pagination.currentPage -= 1;
                        }
                        //重新查询分页数据  
                        this.findPage();  
                    } else{  
                        //提示错误信息  
                        this.$message.error(res.data.message)  
                    }
                })  
            }).catch(() => {  
                this.$message({  
                type: 'info',  
                message: '已取消删除'  
                });  
            });  
        }
    }
        

};
</script>

<style scoped>
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