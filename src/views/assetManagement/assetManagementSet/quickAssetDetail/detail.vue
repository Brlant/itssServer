<template>
  <div class="detail">
    <header>
      <div 
        class="left" 
        @click="$router.push('/assetManagement/assetManagementSet/quickAssetDetailIndex')"
      >
        <i class="el-icon-arrow-left"></i>
        <span>快速填充模板详情</span>
      </div>
      <span class="edit" @click="goEdit">编辑</span>
    </header>
    <main>
      <el-row>
        <el-col :span="6">
          <div class="item">
            <span class="star">*</span>
            <span class="label">模板名称：</span>
            <span class="value">{{ info.templateName }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="item">
            <span class="star">*</span>
            <span class="label">资产类型：</span>
            <span class="value">{{ info.assetTypeName }}</span>
          </div>
        </el-col>
      </el-row>
      <div class="section">
        <div class="heading">
          <span class="bar"></span>
          <b>基础信息</b>
        </div>
        <el-row>
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
        </el-row>
      </div>
      <div class="section">
        <div class="heading">
          <span class="bar"></span>
          <b>详细信息</b>
        </div>
        <el-row>
          <!-- 动态渲染展示条目 -->
          <el-col
            v-for="(item, index) in list"
            :key="index"
            :span="span"
          >
            <div class="item">
              <span class="label">
                {{ item.label }}：
              </span>
              <span class="value">
                {{ info[item.name] }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </main>
  </div>
</template>

<script>
import { 
  searchDetail,
  queryAsset
} from '@/api/assetManagement/quickAssetDetail'
import findItemById from '@/utils/findItemById'
import { detailInformation } from './option'

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
      searchDetail(this.id).then(res => {
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
    // 进入编辑
    goEdit() {
      this.$router.push({
        path: '/assetManagement/assetManagementSet/quickAssetDetailedit',
        query: {
          id: this.id
        }
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
.detail {
  header {
    background: #fff;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    .left {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .edit {
      cursor: pointer;
      color: rgb(76,150,196);
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
</style>
