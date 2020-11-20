<template>
  <div>
        <div class="content-header">
                <h1>角色管理<small>角色详情</small></h1>
                <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>角色管理</el-breadcrumb-item>
                    <el-breadcrumb-item>角色详情</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="app-container">
                <div class="box">
                    <div class="filter-container">
                        <el-input placeholder="角色名" v-model="pagination.queryString" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"></el-input>
                        <el-button @click="findPageByCondition" class="dalfBut">查询</el-button>
                        <el-button type="primary" class="butT" @click="handleCreate('dataAddForm')">新建</el-button>
                        <el-button type="primary" class="butT" @click="reset">清空</el-button>
                    </div>
                    <el-table size="small" current-row-key="id" :data="dataList" stripe highlight-current-row>
                        <el-table-column type="index" align="center" label="序号"></el-table-column>
                        <el-table-column prop="name" label="角色名" align="center"></el-table-column>
                        <el-table-column prop="keyword" label="角色关键字" align="center"></el-table-column>
                        <el-table-column prop="description" label="角色说明" align="center"></el-table-column>
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
                        <el-dialog title="新增角色" :visible.sync="dialogFormVisible" @close="closeBox('dataAddForm')">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="角色信息" name="first"> 
                                        <el-form :model="formData" ref="dataAddForm" label-position="right" label-width="100px" :rules="rules" >
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="角色名" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="角色关键字" prop="keyword">
                                                        <el-input v-model="formData.keyword"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="角色说明">
                                                        <el-input v-model="formData.description" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="权限信息" name="second">
									<div class="checkScrol">
                                        <table class="datatable">
                                            <thead>
                                            <tr>
                                                <th>选择</th>
                                                <th>权限名</th>
                                                <th>权限关键字</th>
                                                <th>权限说明</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="c in tablePermissionsData" v-bind:key="c">
                                                <td>
                                                    <input :id="c.id" v-model="permissions" type="checkbox" :value="c.id">
                                                </td>
                                                <td><label :for="c.id">{{c.name}}</label></td>
                                                <td><label :for="c.id">{{c.keyword}}</label></td>
                                                <td><label :for="c.id">{{c.description}}</label></td>
                                            </tr>
                                            </tbody>
                                          
                                        </table>
									</div>
                                    </el-tab-pane>
                                    <el-tab-pane label="菜单信息" name="third">
									<div class="checkScrol">
                                        <table class="datatable">
                                            <thead>
                                            <tr>
                                                <th>选择</th>
                                                <th>菜单名</th>
                                                <th>菜单路径</th>
                                                <th>菜单说明</th>
                                            </tr>
                                            </thead>
                                        
                                              <tbody>
                                              <tr v-for="c in tableMenusData" v-bind:key="c">
                                                <td>
                                                    <input :id="c.id" v-model="menus" type="checkbox" :value="c.id">
                                                </td>
                                                <td><label :for="c.id">{{c.name}}</label></td>
                                                <td><label :for="c.id">{{c.path}}</label></td>
                                                <td><label :for="c.id">{{c.description}}</label></td>
                                            </tr>
                                            </tbody>
                                        </table>
									</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="handleEdit('dataAddForm')">取消</el-button>
                                <el-button type="primary" @click="handleAdd('dataAddForm')">确定</el-button>
                            </div>
                        </el-dialog>
                    </div>

                    <!-- 编辑标签弹层 -->
                    <div class="add-form">
                        <el-dialog title="编辑角色信息" :visible.sync="dialogFormVisible4Edit" @close="handleEdit('dataEditForm')">
                            <template>
                                <el-tabs v-model="activeName" type="card">
                                    <el-tab-pane label="角色信息" name="first">
                                        <el-form :model="formData" ref="dataEditForm" :rules="rules" label-position="right" label-width="100px">
                                            <el-row>
                                                <el-col :span="12">
                                                    <el-form-item label="角色名" prop="name">
                                                        <el-input v-model="formData.name"/>
                                                    </el-form-item>
                                                </el-col>
                                                <el-col :span="12">
                                                    <el-form-item label="角色关键字" prop="keyword">
                                                        <el-input v-model="formData.keyword"/>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                            <el-row>
                                                <el-col :span="24">
                                                    <el-form-item label="角色说明">
                                                        <el-input v-model="formData.description" type="textarea"></el-input>
                                                    </el-form-item>
                                                </el-col>
                                            </el-row>
                                        </el-form>
                                    </el-tab-pane>
                                    <el-tab-pane label="权限信息" name="second">
										<div class="checkScrol">
											<table class="datatable">
												<thead>
													<tr>
														<th>选择</th>
                                                        <th>权限名</th>
                                                        <th>权限关键字</th>
                                                        <th>权限说明</th>
													</tr>
												</thead>
                                                <tbody>
                                                  <tr v-for="c in tablePermissionsData" v-bind:key="c">
                                                <td>
                                                    <input :id="c.id" v-model="permissions" type="checkbox" :value="c.id">
                                                </td>
                                                <td><label :for="c.id">{{c.name}}</label></td>
                                                <td><label :for="c.id">{{c.keyword}}</label></td>
                                                <td><label :for="c.id">{{c.description}}</label></td>
                                                 </tr>
                                                </tbody>											
										    </table>
										</div>
                                    </el-tab-pane>
                                     <el-tab-pane label="菜单信息" name="third">
										<div class="checkScrol">
											<table class="datatable">
												
												<tbody>
													<tr v-for="c in tableMenusData">
														<td>
															<input :id="c.id" v-model="menus" type="checkbox" :value="c.id">
														</td>
														<td><label :for="c.id">{{c.name}}</label></td>
														<td><label :for="c.id">{{c.path}}</label></td>
														<td><label :for="c.id">{{c.description}}</label></td>
													</tr>
												</tbody>
											</table>
										</div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="handleEdit('dataEditForm')">取消</el-button>
                                <el-button type="primary" @click="handleAdd('dataEditForm')">确定</el-button>
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
                    pageSize:4,
                    total:100,
                    queryString:null,
                },
                dataList: [],//列表数据M
                formData: {},//表单数据
                tablePermissionsData:[],//新增和编辑表单中对应的权限列表数据
                tableMenusData:[],//新增和编辑表单中对应的菜单列表数据
                permissions:[],//新增和编辑表单中检查项对应的复选框，基于双向绑定可以进行回显和数据提交
                menus:[],//新增和编辑表单中对应的菜单选择项
                dialogFormVisible: false,//控制添加窗口显示/隐藏
                dialogFormVisible4Edit:false,//控制编辑窗口显示/隐藏
                rules: {//校验规则
                    name: [
                        { required: true, message: '角色名为必填项', trigger: 'blur' },
                        { min: 2, max: 10, message: '长度在 2 到 10个字符', trigger: 'blur' }
                    ],
                    keyword: [
                        { required: true, message: '角色关键字为必填项', trigger: 'blur' },
                        { min: 2, max: 50, message: '长度在 2 到 50个字符', trigger: 'blur' }
                    ]
                }
    };
  },

  created() {    
            this.findPage()
                
            },
            methods: {


                closeBox(data){
                    handleEdit(data)
                },

                //逻辑删除  
                handleDelete(row){
                    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$http.delete("api/role/deleteRoleById/"+row.id).then((res)=>{
                                if(res.data.flag){
                                    this.findPage() // 再次查询展示出页面数据
                                    this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                                }else{
                                    this.$message.error(res.data.message)
                                }
                            })
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                        });
                },



                 // 点击编辑,弹出表单,数据回显到表单上
                handleUpdate(row){
                
                    this.dialogFormVisible4Edit = true  //要先将编辑的表单展示出来
                    let jsonString = JSON.stringify(row)
                    let jsonObj = JSON.parse(jsonString)     //json之间直接传递会相互影响,在编辑的表单中做修改,页面上的数据会跟着动,所以这里先转成字符串再转回json就解除关系了
                    this.formData = jsonObj  //解决数据回显的问题
                    this.activeName = 'first'
                                                        //注意这样传递参数时候后面要带斜杠  /  注意
                    this.$http.get("api/role/findPermissionInfoByRoleId/"+row.id).then((res)=>{
                        if(res.data.flag){
                        this.permissions =res.data.data.permissions
                       // alert(this.permissions)
                        this.tablePermissionsData = res.data.data.permissionList
                        }else{
                            // alert(AAAAAAAAAAAAAAAAAA)
                            this.$message.error(res.data.message)
                    }

                    this.$http.get("api/role/findMenuInfoByRoleId/"+row.id).then((res)=>{
                        if(res.data.flag){
                            this.menus=res.data.data.menus
                            this.tableMenusData = res.data.data.menuList
                        }else{
                            this.$message.error(res.data.$message)
                        }
                    })

                    } )


                },

                // 提交表单
                // handleEdit(ruleForm){  
                //     //这里直接调用新增的方法,后台会根据传过去的表单有没有携带id ,来判断执行add还是update
                //     this.handleAdd(ruleForm)   //ruleForm : 当前表单的校验,谁调用这个方法就执行谁的校验
                // },
                //关闭弹窗的方法
                handleEdit(data){
                    this.$refs[data].resetFields()
                    this.dialogFormVisible4Edit=false
                },



                // 无条件分页查询/有条件分页查询 
                findPageByCondition(){
                    this.pagination.currentPage = 1; //当有条件查询的时候提前把这里置为1,防止查询出来的数据 页总数小于当前的页码 造成查询不到的问题
                    this.findPage()
                },
                // 页码变化时触发分页查询  ,, 触发时回自动传递一个参数过来,这里命名为pageNum(任意)
                handleCurrentChange(pageNum){
                    this.pagination.currentPage = pageNum
                    this.findPage()
                },
                //分页查询
                findPage(){                                 //这里的pagination里面的queryString时双向绑定的,从查询的输入框中获取的
                    this.$http.post("api/role/findPage",this.pagination).then((res)=>{
                        //res.data = Result  ,,  res.data.data = result.data = PageResult(total,rows)
                        if(res.data.flag){
                            this.dataList = res.data.data.rows
                            this.pagination.total=res.data.data.total
                        }else{
                             this.$message.error(res.data.message)
                        } 
                    })
                },



                // 提交新建表单
                handleAdd(ruleForm){  // 编辑和新建都是这个方法,谁调用这个方法ruleForm就是谁的表检ref值 true/false
                    // this.$refs[ruleForm].resetFields();
                    this.$refs[ruleForm].validate((valid)=>{   

                        if(valid){
                            if(this.permissions.length == 0){
                                this.activeName = 'second'    //如果检查项一条都没勾选,则提示错误并跳转到检查项的标签页中
                                 this.$message.error("至少赋予一项权限")
                                 return
                            }
                            this.formData.permissions = this.permissions//这里可以直接给formData增加一个字段,因为formData在上面没有定义具体的字段,后台有相对应的字段接收就行
                            this.formData.menus=this.menus
                           // alert(this.permissions)
                           this.$http.post('api/role/add',this.formData).then((res)=>{
                                if(res.data.flag){
                                    
                                    this.dialogFormVisible = false      //关闭新建的窗口
                                 //  this.$refs[ruleForm].resetFields();
                                    this.dialogFormVisible4Edit = false  //关闭编辑的窗口
                                    
                                    this.findPage()
                                    this.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                                }else{
                                   
                                     this.$message.error(res.data.message)
                                }
                            })
                        }else{
                              this.activeName = 'first' 
                            this.$message.error("请补全信息")
                        }
                    }
                    )
                    //  this.$refs[ruleForm].resetFields();
                },


                //新建弹出表单
               handleCreate(){
                   this.dialogFormVisible = true
                   this.activeName = 'first'
                   this.permissions = []
                   this.formData = {}
                   // 弹出表单之后立刻查询所有的权限信息
                   this.$http.get('api/permission/findAll').then((res)=>{
                       if(res.data.flag){
                           this.tablePermissionsData = res.data.data

                       }
                   })
                    this.$http.get('api/menu/findAll').then((res)=>{
                       if(res.data.flag){
                           this.tableMenusData = res.data.data

                       }
                   })
               },
               //重置
            reset(){
                this.pagination.queryString="";
                this.findPage()
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