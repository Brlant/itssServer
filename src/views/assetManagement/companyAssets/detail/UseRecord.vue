<template>
  <div class="use">
    <el-timeline>
      <el-timeline-item
        v-for="(item, index) in list"
        :key="index"
        :timestamp="item.createTime"
        placement="top"
      >
        
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
import { useRecord } from '@/api/assetManagement/companyAssets'

export default {
  data() {
    return {
      list: []
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
        this.list = res.data
      })
    }
  }
}
</script>
