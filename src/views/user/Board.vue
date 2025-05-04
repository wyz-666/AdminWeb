<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none">
        <el-button type="primary" @click="dialogFormVisible = true">更新公告</el-button>

        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px">
          历史公告
        </div>
        <el-table
          :data="tableData1"
          border
          style="width: 100%"
          height="500px"
          @sort-change="handleSortChange"
        >
          <el-table-column prop="date" label="日期" width="100" sortable="custom">
          </el-table-column>
          <el-table-column prop="content" label="内容" width="600">
          </el-table-column>
        </el-table>

        <el-dialog title="上传大盘信息" v-model="dialogFormVisible" width="30%">
          <el-form :model="market">
            <el-form-item label="日期" :label-width="formLabelWidth">
              <el-date-picker
                v-model="market.date"
                type="date"
                placeholder="Pick a date"
                value-format="YYYY/MM/DD"
              />
            </el-form-item>

            <el-form-item label="内容" :label-width="formLabelWidth">
              <el-input v-model="market.content" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
              <el-button size="mini" type="primary" @click="upload">上传</el-button>
            </span>
          </template>
        </el-dialog>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "UserManage",
  data() {
    return {
      value: true,
      value1: 1,
      value2: 0,
      tableData1: null,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      market: {
        date: "",
        content: "",
      },
      uuid: "",
    };
  },
  mounted() {
    this.getBoard();
  },
  methods: {
    getBoard() {
      this.$axios
        .get("/admin/allBoards", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          this.tableData1 = response.data.data;
          console.log("test:", this.tableData1);
        });
    },
    handleSortChange({ prop, order }) {
      if (order === "descending") {
        this.tableData1.sort((a, b) => new Date(b[prop]) - new Date(a[prop]));
      } else if (order === "ascending") {
        this.tableData1.sort((a, b) => new Date(a[prop]) - new Date(b[prop]));
      }
    },
    upload() {
      console.log("market:", this.market);
      this.$axios.post("/admin/submitBorad", this.market).then((response) => {
        if (response.data.statusCode === 200) {
          this.$message({
            type: "success",
            message: "上传成功!",
          });
          this.dialogFormVisible = false;
          this.getBoard();
        }
      });
    },
  },
};
</script>

<style scoped></style>
