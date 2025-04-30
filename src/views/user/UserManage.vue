<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none;">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="userId" label="编号" width="100">
          </el-table-column>
          <el-table-column prop="account" label="账户名" width="100">
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="120">
          </el-table-column>
          <el-table-column prop="companyType" label="公司类型" width="120">
          </el-table-column>
          <el-table-column prop="userName" label="操作人" width="120">
          </el-table-column>
          <el-table-column prop="type" label="角色" width="100">
            <template #default="scope">
              <el-tag size="mini" type="success" v-if="scope.row.type === 1">管理员</el-tag>
              <el-tag size="mini" v-if="scope.row.type === 3">普通账号</el-tag>
              <el-tag size="mini" type="danger" v-if="scope.row.type === 2">会员账号</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="approved" label="状态" width="100">
            <template #default="scope">
              <el-tag size="mini" type="success" v-if="scope.row.approved === true">正常</el-tag>
              <el-tag size="mini" type="danger" v-if="scope.row.approved === false">待审批</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="CreatedAt" label="创建时间" width="180">
            <template #default="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ formatDate(scope.row.CreatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template #default="scope">
              <el-button size="mini" type="primary" @click="updateClick(scope.$index, scope.row)">修改
              </el-button>
              <el-button v-if="scope.row.approved === false" size="mini" type="primary"
                @click="updateClick(scope.$index, scope.row)">审批
              </el-button>
              <!-- <el-button
                  size="mini"
                  type="danger"
                  @click="deleteUser(scope.$index, scope.row)">删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="修改用户信息" v-model="dialogFormVisible" width="30%">
          <el-form :model="user">
            <el-form-item label="角色" :label-width="formLabelWidth">
              <el-radio v-model="user.type" label="会员账户">会员账户</el-radio>
              <el-radio v-model="user.type" label="普通账户">普通账户</el-radio>
            </el-form-item>
            <!-- <el-form-item label="状态" :label-width="formLabelWidth">
              <el-radio v-model="user.status" :label="value1">正常</el-radio>
              <el-radio v-model="user.status" :label="value2">停用</el-radio>
            </el-form-item> -->
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
              <el-button size="mini" type="primary" @click="updateUser">确 定</el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

import dayjs from 'dayjs'
export default {
  name: "UserManage",
  data() {
    return {
      value: true,
      value1: 1,
      value2: 0,
      tableData: null,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      user:{
        type:''
      },
      uuid: '',
      
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      this.$axios.get("/admin/userlist", {
        params: {
          pageNum: 1,
          pageSize: 10,
        }
      }).then(response => {
        this.tableData = response.data.data;
        console.log("test:", this.tableData);
      })
    },
    updateClick(index, row) {
      this.user.type = row.type;
      this.uuid = row.uuid;
      this.dialogFormVisible = true;
      console.log(index, row);
    },
    updateUser() {
      if (this.user.type === '普通账户') {
        console.log("uuid:",this.uuid)
        this.$axios.get("/admin/downVip", {
          params: {
            uuid:this.uuid
          }
        }).then(response => {
          console.log(response);
          if (response.data.statusCode === 200){
           this.$message({
             type: 'success',
             message: '更新成功!'
           });
          this.dialogFormVisible = false;
          this.getUserList();
          }
        })
      } else {
        console.log("uuid:",this.uuid)
        this.$axios.get("/admin/upgradeVip", {
          params: {
            uuid:this.uuid
          }
        }).then(response => {
          console.log(response);
          if (response.data.statusCode === 200){
           this.$message({
             type: 'success',
             message: '更新成功!'
           });
          this.dialogFormVisible = false;
          this.getUserList();
          }
        })
      }

    },
    // deleteUser(index, row) {
    //   console.log(index,row);
    //   this.$axios.get("/user/delete",{
    //     params: {
    //       id: row.id
    //     }
    //   }).then(response => {
    //     console.log(response);
    //     this.getUserList();
    //   })
    // },
    formatDate(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped></style>