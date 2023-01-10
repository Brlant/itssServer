<template>
  <div class="wrap">
    <header>
      <div 
        class="left" 
        @click="$router.push('/assetManagement/companyAssets')"
      >
        <i class="el-icon-arrow-left"></i>
        <span>资产信息</span>
      </div>
      <div class="btns">
        <div class="item">
          <span>维修</span>
        </div>
        <div class="item">
          <span>报废</span>
        </div>
        <div class="item">
          <span>编辑</span>
        </div>
        <div class="item">
          <span>打印条码</span>
        </div>
      </div>
    </header>
    <main>
      <div class="section">
        <div class="heading">
          <span class="bar"></span>
          <b>基础信息</b>
        </div>
        <el-row>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产编号：</span>
              <span class="value">{{ info.assetId }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产条码：</span>
              <span class="value">{{ info.assetCode }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">财务编号：</span>
              <span class="value">{{ info.financialNo }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产名称：</span>
              <span class="value">{{ info.assetName }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">资产类型：</span>
              <span class="value">{{ info.assetTypeName }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">品牌：</span>
              <span class="value">{{ info.brand }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">型号：</span>
              <span class="value">{{ info.model }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">保修期：</span>
              <span class="value">{{ info.maintenanceTime }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">购入时间：</span>
              <span class="value">{{ formatDate(info.purchasingDate) }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">税后价格：</span>
              <span class="value">{{ info.afterTaxPrice }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="star">*</span>
              <span class="label">数量：</span>
              <span class="value">{{ info.amount }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">存放地点：</span>
              <span class="value">{{ info.storageAddress }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">归属部门：</span>
              <span class="value">{{ info.departmentName }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">保管员：</span>
              <span class="value">{{ info.keeper }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">备注：</span>
              <span class="value">{{ info.remark }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="section">
        <div class="heading">
          <span class="bar"></span>
          <b>折旧信息</b>
        </div>
        <el-row>
          <el-col :span="span">
            <div class="item">
              <span class="label">折旧年限：</span>
              <span class="value">{{ info.depreciableLife }}年</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">资产净值：</span>
              <span class="value">{{ info.surplusValue }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">每月折旧：</span>
              <span class="value">{{ info.monthDepreciation }}</span>
            </div>
          </el-col>
          <el-col :span="span">
            <div class="item">
              <span class="label">累计折旧：</span>
              <span class="value">{{ info.depreciation }}</span>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- tab切换部分 -->
      <div class="tabs">
        
      </div>
    </main>
  </div>
</template>

<script>
import { assetDetail } from '@/api/assetManagement/companyAssets'
import { queryAsset } from '@/api/assetManagement/quickAssetDetail'
import findItemById from '@/utils/findItemById'
import { detailInformation } from '../options'

export default {
  data() {
    return {
      span: 6,
      id: this.$route.query.id,
      info: {},
      list: []
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    // 详情
    getDetail() {
      assetDetail(this.id).then(res => {
        this.info = res.data
        queryAsset().then(resp => {
          // 动态渲染展示条目
          const { assetTemplate } = findItemById(this.info.assetTypeId, resp.data)
          let list = []
          detailInformation.forEach(item => {
            for (let i in assetTemplate) {
              if (item.status === i) {
                if (assetTemplate[i] === 1) {
                  list.push(item)
                }
              }
            }
          })
          this.list = list
        })
      })
    },
    // 时间格式
    formatDate(date) {
      if (date) {
        return date.substr(0, 10)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  header {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    .left {
      cursor: pointer;
    }
    .btns {
      display: flex;
      align-items: center;
      .item {
        padding: 0 10px;
        border-right: 1px solid #037dff;
        line-height: 1;
        &:last-child {
          border-right: 0;
        }
        span {
          color: #037dff;
          cursor: pointer;
        }
      }
    }
  }
  main {
    background: #fff;
    padding: 10px;
    font-size: 14px;
    .item {
      padding: 10px;
      .star {
        color: #F52551;
      }
      .label {
        color: #8294AD;
      }
    }
    .section {
      margin-top: 8px;
    }
    .heading {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .bar {
        width: 4px;
        height: 15px;
        background: #333;
        margin-right: 8px;
      }
      b {
        font-size: 15px;
      }
    }
  }
}
.el-row {
  display: flex;
  flex-wrap: wrap;
}
</style>
