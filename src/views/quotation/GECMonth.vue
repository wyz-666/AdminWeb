<template>
  <el-row :gutter="12">
    <el-date-picker
      v-model="date"
      type="date"
      placeholder="选择报价提交截止时间"
      :size="size"
      style="margin-left: 30px"
    />
    <el-button type="primary" @click="getAVG">获得当月GEC报价情况</el-button>
    <el-button type="success" @click="exportExcel" style="margin-left: 10px"
      >导出GEC当月报价及均值</el-button
    >
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none">
        <el-table
          :highlight-current-row="true"
          :data="tableData"
          border
          style="width: 100%"
        >
          <el-table-column prop="product" label="产品名称" width="100"> </el-table-column>
          <el-table-column prop="type" label="产品类型" width="100"> </el-table-column>
          <el-table-column prop="uuid" label="报价人ID" width="120"> </el-table-column>
          <el-table-column prop="userName" label="报价人" width="120"> </el-table-column>
          <el-table-column prop="lowerPrice" label="最低价" width="100">
          </el-table-column>
          <el-table-column prop="higherPrice" label="最高价" width="100">
          </el-table-column>
          <el-table-column prop="txVolume" label="交易量" width="100"> </el-table-column>
          <el-table-column prop="CreatedAt" label="提交时间" width="180">
            <template #default="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ formatDate(scope.row.CreatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicableTime" label="报价适用时间" width="100">
          </el-table-column> </el-table
        ><br /><br />
      </el-card>
      <el-card shadow="always" style="border-top: none">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px">
          各类型平均报价
        </div>
        <el-table :data="avgTableData" border style="width: 100%">
          <el-table-column prop="type" label="产品类型" width="100"> </el-table-column>
          <el-table-column prop="averagePrice" label="平均价" width="100" />
        </el-table>
        <el-button type="primary" @click="dialogFormVisible = true">提交预测值</el-button>
      </el-card>
      <el-dialog title="提交GEC预测结果" v-model="dialogFormVisible" width="40%">
        <el-form :model="expectation">
          <el-date-picker
            v-model="expectation.date"
            type="month"
            placeholder="选择月份"
          />
          <el-select
            v-model="expectation.type"
            placeholder="请选择产品类型"
            size="large"
            style="width: 240px; margin-top: 20px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-form-item
            label="价格"
            :label-width="formLabelWidth"
            style="margin-top: 20px"
          >
            <el-input v-model="expectation.price" placeholder="请输入价格" />
          </el-form-item>
          <el-form-item label="价格指数" :label-width="formLabelWidth">
            <el-input v-model="expectation.priceIndex" placeholder="请输入价格指数" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="uploadExpectation"
              >提交预测值</el-button
            >
          </span>
        </template>
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script>
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
export default {
  name: "OrderList",
  data() {
    return {
      tableData: null,
      avgTableData: null,
      dialogFormVisible: false,
      date: "",
      currentPage: 1,
      size: 5,
      total: "",
      expectation: {
        type: "",
        date: "",
        price: "",
        priceIndex: "",
      },
      options: [
        {
          value: "集中式-2024年生产",
          label: "集中式-2024年生产",
        },
        {
          value: "分布式-2024年生产",
          label: "分布式-2024年生产",
        },
        {
          value: "生物质-2024年生产",
          label: "生物质-2024年生产",
        },
        {
          value: "集中式-2025年生产",
          label: "集中式-2025年生产",
        },
        {
          value: "分布式-2025年生产",
          label: "分布式-2025年生产",
        },
        {
          value: "生物质-2025年生产",
          label: "生物质-2025年生产",
        },
      ],
    };
  },
  mounted() {
    // this.queryAvg();
  },
  
  methods: {
    roundToTwo(val) {
      return Math.round(val * 100) / 100;
    },
    getAVG() {
      let dateString = dayjs(this.date).format("YYYY-MM-DD HH:mm:ss");
      this.$axios
        .get("/admin/getMonthQuotation", {
          params: {
            nowTime: dateString,
            product: "GEC",
          },
        })
        .then((response) => {
          this.tableData = response.data.data;
          if (!this.tableData || this.tableData.length === 0) {
            this.$message.warning("当月暂无报价");
            return;
          }
          console.log("test1:", this.tableData);
          let typeMap = {};
          // 遍历每一条数据
          this.tableData.forEach((item) => {
            if (!typeMap[item.type]) {
              typeMap[item.type] = {
                sum: 0,
                count: 0,
              };
            }
            let price = this.roundToTwo((parseFloat(item.lowerPrice) + parseFloat(item.higherPrice)) / 2);
            console.log("price:", price);
            typeMap[item.type].sum = this.roundToTwo(typeMap[item.type].sum + price); // 累加价格
            console.log("type:", item.type);
            console.log("avgPrice:", typeMap[item.type].sum);
            typeMap[item.type].count += 1; // 记录数量
          });

          // 计算每一类的平均值
          let avgResult = [];
          for (let type in typeMap) {
            let avg = this.roundToTwo(typeMap[type].sum / typeMap[type].count);
            avgResult.push({
              type: type,
              averagePrice: avg.toFixed(2), // 保留两位小数
            });
          }

          console.log("每个type的平均价格：", avgResult);
          // 你可以把 avgResult 存到 data 里展示到页面上
          this.avgTableData = avgResult;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    uploadExpectation() {
      console.log("month:", dayjs(this.expectation.date).format("YYYY年M月"));
      this.$axios
        .post("/admin/submitGECStats", {
          product: "GEC",
          type: this.expectation.type,
          date: dayjs(this.expectation.date).format("YYYY年M月"),
          price: this.expectation.price,
          priceIndex: this.expectation.priceIndex,
        })
        .then((response) => {
          if (response.data.statusCode === 200) {
            this.$message({
              type: "success",
              message: "上传成功!",
            });
          }
        });
      this.dialogFormVisible1 = false;
    },
    formatDate(val) {
      return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
    },
    
    exportExcel() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message.warning("没有数据可导出");
        return;
      }
      // 处理第一个表格的数据（表格一）
      const exportData = this.tableData.map((item) => ({
        用户编号: item.uuid,
        产品类型: item.type,
        最低价: item.lowerPrice,
        最高价: item.higherPrice,
        交易量: item.txVolume,
        适用时间: item.applicableTime,
      }));
      // 处理第一个表格的数据（表格二）
      const exportData1 = this.avgTableData.map((item) => ({
        产品类型: item.type,
        价格均值: item.averagePrice,
      }));
      // 1. 生成工作表
      // 创建两个工作表
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const worksheet1 = XLSX.utils.json_to_sheet(exportData1);
      // 2. 生成工作簿
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "CEA当月报价");
      XLSX.utils.book_append_sheet(workbook, worksheet1, "CEA当月报价均值");
      // 3. 写出文件数据
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      // 4. 保存文件
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `CEA当月报价及均值-${dayjs(this.date).format("YYYY-MM-DD")}.xlsx`);
    },
  },
};
</script>

<style scoped></style>
