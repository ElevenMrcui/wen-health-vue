<template>
  <div>
    <div class="content-header">
      <h1>预约管理<small>检查项管理</small></h1>
      <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>预约管理</el-breadcrumb-item>
        <el-breadcrumb-item>检查项管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="app-container">
      <div class="box">
        <div class="filter-container">
          <el-input
            placeholder="项目编码/项目名称"
            v-model="pagination.queryString"
            style="width: 200px"
            class="filter-item"
          ></el-input>
          <el-button @click="findPageByCondition" class="dalfBut"
            >查询</el-button
          >
          <el-button type="primary" class="butT" @click="handleCreate"
            >新建</el-button
          >
          <el-button type="primary" class="butT" @click="reset"
            >清空</el-button
          >
        </div>
        <el-table
          size="small"
          current-row-key="id"
          :data="dataList"
          stripe
          highlight-current-row
        >
          <el-table-column
            type="index"
            align="center"
            label="序号"
          ></el-table-column>
          <el-table-column
            prop="code"
            label="项目编码"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="项目名称"
            align="center"
          ></el-table-column>
          <el-table-column label="适用性别" align="center">
            <template slot-scope="scope">
              <span>{{
                scope.row.sex == "0"
                  ? "不限"
                  : scope.row.sex == "1"
                  ? "男"
                  : "女"
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="age"
            label="适用年龄"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="remark"
            label="项目说明"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handleUpdate(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
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
            :total="pagination.total"
          >
          </el-pagination>
        </div>

        <!-- 新增标签弹层 -->
        <div class="add-form">
          <el-dialog title="新增检查项" :visible.sync="dialogFormVisible">
            <el-form
              ref="dataAddForm"
              :model="formData"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目编码" prop="code">
                    <el-input v-model="formData.code" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目名称" prop="name">
                    <el-input v-model="formData.name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="性别">
                    <el-select v-model="formData.sex">
                      <el-option label="不限" value="0"></el-option>
                      <el-option label="男" value="1"></el-option>
                      <el-option label="女" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="适用年龄" prop="age">
                    <el-input v-model.number="formData.age" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="类型">
                    <el-select v-model="formData.type">
                      <el-option label="检查" value="1"></el-option>
                      <el-option label="检验" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="价格">
                    <el-input v-model="formData.price" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="项目说明">
                    <el-input
                      v-model="formData.remark"
                      type="textarea"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="注意事项">
                    <el-input
                      v-model="formData.attention"
                      type="textarea"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handleAdd('dataAddForm')"
                >确定</el-button
              >
            </div>
          </el-dialog>
        </div>

        <!-- 编辑标签弹层 -->
        <div class="add-form">
          <el-dialog title="编辑检查项" :visible.sync="dialogFormVisible4Edit">
            <el-form
              ref="dataEditForm"
              :model="formData"
              :rules="rules"
              label-position="right"
              label-width="100px"
            >
              <el-row>
                <el-col :span="12">
                  <el-form-item label="项目编码" prop="code">
                    <el-input v-model="formData.code" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="项目名称" prop="name">
                    <el-input v-model="formData.name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="性别">
                    <el-select v-model="formData.sex">
                      <el-option label="不限" value="0"></el-option>
                      <el-option label="男" value="1"></el-option>
                      <el-option label="女" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="适用年龄">
                    <el-input v-model="formData.age" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="类型">
                    <el-select v-model="formData.type">
                      <el-option label="检查" value="1"></el-option>
                      <el-option label="检验" value="2"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="价格">
                    <el-input v-model="formData.price" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="项目说明">
                    <el-input
                      v-model="formData.remark"
                      type="textarea"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="注意事项">
                    <el-input
                      v-model="formData.attention"
                      type="textarea"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible4Edit = false"
                >取消</el-button
              >
              <el-button type="primary" @click="handleEdit('dataEditForm')"
                >确定</el-button
              >
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
      pagination: {
        //分页相关模型数据
        currentPage: 1, //当前页码
        pageSize: 10, //每页显示的记录数
        total: 0, //总记录数
        queryString: null, //查询条件   双向绑定
      },
      dataList: [], //当前页要展示的分页列表数据  [{},{}]  List<T>
      formData: {}, //表单数据  添加检查项  formData提交给后台
      dialogFormVisible: false, //增加表单是否可见
      dialogFormVisible4Edit: false, //编辑表单是否可见
      rules: {
        //校验规则
        code: [
          { required: true, message: "项目编码为必填项", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字符", trigger: "blur" },
        ],
        name: [
          { required: true, message: "项目名称为必填项", trigger: "blur" },
          { min: 2, max: 10, message: "长度在 2 到 10个字符", trigger: "blur" },
        ],
        age: [
          { required: true, message: "年龄必填项", trigger: "blur" },
          { type: "number", min: 1, message: "年龄必须为数字值" },
        ],
      },
    };
  },
  //钩子函数，VUE对象初始化完成后自动执行
  created() {
    this.findPage();
  },

  methods: {

      //弹出编辑窗 回显数据    
    handleUpdate(row) { 
      this.dialogFormVisible4Edit = true;
      //回显数据
      this.formData = row; 
    },

    //弹出新增窗
    handleCreate() {
      this.dialogFormVisible = true;
      //清空表单数据
      this.formData = {}; 
    },

    //1、编辑功能 
    handleEdit(ruleForm) {
      //调用添加业务逻辑
      this.handleAdd(ruleForm);
    },

    //  逻辑删除
    handleDelete(row) {
         this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$http.delete("api/checkitem/deleteCheckItemById/"+row.id).then((res)=>{
                if(res.data.flag){
                    //判断当前页是否还有数据，没有跳转上一页
                    if(this.dataList.length === 1){
                        this.pagination.currentPage -= 1;
                    }
                    this.findPage()
                    this.$message.success("删除成功")
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

    //  条件分页查询   无条件分页查询
    findPageByCondition() {
      this.pagination.currentPage = 1;
      this.findPage();
    },

    //点击页码进行分页查询
    handleCurrentChange(curpage) {
      this.pagination.currentPage = curpage;
      this.findPage();
    },

    // 分页查询
    findPage() {
      //  第一次分页查询
      this.$http.post("api/checkitem/findPage", this.pagination).then((res) => {
        if (res.data.flag) {
          this.dataList = res.data.data.rows;
          this.pagination.total = res.data.data.total;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },

    //提交新增用户表单
    handleAdd(ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$http.post("api/checkitem/add", this.formData).then((res) => {
            if (res.data.flag) {
              this.findPage();
              // 谁调用我关闭谁窗口
              this.dialogFormVisible = false;
              this.dialogFormVisible4Edit = false;
            } else {
              this.$message.error(res.data.message);
            }
          });
        } else {
          this.$message.error("表单数据非法");
        }
      });
    },

    //重置
    reset(){
        this.pagination.queryString="";
        this.findPage()
    }

  },
};
</script>