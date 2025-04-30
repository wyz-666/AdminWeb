<template>
  <el-row :gutter="12">
    <el-date-picker v-model="date" type="date" placeholder="选择报价提交截止时间" :size="size" style="margin-left: 30px;" />
    <el-button type="primary" @click="getAVG">获得当月CEA报价情况</el-button>
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none;">
        <el-table :highlight-current-row="true" :data="tableData" border style="width: 100%;">
          <el-table-column prop="product" label="产品" width="100">
          </el-table-column>
          <el-table-column prop="companyType" label="企业类型" width="100">
          </el-table-column>
          <el-table-column prop="lowerPrice" label="最低价" width="100">
          </el-table-column>
          <el-table-column prop="higherPrice" label="最高价" width="100">
          </el-table-column>
          <el-table-column prop="price" label="单价" width="100">
          </el-table-column>
          <el-table-column prop="txVolume" label="交易量" width="100">
          </el-table-column>
          <el-table-column prop="CreatedAt" label="提交时间" width="180">
            <template #default="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ formatDate(scope.row.CreatedAt) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="applicableTime" label="报价适用时间" width="100">
          </el-table-column>
        </el-table><br><br>
      </el-card>
      <el-card shadow="always" style="border-top: none;">
        <div style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">各类型用户平均报价</div>
        <el-table :data="tableData1" border style="width: 100%">
          <el-table-column prop="companyType" label="企业类型" width="100" />
          <el-table-column prop="type" label="账户类型" width="100">
            <template #default="scope">
              <el-tag size="mini" type="success" v-if="scope.row.type === 1">管理员</el-tag>
              <el-tag size="mini" v-if="scope.row.type === 3">普通账号</el-tag>
              <el-tag size="mini" type="danger" v-if="scope.row.type === 2">会员账号</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="avgLower" label="平均最低价" width="100" />
          <el-table-column prop="avgHigher" label="平均最高价" width="100" />
          <el-table-column prop="avgBoth" label="平均价" width="100" />
        </el-table>
        <el-button type="primary" @click="dialogFormVisible = true">提交预测值</el-button>
      </el-card>
      <el-dialog title="上传大盘信息" v-model="dialogFormVisible" width="30%">
        <el-form :model="ratio">
          <el-form-item label="控排企业" :label-width="formLabelWidth">
            <el-input v-model="ratio.ratio1" />
          </el-form-item>
          <el-form-item label="会员账户" :label-width="formLabelWidth">
            <el-input v-model="ratio.ratio2" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="uploadExpectation">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-col>

  </el-row>
</template>

<script>
import dayjs from 'dayjs'
export default {
  name: "OrderList",
  data() {
    return {
      tableData: null,
      tableData1: null,
      dialogFormVisible: false,
      date: '',
      currentPage: 1,
      size: 5,
      total: '',
      ratio: {
        ratio1: 0,
        ratio2: 0,
      },
    }
  },
  mounted() {
    // this.queryAvg();
  },
  methods: {
    getAVG() {
      let dateString = dayjs(this.date).format('YYYY-MM-DD HH:mm:ss')
      this.$axios.get('/admin/getMonthQuotation', {
        params: {
          nowTime: dateString,
          product: 'CEA'
        }
      }).then((response) => {
        this.tableData = response.data.data;
        console.log("test1:", this.tableData)
      }).catch((error) => {
        console.log(error);
      })
      console.log('date:', dateString)
      this.$axios.get('/admin/getNewMonthAvg', {
        params: {
          nowTime: dateString,
          product: 'CEA'
        }
      }).then((response) => {
        this.tableData1 = response.data.data;
        console.log("test2:", this.tableData1)
      }).catch((error) => {
        console.log(error);
      })
    },
    uploadExpectation() {
      console.log('ratio', this.ratio)
      console.log('tableData1', this.tableData1)
    },
    formatDate(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style scoped></style>