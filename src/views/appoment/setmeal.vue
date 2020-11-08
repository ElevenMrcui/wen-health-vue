<template>
  <div>
    <div class="content-header">
                <h1>套餐管理<small>预约管理</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>预约管理</el-breadcrumb-item>
                    <el-breadcrumb-item>套餐管理</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="编码/名称/助记码" v-model="pagination.queryString" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"></el-input>
                        <el-button @click="findPageByCondition" class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="handleCreate">新建</el-button>
                        <el-button type="primary" class="butT" @click="reset">清空</el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="code" label="套餐编码" align="center"></el-table-column>
                        <el-table-column prop="name" label="套餐名称" align="center"></el-table-column>
                        <el-table-column label="适用性别" align="center">
                            <template slot-scope="scope">
                                <span>{{ scope.row.sex == '0' ? '不限' : scope.row.sex == '1' ? '男' : '女'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="age" label="适用年龄" align="center"></el-table-column>
                        <el-table-column prop="helpCode" label="助记码" align="center"></el-table-column>
                        <el-table-column prop="remark" label="说明" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini">编辑</el-button>
                                <el-button size="mini" type="danger">删除</el-button>
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
                        <el-dialog title="新增套餐" :visible.sync="dialogFormVisible">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="基本信息" name="first">
                                        <el-form label-position="right" label-width="100px" :model="formData" ref="addSetMealForm"  :rules="rules">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐编码" prop="code">
                                                        <el-input v-model="formData.code"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="套餐名称" prop="name">
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
                                                <el-col :span="12">
                                                    <el-form-item label="套餐价格">
                                                        <el-input v-model="formData.price"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="适用年龄" prop="age">
                                                        <el-input v-model.number="formData.age"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="上传图片">
                                                        <el-upload
                                                                class="avatar-uploader"
                                                                action="api/setMeal/upload"
                                                                :auto-upload="autoUpload"
                                                                name="imgFile"
                                                                :show-file-list="false"
                                                                :on-success="handleAvatarSuccess"
                                                                :before-upload="beforeAvatarUpload">
                                                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                                                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                        </el-upload>
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
                                    <el-tab-pane label="检查组信息" name="second">
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
														<input :id="c.id" v-model="checkgroupIds" type="checkbox" :value="c.id">
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
        return{
              autoUpload:true,//自动上传
                imageUrl:null,//模型数据，用于上传图片完成后图片预览
                activeName:'first',//添加/编辑窗口Tab标签名称
                pagination: {//分页相关属性
                    currentPage: 1,
                    pageSize:10,
                    total:100,
                    queryString:null,
                },
                dataList: [],//列表数据
                formData: {},//表单数据
                tableData:[],//添加表单窗口中检查组列表数据
                checkgroupIds:[],//添加表单窗口中检查组复选框对应id
                dialogFormVisible: false,//控制添加窗口显示/隐藏
                rules: {// 添加套餐的表格校验规则
                    code: [
                        { required: true, message: '套餐编码为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '套餐名称为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                    age: [
                        { required: true, message: '年龄必填项', trigger: 'blur' },
                        { type: 'number', min:1,message: '年龄必须为数字值' }
                    ]
                }
        }
    },
    //初始化数据
    created(){
        this.findPage()
    },
    //事件方法
    methods: {

        //提交数据
        handleAdd(ruleForm){        
            //校验表单数据
            this.$refs[ruleForm].validate((valid)=>{
                if(valid){
                     //校验检查组是否选择
                    if(this.checkgroupIds == 0){
                        this.$message.error("至少选择一个检查组")
                        this.activeName = "second"
                        return
                    };

                    this.formData.checkgroupIds =this.checkgroupIds
                    this.$http.post("api/setMeal/add",this.formData).then((res)=>{
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

        //实现图片回显
        handleAvatarSuccess(res) {
            this.imageUrl ="https://wen-health.oss-cn-shanghai.aliyuncs.com/" + res.data;
            this.formData.img = res.data;
        },
        
        //上传图片到服务器
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        },

        //弹出新建套餐窗口
        handleCreate(){
            this.dialogFormVisible = true;
            this.formData = {}
            this.checkgroupIds = []
            this.activeName = 'first'
            this.imageUrl = ''
            //查询所有检查组信息
            this.$http.get("api/checkGroup/findAll").then((res)=>{
                if(res.data.flag){
                    this.tableData = res.data.data
                }
            })
        },

        //分页查询
        findPage(){
            this.$http.post("api/setMeal/findPage", this.pagination).then((res) => {
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


    }
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
