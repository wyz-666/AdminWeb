<template>
  <el-row :gutter="12">
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none;">
        <el-button type="primary" @click="dialogFormVisible = true">上传</el-button>
        <el-col :span="8">
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">CEA历史行情</div>
          <el-table :data="tableData1" border style="width: 100%" height="500px" @sort-change="handleSortChange">
            <el-table-column prop="date" label="日期" width="100"   sortable="custom">
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
          <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">CCER历史行情</div>
          <el-table :data="tableData2" border style="width: 100%" height="500px" @sort-change="handleSortChange">
            <el-table-column prop="date" label="日期" width="100"   sortable="custom">
            </el-table-column>
            <el-table-column prop="closingPrice" label="成交价" width="120">
            </el-table-column>
          </el-table>
        </el-col>
        <el-dialog title="上传大盘信息" v-model="dialogFormVisible" width="30%">
          <el-form :model="market">
            <el-form-item label="日期" :label-width="formLabelWidth" >
              <el-date-picker v-model="market.date" type="date" placeholder="Pick a date" value-format="YYYY/MM/DD" />
            </el-form-item>
            <el-form-item label="产品" :label-width="formLabelWidth">
              <el-select v-model="market.product" placeholder="please select a product">
                <el-option label="CEA" value="CEA" />
                <el-option label="CCER" value="CCER" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="market.product === 'CEA'" label="最高价(元/吨)" :label-width="formLabelWidth">
              <el-input v-model="market.higherPrice" />
            </el-form-item>
            <el-form-item v-if="market.product === 'CEA'" label="最低价(元/吨)" :label-width="formLabelWidth">
              <el-input v-model="market.lowerPrice" />
            </el-form-item>
            <el-form-item v-if="market.product === 'CEA'" label="收盘价(元/吨)" :label-width="formLabelWidth">
              <el-input v-model="market.closingPrice" />
            </el-form-item>
            <el-form-item v-if="market.product === 'CCER'" label="成交价(元/吨)" :label-width="formLabelWidth">
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
      tableData2: null,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      market: {
        date: '',
        higherPrice: '',
        lowerPrice: '',
        closingPrice: '',
        product: ''
      },
      uuid: '',

    }
  },
  mounted() {
    this.getCEA();
    this.getCCER();
  },
  methods: {
    getCEA() {
      this.$axios.get("/admin/getCEA", {
        params: {
          pageNum: 1,
          pageSize: 10,
        }
      }).then(response => {
        this.tableData1 = response.data.data;
        console.log("test:", this.tableData1);
      })
    },
    getCCER() {
      this.$axios.get("/admin/getCCER", {
        params: {
          pageNum: 1,
          pageSize: 10,
        }
      }).then(response => {
        this.tableData2 = response.data.data;
        console.log("test:", this.tableData2);
      })
    },
    handleSortChange({ prop, order }) {
      if (order === 'descending') {
        this.tableData1.sort((a, b) => new Date(b[prop]) - new Date(a[prop]))
      } else if (order === 'ascending') {
        this.tableData1.sort((a, b) => new Date(a[prop]) - new Date(b[prop]))
      }
    },
    upload() {
      console.log("market:", this.market)
      this.$axios.post('admin/uploadMarket', this.market).then((response) => {
        if (response.data.statusCode === 200) {
          this.$message({
            type: 'success',
            message: '上传成功!'
          });
          this.dialogFormVisible = false;
          this.getCEA();
          this.getCCER();
        }
      })
    },
  }
}
</script>

<style scoped></style>