<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="nid" label="通知编号" width="100"> </el-table-column>
          <el-table-column prop="type" label="类型" width="100"> </el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="120">
          </el-table-column>

          <el-table-column prop="userName" label="操作人" width="120"> </el-table-column>
          <el-table-column prop="phone" label="电话" width="120"> </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180"> </el-table-column>
          <el-table-column prop="state" label="状态" width="100">
            <template #default="scope">
              <el-tag size="mini" type="success" v-if="scope.row.state === 2"
                >已读</el-tag
              >
              <el-tag size="mini" type="danger" v-if="scope.row.state === 1">未读</el-tag>
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
              <el-button
                size="mini"
                type="primary"
                v-if="scope.row.state === 1"
                @click="updateClick(scope.$index, scope.row)"
                >阅读
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "UserManage",
  data() {
    return {
      value: true,
      value1: 1,
      value2: 0,
      tableData: null,
      formLabelWidth: "120px",
      user: {
        type: "",
      },
      uuid: "",
    };
  },
  mounted() {
    this.getNotitionList();
  },
  methods: {
    getNotitionList() {
      this.$axios
        .get("/admin/getNotion", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          let data = response.data.data;
          // 按 state 排序：state == 1 (未读) 的在前，state == 2 (已读) 的在后
          data.sort((a, b) => a.state - b.state);
          this.tableData = data;
          // this.tableData = response.data.data;
          console.log("test:", this.tableData);
        });
    },
    updateClick(index, row) {
      this.nid = row.nid;
      console.log(index, row);
      this.$axios
        .get("/admin/fixNotionState", {
          params: {
            nid: this.nid,
          },
        })
        .then((response) => {
          console.log(response);
          if (response.data.statusCode === 200) {
            this.$message({
              type: "success",
              message: "更新成功!",
            });
            this.getNotitionList();
          }
        });
    },
    formatDate(val) {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style scoped></style>
