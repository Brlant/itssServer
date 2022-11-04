<template>
  <div class="skill_select">
    <div class="skill_list" v-if="list.length">
      <el-tag
        v-for="(item, index) in list"
        :key="index"
        effect="dark"
        :style="{background: matchColor(item.cssClass), borderColor: matchColor(item.cssClass)}"
      >
        {{ item.dictLabel }}
        <i class="el-icon-error" @click="del(index)"></i>
      </el-tag>
    </div>

    <el-popover width="350" placement="bottom-start">
      <div slot="reference" class="reference">
        <div class="empty" v-if="!list.length">
          <i class="el-icon-circle-plus"></i>
          添加技能标签
        </div>
        <div class="fill" v-else>
          <i class="el-icon-circle-plus"></i>
        </div>
      </div>

      <div class="content">
        <el-input v-model.trim="skill" placeholder="搜索标签" />
        <div class="list">
          <div 
            class="item"
            v-for="(item, index) in data"
            :key="index"
            @click="change(index)"
          >
            <div class="name">
              <span class="circle" :style="{background: matchColor(item.cssClass)}"></span>
              <span class="text">{{ item.dictLabel }}</span>
            </div>
            <i :class="['el-icon-check', {tick: item.tick}]"></i>
          </div>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import { dictData } from '@/api/dataDict'
import { color } from '@/components/ColorSelect/options'

export default {
  data() {
    return {
      skill: '',
      data: [],
    }
  },
  computed: {
    list() {
      return this.data.filter(v => v.tick)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    // 技能列表
    getData() {
      const params = {
        dictType: 'skill_type',
        status: '0'
      }
      dictData(params).then(res => {
        let data = res.rows
        data.forEach(v => {
          v.tick = false
        })
        this.data = data
      })
    },
    // 选中技能
    change(index) {
      this.data[index].tick = !this.data[index].tick
    },
    // 删除标签
    del(index) {
      this.data[index].tick = false
    },
    // 匹配颜色
    matchColor(cssClass) {
      if (cssClass) {
        return color.find(v => v.cssClass === cssClass).color
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.skill_select {
  display: flex;
}
.reference {
  .empty {
    display: flex;
    align-items: center;
    color: rgb(91,142,255);
    cursor: pointer;
    .el-icon-circle-plus {
      margin-right: 5px;
    }
  }
  .fill {
    .el-icon-circle-plus {
      color: #606266;
      cursor: pointer;
    }
  }
}
.content {
  padding: 10px 10px 0 10px;
  .list {
    margin-top: 5px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 0;
      cursor: pointer;
      &:hover {
        background: rgba(91,142,255, .1);
      }
      .name {
        display: flex;
        align-items: center;
        .circle {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 8px;
        }
      }
      .el-icon-check {
        color: rgb(91,142,255);
        visibility: hidden;
      }
      .tick {
        visibility: visible;
      }
    }
  }
}
.el-icon-error {
  margin-left: 3px;
  display: none;
}
.el-tag {
  margin-right: 10px;
  border-radius: 14px;
  cursor: pointer;
  &:hover .el-icon-error {
    display: inline;
  }
}
</style>