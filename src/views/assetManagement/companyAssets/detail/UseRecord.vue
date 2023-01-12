<template>
  <div class="use">
    <el-timeline v-if="movingHistoryList.length">
      <el-timeline-item
        v-for="(activity, index) in movingHistoryList"
        :key="index"
        :timestamp="activity.createTime"
        placement="top"
      >
        <div>
          <p style="font-weight:800">
            {{ businessTypeToText(activity.businessType) }}
              <span 
                v-if="activity.businessType != 7"
                style="font-size:12px;color:#ccc;font-weight:200"
              >
              {{ "流程Id:" + activity.flowId }}
              </span>
          </p>
          <p
            v-if="activity.businessType == 0 || activity.businessType == 2 || activity.businessType == 4 || activity.businessType == 8 || activity.businessType == 6 || activity.businessType == 10"
          >
            {{ 
              activity.creatorName + " ,于 " 
              + formatDateTime(activity.createTime, "YYYY-MM-DD hh: mm: ss") + ", " 
              + businessTypeToText(activity.businessType) + "了 " 
              + activity.amount
              + " 个【" + activity.assetName + "】" 
            }}
          </p>
          <p v-else-if="activity.businessType == 7">
              {{ activity.remark }}
          </p>
          <p v-else>
            {{ 
              activity.creatorName + " ,于 " 
              + formatDateTime(activity.createTime, "YYYY-MM-DD hh: mm: ss") + ", " 
              + businessTypeToText(activity.businessType) + "了 "
              + activity.amount
              + " 个【" + activity.assetName + "】，给" + activity.holderName
            }}
          </p>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div v-else>
      暂无使用记录
    </div>
  </div>
</template>

<script>
import { useRecord } from '@/api/assetManagement/companyAssets'

export default {
  data() {
    return {
      movingHistoryList: []
    }
  },
  created() {
    this.getUseRecord()
  },
  methods: {
    // 使用记录
    getUseRecord() {
      const data = {
        assetId: this.$route.query.id
      }
      useRecord(data).then(res => {
        this.movingHistoryList = res.data
      })
    },
    businessTypeToText(id) {
      // businessType = 0 资产入库
      // businessType = 1 分配资产
      // businessType = 3 借用
      // businessType = 4 维修
      // businessType =5 报废
      let businessTypeText = "入库"
      switch (id) {
          case 0:
              businessTypeText = "入库"
              break
          case 1:
              businessTypeText = "分配"
              break
          case 2:
              businessTypeText = "归还"
              break
          // case 3:
          //   businessTypeText ="维修"
          //  break;
          case 4:
              businessTypeText = "报废"
              break
          case 5:
              businessTypeText = "传递"
              break
          case 6:
              businessTypeText = "借用"
              break
          case 7:
              businessTypeText = "修改"
              break
          case 8:
              businessTypeText = "归还"
              break
          case 10:
              businessTypeText = "报损"
              break
      }
      return businessTypeText
    },
    // 时间转换
    formatDateTime(datetime, formatStr) {
      if (datetime === null || datetime === undefined) {
          return ""
      }
      var dat = new Date(datetime)
      var str = formatStr
      var Week = ["日", "一", "二", "三", "四", "五", "六"]
      str = str.replace(/yyyy|YYYY/, dat.getFullYear())
      str = str.replace(/yy|YY/, dat.getYear() % 100 > 9 ? (dat.getYear() % 100).toString() : "0" + (dat.getYear() % 100))
      str = str.replace(/MM/, dat.getMonth() > 9 ? (dat.getMonth() + 1).toString() : "0" + (dat.getMonth() + 1))
      str = str.replace(/M/g, dat.getMonth() + 1)
      str = str.replace(/w|W/g, Week[dat.getDay()])
      str = str.replace(/dd|DD/, dat.getDate() > 9 ? dat.getDate().toString() : "0" + dat.getDate())
      str = str.replace(/d|D/g, dat.getDate())
      str = str.replace(/hh|HH/, dat.getHours() > 9 ? dat.getHours().toString() : "0" + dat.getHours())
      str = str.replace(/h|H/g, dat.getHours())
      str = str.replace(/mm/, dat.getMinutes() > 9 ? dat.getMinutes().toString() : "0" + dat.getMinutes())
      str = str.replace(/m/g, dat.getMinutes())
      str = str.replace(/ss|SS/, dat.getSeconds() > 9 ? dat.getSeconds().toString() : "0" + dat.getSeconds())
      str = str.replace(/s|S/g, dat.getSeconds())
      return str
    }
  }
}
</script>
