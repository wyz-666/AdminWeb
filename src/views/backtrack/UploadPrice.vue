<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none">
        <el-button type="primary" @click="dialogFormVisible = true">上传</el-button>
        <el-col :span="8">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px">
            CEA历史行情
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
            <el-table-column prop="higherPrice" label="最高价" width="100">
            </el-table-column>
            <el-table-column prop="lowerPrice" label="最低价" width="120">
            </el-table-column>
            <el-table-column prop="closingPrice" label="收盘价" width="120">
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="4">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px">
            CCER历史行情
          </div>
          <el-table
            :data="tableData2"
            border
            style="width: 100%"
            height="500px"
            @sort-change="handleSortChange"
          >
            <el-table-column prop="date" label="日期" width="100" sortable="custom">
            </el-table-column>
            <el-table-column prop="closingPrice" label="均价" width="120">
            </el-table-column>
          </el-table>
        </el-col>
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
            <el-form-item label="产品" :label-width="formLabelWidth">
              <el-select v-model="market.product" placeholder="please select a product">
                <el-option label="CEA" value="CEA" />
                <el-option label="CCER" value="CCER" />
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="market.product === 'CEA'"
              label="最高价(元/吨)"
              :label-width="formLabelWidth"
            >
              <el-input v-model="market.higherPrice" />
            </el-form-item>
            <el-form-item
              v-if="market.product === 'CEA'"
              label="最低价(元/吨)"
              :label-width="formLabelWidth"
            >
              <el-input v-model="market.lowerPrice" />
            </el-form-item>
            <el-form-item
              v-if="market.product === 'CEA'"
              label="收盘价(元/吨)"
              :label-width="formLabelWidth"
            >
              <el-input v-model="market.closingPrice" />
            </el-form-item>
            <el-form-item
              v-if="market.product === 'CCER'"
              label="成交价(元/吨)"
              :label-width="formLabelWidth"
            >
              <el-input v-model="market.closingPrice" />
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
              <el-button size="mini" type="primary" @click="upload">确 定</el-button>
            </span>
          </template>
        </el-dialog>
        <el-upload
          ref="uploadExcel"
          :auto-upload="false"
          :limit="1"
          accept=".xlsx,.xls"
          :on-change="handleFileChange"
          :before-upload="() => false"
        >
          <el-button type="primary" style="margin-top: 20px">选择Excel文件</el-button>
        </el-upload>

        <!-- 确认上传按钮 -->
        <el-button
          type="success"
          @click="uploadExcelFile"
          :disabled="!excelFile"
          style="margin-top: 14px"
        >
          确认上传
        </el-button>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import * as XLSX from "xlsx";
import dayjs from "dayjs";

export default {
  name: "UserManage",
  data() {
    return {
      value: true,
      value1: 1,
      value2: 0,
      tableData1: null,
      tableData2: null,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      market: {
        date: "",
        higherPrice: "",
        lowerPrice: "",
        closingPrice: "",
        product: "",
      },
      uuid: "",
      excelFile: null, // 保存用户选择的文件
    };
  },
  mounted() {
    this.getCEA();
    this.getCCER();
  },
  methods: {
    parseExcelDate(cellValue) {
      if (cellValue === null || cellValue === undefined || cellValue === "") return "";

      // 2) 如果是数字（Excel serial）
      if (typeof cellValue === "number") {
        const jsDate = this.excelSerialToJSDate(cellValue);
        return this.formatYMD(jsDate);
      }

      // 3) 如果是字符串，尝试解析常见格式
      if (typeof cellValue === "string") {
        // 尝试用 dayjs（更稳），如果未安装也可以用 new Date()
        const d1 = dayjs(cellValue);
        if (d1.isValid()) {
          return d1.format("YYYY/MM/DD");
        }
        // 尝试解析中文格式 "2023年2月1日" 或 "2023年2月"
        const m = cellValue.match(/^(\d{4})\D+(\d{1,2})\D*(\d{1,2})?/);
        if (m) {
          const y = m[1];
          const mm = m[2].padStart(2, "0");
          const dd = (m[3] || "01").padStart(2, "0");
          return `${y}/${mm}/${dd}`;
        }
        // 最后兜底：返回原始字符串
        return cellValue;
      }

      // 其它情况直接返回空
      return "";
    },

    // 把 Excel 序列号（serial）转为 JS Date
    // Excel 的序列号以 1900-01-01 为基准（Windows），对应 JS 基准差值 25569
    excelSerialToJSDate(serial) {
      // serial 可能包含小数部分(表示时分秒)
      const utc_days = serial - 25569;
      const utc_seconds = utc_days * 86400;
      const d = new Date(utc_seconds * 1000);

      // 注意 timezone 会影响显示，如果需要按本地时区显示，可以用下面：
      // const date = new Date((serial - 25569) * 86400 * 1000 + (new Date()).getTimezoneOffset()*60000);
      return d;
    },

    // 格式化 Date -> "YYYY/MM/DD"
    formatYMD(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}/${m}/${d}`;
    },
    getCEA() {
      this.$axios
        .get("/admin/getCEA", {
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
    getCCER() {
      this.$axios
        .get("/admin/getCCER", {
          params: {
            pageNum: 1,
            pageSize: 10,
          },
        })
        .then((response) => {
          this.tableData2 = response.data.data;
          console.log("test:", this.tableData2);
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
      this.$axios.post("admin/uploadMarket", this.market).then((response) => {
        if (response.data.statusCode === 200) {
          this.$message({
            type: "success",
            message: "上传成功!",
          });
          this.dialogFormVisible = false;
          this.getCEA();
          this.getCCER();
        }
      });
    },
    handleFileChange(file) {
      this.excelFile = file.raw; // 保存原始文件对象
      this.$message.info("已选择文件: " + file.name);
    },

    // 点击“确认上传”
    uploadExcelFile() {
      if (!this.excelFile) {
        this.$message.warning("请先选择Excel文件！");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        let allData = [];
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          const uploadData = jsonData.map((row) => {
            let closingPrice = "";
            if (row["product"] === "CEA") {
              closingPrice = String(row["closingPrice"] || "");
            } else if (row["product"] === "CCER") {
              closingPrice = String(row["AveragePrice"] || "");
            }

            return {
              product: row["product"],
              date: this.parseExcelDate(row["date"]),
              higherPrice: String(row["higherPrice"] || ""),
              lowerPrice: String(row["lowerPrice"] || ""),
              closingPrice: closingPrice,
            };
          });

          allData = allData.concat(uploadData);
        });
        console.log("test!!", allData);
        //调用后端批量上传接口
        this.$axios.post("/admin/uploadMarketBatch", allData).then((res) => {
          if (res.data.statusCode === 200) {
            this.$message.success("Excel 批量上传成功！");
          } else {
            this.$message.error("上传失败：" + res.data.message);
          }
        });
      };

      reader.readAsArrayBuffer(this.excelFile);
    },
  },
};
</script>

<style scoped></style>
