<template>
  <div class="maintenance">
    <el-timeline v-if="maintenanceList.length">
      <el-timeline-item 
        v-for="(activity, index) in maintenanceList" 
        :key="index" 
        placement="top"
        :timestamp="activity.createTime"
      >
        <div>
          <p>
            {{ activity.creatorName + " ,于 " 
              + formatDateTime(activity.createTime, "YYYY-MM-DD hh: mm: ss") + ", 送修了 " 
              + activity.amount 
              + " 个【" + activity.assetName + "】" 
            }}
          </p>
          <p>
            维修内容：
            {{ activity.maintenanceInfo ? activity.maintenanceInfo : "无" }}
          </p>
          <p>
            维修反馈：
            {{ activity.feedback ? activity.feedback : "无" }}
          </p>
          <p>
            维修金额：
            {{ activity.maintenancePrice ? activity.maintenancePrice + "元" : "无" }}
          </p>
          <p>
            维修备注：
            {{ activity.remark ? activity.remark : "" }}
          </p>
        </div>
      </el-timeline-item>
    </el-timeline>
    <div v-else style="font-size: 14px">
      暂无维修记录
    </div>
  </div>
</template>

<script>
import { maintainRecord } from '@/api/assetManagement/companyAssets'

export default {
  data() {
    return {
      maintenanceList: []
    }
  },
  created() {
    this.getMaintainRecord()
  },
  methods: {
    // 维修记录
    getMaintainRecord() {
      const data = {
        assetId: this.$route.query.id
      }
      maintainRecord(data).then(res => {
        this.maintenanceList = res.data
      })
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
