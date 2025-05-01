<template>
  <el-row :gutter="12">
    <el-date-picker v-model="date" type="date" placeholder="选择一个时间" :size="size" style="margin-left: 30px;" />
    <el-button type="primary" @click="getScore">获取排名</el-button>
    <el-button type="success" @click="exportExcel" style="margin-left: 10px;">导出为Excel</el-button>
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none;">
        <el-table :highlight-current-row="true" :data="tableData" border style="width: 100%;"
          @sort-change="handleSortChange">
          <el-table-column prop="userId" label="编号" width="100">
          </el-table-column>
          <el-table-column prop="companyName" label="公司名称" width="100">
          </el-table-column>
          <el-table-column prop="userName" label="用户姓名" width="100">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="100">
          </el-table-column>
          <el-table-column prop="phone" label="电话" width="100">
          </el-table-column>
          <el-table-column prop="score" label="得分" width="100" sortable="custom">
          </el-table-column>
          <el-table-column prop="ranking" label="排名" width="100">
          </el-table-column>
        </el-table><br><br>
        <el-pagination background @current-change="handleCurrentChange" @prev-click="handleCurrentChangePrev"
          @next-click="handleCurrentChangeNext" :currentPage="currentPage" :page-size="size"
          layout="total, prev, pager, next" :total="total">
        </el-pagination>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
export default {
  name: "OrderList",
  data() {
    return {
      tableData: null,
      currentPage: 1,
      size: 5,
      total: '',
      date: ''
    }
  },
  mounted() {
    // this.queryOrder();
  },
  methods: {
    handleCurrentChangePrev(val) {
      this.currentPage = val;
      console.log(`上一页: ${val}`);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.selectGoodsList();
      console.log(`当前页: ${val}`);
    },
    handleCurrentChangeNext(val) {
      this.currentPage = val;
      console.log(`下一页: ${val}`);
    },
    handleSortChange({ prop, order }) {
      if (order === 'descending') {
        this.tableData.sort((a, b) => a[prop] - b[prop])
      } else if (order === 'ascending') {
        this.tableData.sort((a, b) => b[prop] - a[prop])
      }
    },
    getScore() {
      this.$axios.get("/admin/getScoreList", {
        params: {
          nowTime: dayjs(this.date).format('YYYY-MM-DD HH:mm:ss'),
        }
      }).then(response => {
        let data = response.data.data;
        // 先根据 score 从小到大排序
        data.sort((a, b) => a.score - b.score)
        // 然后增加 ranking 字段，排名从 1 开始
        data.forEach((item, index) => {
          item.ranking = index + 1
        })
        // 最后赋值给 tableData
        this.tableData = data;
        // this.tableData = response.data.data;
        console.log("date", this.date)
        console.log("data:", this.tableData);
      })
    },
    formatDate(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    },
    exportExcel() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message.warning('没有数据可导出');
        return;
      }
      // 1. 生成工作表
      const worksheet = XLSX.utils.json_to_sheet(this.tableData);
      // 2. 生成工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "预测回溯排名");
      // 3. 写出文件数据
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // 4. 保存文件
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `预测回溯排名-${dayjs(this.date).format('YYYY-MM-DD')}.xlsx`);
    }
  }
}
</script>

<style scoped></style>