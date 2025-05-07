<template>
  <el-row :gutter="12">
    <el-date-picker v-model="date" type="date" placeholder="选择报价提交截止时间" :size="size" style="margin-left: 30px;" />
    <el-button type="primary" @click="getAVG">获得当月CEA报价情况</el-button>
    <el-button type="success" @click="exportExcel" style="margin-left: 10px;">导出CEA当月报价及均值</el-button>
    <el-col :span="24">
      <el-card shadow="never" style="border-top: none;">
        <el-table :highlight-current-row="true" :data="tableData" border style="width: 100%;">
          <el-table-column prop="product" label="产品名称" width="100">
          </el-table-column>
          <el-table-column prop="uuid" label="报价人ID" width="120">
          </el-table-column>
          <el-table-column prop="lowerPrice" label="最低价" width="100">
          </el-table-column>
          <el-table-column prop="higherPrice" label="最高价" width="100">
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
      <el-dialog title="提交角色比例" v-model="dialogFormVisible" width="30%">
        <el-form :model="ratio">
          <el-form-item label="控排企业" :label-width="formLabelWidth">
            <el-input v-model="ratio.ratio1" placeholder="请输入0.00-1.00" />
          </el-form-item>
          <el-form-item label="会员账户" :label-width="formLabelWidth">
            <el-input v-model="ratio.ratio2" placeholder="请输入0.00-1.00"/>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="uploadRatio">查看结果</el-button>
          </span>
        </template>
      </el-dialog>
      <el-dialog title="确认预测结果" v-model="dialogFormVisible1" width="50%">
        <el-descriptions title="比例" direction="vertical" :column="4" border>
          <el-descriptions-item label="控排企业会员账户">{{ r1 }}</el-descriptions-item>
          <el-descriptions-item label="控排企业普通账户">{{ r2 }}</el-descriptions-item>
          <el-descriptions-item label="非控排企业会员账户">{{ r3 }}</el-descriptions-item>
          <el-descriptions-item label="非控排企业普通账户">{{ r4 }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions title="均值结果" direction="vertical" :column="3" border>
          <el-descriptions-item label="买入价格">{{ p1 }}</el-descriptions-item>
          <el-descriptions-item label="卖出价格">{{ p2 }}</el-descriptions-item>
          <el-descriptions-item label="中间价格">{{ p3 }}</el-descriptions-item>
        </el-descriptions>
        <el-date-picker v-model="month" type="month" placeholder="选择月份" />
        <template #footer>
          <span class="dialog-footer">
            <el-button size="mini" @click="dialogFormVisible1 = false">取 消</el-button>
            <el-button size="mini" type="primary" @click="uploadExpectation">确认提交</el-button>
          </span>
        </template>
      </el-dialog>
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
      tableData1: null,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      date: '',
      currentPage: 1,
      size: 5,
      total: '',
      ratio: {
        ratio1: '',
        ratio2: '',
      },
      r1: 0,
      r2: 0,
      r3: 0,
      r4: 0,
      p1: 0,
      p2: 0,
      p3: 0,
      month: '',
      al1: 0,
      al2: 0,
      al3: 0,
      al4: 0,
      ab1: 0,
      ab2: 0,
      ab3: 0,
      ab4: 0,
      ah1: 0,
      ah2: 0,
      ah3: 0,
      ah4: 0,
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
        if (!this.tableData || this.tableData.length === 0) {
          this.$message.warning('当月暂无报价');
          return;
        }
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
        this.tableData1.forEach(item => {
          console.log(item)
          if (item.companyType === "控排企业" && item.type === 2) {
            this.al1 = item.avgLower
            this.ah1 = item.avgHigher
            this.ab1 = item.avgBoth
          }
          if (item.companyType === "控排企业" && item.type === 3) {
            this.al2 = item.avgLower
            this.ah2 = item.avgHigher
            this.ab2 = item.avgBoth
          }
          if (item.companyType === "非控排企业" && item.type === 2) {
            this.al3 = item.avgLower
            this.ah3 = item.avgHigher
            this.ab3 = item.avgBoth
          }
          if (item.companyType === "非控排企业" && item.type === 3) {
            this.al4 = item.avgLower
            this.ah4 = item.avgHigher
            this.ab4 = item.avgBoth
          }
        });
      }).catch((error) => {
        console.log(error);
      })
    },
    uploadRatio() {
      console.log('ratio', this.ratio)
      console.log('tableData1', this.tableData1)
      this.dialogFormVisible = false
      this.dialogFormVisible1 = true
      this.r1 = (this.ratio.ratio1 * this.ratio.ratio2).toFixed(2);
      this.r2 = (this.ratio.ratio1 * (1 - this.ratio.ratio2)).toFixed(2);
      this.r3 = ((1 - this.ratio.ratio1) * this.ratio.ratio2).toFixed(2);
      this.r4 = ((1 - this.ratio.ratio1) * (1 - this.ratio.ratio2)).toFixed(2);
      this.p1 = (this.r1 * this.al1 + this.r2 * this.al2 + this.r3 * this.al3 + this.r4 * this.al4).toFixed(2);
      this.p2 = (this.r1 * this.ah1 + this.r2 * this.ah2 + this.r3 * this.ah3 + this.r4 * this.ah4).toFixed(2);
      this.p3 = (this.r1 * this.ab1 + this.r2 * this.ab2 + this.r3 * this.ab3 + this.r4 * this.ab4).toFixed(2);
      // console.log("r2",this.r2)
    },
    uploadExpectation() {
      console.log('month:', dayjs(this.month).format('YYYY年M月'))
      // this.$axios.post('/admin/submitStats', {
      //   product: 'CEA',
      //   type: 'month',
      //   date: dayjs(this.month).format('YYYY年M月'),
      //   lowerPrice: this.p1,
      //   higherPrice: this.p2,
      //   midPrice: this.p3
      // }).then((response) => {
      //   if (response.data.statusCode === 200) {
      //     this.$message({
      //       type: 'success',
      //       message: '上传成功!'
      //     });
      //   }
      // })
      this.dialogFormVisible1 = false;
      console.log("test",)
    },
    formatDate(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm:ss')
    },
    exportExcel() {
      if (!this.tableData || this.tableData.length === 0) {
        this.$message.warning('没有数据可导出');
        return;
      }
      // 处理第一个表格的数据（表格一）
      const exportData = this.tableData.map(item => ({
        '用户编号': item.uuid,
        '产品类型': item.product,
        '买入价格': item.lowerPrice,
        '卖出价格': item.higherPrice,
        '交易量': item.txVolume,
        '适用时间': item.applicableTime,
      }));
      // 处理第一个表格的数据（表格二）
      const exportData1 = this.tableData1.map(item => ({
        '企业类型': item.companyType,
        '用户类型': item.type,
        '买入价格均值': item.avgLower,
        '卖出价格均值': item.avgHigher,
        '中间价格均值': item.avgBoth,
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
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // 4. 保存文件
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, `CEA当月报价及均值-${dayjs(this.date).format('YYYY-MM-DD')}.xlsx`);
    }
  }
}
</script>

<style scoped></style>