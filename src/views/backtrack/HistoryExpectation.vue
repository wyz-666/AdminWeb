<template>
  <el-tabs type="border-card">
    <el-tab-pane label="CEA月度">
      <el-card shadow="never" style="border-top: none">
        <el-table
          :data="tableData1"
          border
          style="width: 100%"
          @sort-change="handleSortChange1"
        >
          <el-table-column prop="date" label="日期" width="100" sortable="custom">
          </el-table-column>
          <el-table-column prop="lowerPrice" label="买入价格" width="100">
          </el-table-column>
          <el-table-column prop="higherPrice" label="卖出价格" width="120">
          </el-table-column>
          <el-table-column prop="midPrice" label="中间价格" width="120">
          </el-table-column>
          <el-table-column prop="lowerPriceIndex" label="买入价格指数" width="120">
          </el-table-column>
          <el-table-column prop="higherPriceIndex" label="卖出价格指数" width="120">
          </el-table-column>
          <el-table-column prop="midPriceIndex" label="中间价格指数" width="120">
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="CEA年度">
      <el-card shadow="never" style="border-top: none">
        <el-table
          :data="tableData2"
          border
          style="width: 100%"
          @sort-change="handleSortChange2"
        >
          <el-table-column prop="date" label="日期" width="100" sortable="custom">
          </el-table-column>
          <el-table-column prop="lowerPrice" label="买入价格" width="100">
          </el-table-column>
          <el-table-column prop="higherPrice" label="卖出价格" width="120">
          </el-table-column>
          <el-table-column prop="midPrice" label="中间价格" width="120">
          </el-table-column>
          <el-table-column prop="lowerPriceIndex" label="买入价格指数" width="120">
          </el-table-column>
          <el-table-column prop="higherPriceIndex" label="卖出价格指数" width="120">
          </el-table-column>
          <el-table-column prop="midPriceIndex" label="中间价格指数" width="120">
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="CCER月度">
      <el-card shadow="never" style="border-top: none">
        <el-table
          :data="tableData3"
          border
          style="width: 100%"
          @sort-change="handleSortChange3"
        >
          <el-table-column prop="date" label="日期" width="100" sortable="custom">
          </el-table-column>
          <el-table-column prop="lowerPrice" label="买入价格" width="100">
          </el-table-column>
          <el-table-column prop="higherPrice" label="卖出价格" width="120">
          </el-table-column>
          <el-table-column prop="midPrice" label="中间价格" width="120">
          </el-table-column>
          <el-table-column prop="lowerPriceIndex" label="买入价格指数" width="120">
          </el-table-column>
          <el-table-column prop="higherPriceIndex" label="卖出价格指数" width="120">
          </el-table-column>
          <el-table-column prop="midPriceIndex" label="中间价格指数" width="120">
          </el-table-column>
        </el-table>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="GEC月度">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane
          v-for="(items, type) in groupedTableData"
          :key="type"
          :label="type"
          :name="type"
        >
          <el-table
            :data="items"
            border
            style="width: 100%"
            @sort-change="(e) => handleSortChange(e, type)"
          >
            <el-table-column
              prop="date"
              label="日期"
              width="120"
              sortable="custom"
            ></el-table-column>
            <el-table-column prop="price" label="价格" width="100"></el-table-column>
            <el-table-column
              prop="priceIndex"
              label="价格指数"
              width="120"
            ></el-table-column>
            <!-- 根据你需要展示的字段继续添加 -->
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="User" name="first">User</el-tab-pane>
        <el-tab-pane label="Config" name="second">Config</el-tab-pane>
        <el-tab-pane label="Role" name="third">Role</el-tab-pane>
        <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
      </el-tabs>
      <el-card shadow="never" style="border-top: none">
        <el-table
          :data="tableData4"
          border
          style="width: 100%"
          @sort-change="handleSortChange4"
        >
          <el-table-column prop="type" label="产品类型" width="200"> </el-table-column>
          <el-table-column prop="date" label="日期" width="100" sortable="custom">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="120"> </el-table-column>
          <el-table-column prop="priceIndex" label="价格指数" width="120">
          </el-table-column>
        </el-table>
      </el-card> -->
    </el-tab-pane>
    <el-button type="success" @click="exportExcel" style="margin-left: 10px"
      >导出所有数据</el-button
    >
  </el-tabs>
</template>

<script>
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  name: "UserManage",
  data() {
    return {
      value: true,
      value1: 1,
      value2: 0,
      tableData1: null,
      tableData2: null,
      tableData3: null,
      tableData4: null,
      formLabelWidth: "120px",
      activeName: "", // 当前激活的tab
      groupedTableData: {}, // 分组后的数据
      user: {
        type: "",
      },
      uuid: "",
    };
  },
  mounted() {
    this.getCEAMonth();
    this.getCEAYear();
    this.getCCERMonth();
    this.getGECMonth();
  },
  methods: {
    getCEAMonth() {
      this.$axios
        .get("/admin/getCEAMonthExpectation", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          console.log(response);
          this.tableData1 = response.data.data;
        });
    },
    getCEAYear() {
      this.$axios
        .get("/admin/getCEAYearExpectation", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          this.tableData2 = response.data.data;
        });
    },
    getCCERMonth() {
      this.$axios
        .get("/admin/getCCERMonthExpectation", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          this.tableData3 = response.data.data;
        });
    },
    getGECMonth() {
      this.$axios
        .get("/admin/getGECMonthExpectation", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          this.tableData4 = response.data.data;
          const allData = response.data.data;

          // 清空
          this.groupedTableData = {};

          // 遍历，按产品类型分组
          allData.forEach((item) => {
            const type = item.type; // 这里假设你的字段叫 productType
            if (!this.groupedTableData[type]) {
              this.groupedTableData[type] = [];
            }
            this.groupedTableData[type].push(item);
          });
          console.log("groupedTableData:", this.groupedTableData);
          // 设置第一个 tab 默认激活
          const types = Object.keys(this.groupedTableData);
          if (types.length > 0) {
            this.activeName = types[0];
          }
        });
    },
    formatDate(val) {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    },
    exportExcel() {
      // 处理第一个表格的数据（表格一）
      const exportData1 = this.tableData1.map((item) => ({
        日期: item.date,
        买入价格: item.lowerPrice,
        卖出价格: item.higherPrice,
        中间价格: item.midPrice,
        买入价格指数: item.lowerPriceIndex,
        卖出价格指数: item.higherPriceIndex,
        中间价格指数: item.midPriceIndex,
      }));
      // 处理第一个表格的数据（表格二）
      const exportData2 = this.tableData2.map((item) => ({
        日期: item.date,
        买入价格: item.lowerPrice,
        卖出价格: item.higherPrice,
        中间价格: item.midPrice,
        买入价格指数: item.lowerPriceIndex,
        卖出价格指数: item.higherPriceIndex,
        中间价格指数: item.midPriceIndex,
      }));
      const exportData3 = this.tableData3.map((item) => ({
        日期: item.date,
        买入价格: item.lowerPrice,
        卖出价格: item.higherPrice,
        中间价格: item.midPrice,
        买入价格指数: item.lowerPriceIndex,
        卖出价格指数: item.higherPriceIndex,
        中间价格指数: item.midPriceIndex,
      }));
      const exportData4 = this.tableData4.map((item) => ({
        日期: item.date,
        产品类型: item.type,
        价格: item.price,
        价格指数: item.priceIndex,
      }));
      // 1. 生成工作表
      // 创建两个工作表
      const worksheet1 = XLSX.utils.json_to_sheet(exportData1);
      const worksheet2 = XLSX.utils.json_to_sheet(exportData2);
      const worksheet3 = XLSX.utils.json_to_sheet(exportData3);
      const worksheet4 = XLSX.utils.json_to_sheet(exportData4);
      // 2. 生成工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet1, "CEA月度");
      XLSX.utils.book_append_sheet(workbook, worksheet2, "CEA年度");
      XLSX.utils.book_append_sheet(workbook, worksheet3, "CCER月度");
      XLSX.utils.book_append_sheet(workbook, worksheet4, "GEC月度");
      // 3. 写出文件数据
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      // 4. 保存文件
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `历史预测数据-${dayjs().format("YYYY-MM-DD")}.xlsx`);
    },
    handleSortChange1({ prop, order }) {
      const parseDate = (str) => {
        // 假设 str 是类似 "2024年5月"、"2023年12月"
        const match = str.match(/^(\d{4})年(\d{1,2})月$/);
        if (!match) return 0; // 如果格式不对，返回0
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        return year * 100 + month; // 202405，202312 这种数字，方便比较
      };

      if (order === "descending") {
        this.tableData1.sort((a, b) => parseDate(b[prop]) - parseDate(a[prop]));
      } else if (order === "ascending") {
        this.tableData1.sort((a, b) => parseDate(a[prop]) - parseDate(b[prop]));
      }
    },
    handleSortChange2({ prop, order }) {
      const parseDate = (str) => {
        // 假设 str 是类似 "2024年5月"、"2023年12月"
        const match = str.match(/^(\d{4})年(\d{1,2})月$/);
        if (!match) return 0; // 如果格式不对，返回0
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        return year * 100 + month; // 202405，202312 这种数字，方便比较
      };

      if (order === "descending") {
        this.tableData2.sort((a, b) => parseDate(b[prop]) - parseDate(a[prop]));
      } else if (order === "ascending") {
        this.tableData2.sort((a, b) => parseDate(a[prop]) - parseDate(b[prop]));
      }
    },
    handleSortChange3({ prop, order }) {
      const parseDate = (str) => {
        // 假设 str 是类似 "2024年5月"、"2023年12月"
        const match = str.match(/^(\d{4})年(\d{1,2})月$/);
        if (!match) return 0; // 如果格式不对，返回0
        const year = parseInt(match[1]);
        const month = parseInt(match[2]);
        return year * 100 + month; // 202405，202312 这种数字，方便比较
      };

      if (order === "descending") {
        this.tableData3.sort((a, b) => parseDate(b[prop]) - parseDate(a[prop]));
      } else if (order === "ascending") {
        this.tableData3.sort((a, b) => parseDate(a[prop]) - parseDate(b[prop]));
      }
    },
    handleSortChange(e,type) {
      const { prop, order } = e;
      if (prop !== "date") return; // 只处理日期列排序

      this.groupedTableData[type].sort((a, b) => {
        const aTime = this.parseDate(a.date);
        const bTime = this.parseDate(b.date);

        if (order === "ascending") {
          return aTime - bTime;
        } else if (order === "descending") {
          return bTime - aTime;
        } else {
          return 0;
        }
      });
    },

    parseDate(dateStr) {
      // 假设是 "2025年3月" 这种格式
      const match = dateStr.match(/^(\d{4})年(\d{1,2})月$/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10);
        return new Date(year, month - 1); // 月份是0-11
      }
      return new Date(0); // 万一解析失败，给个最早的时间
    },
  },
};
</script>

<style scoped></style>
