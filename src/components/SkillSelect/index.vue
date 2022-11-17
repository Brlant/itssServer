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
        <i class="el-icon-error" @click="del(item, index)"></i>
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
        <el-input v-model.trim="skill" placeholder="搜索标签"/>
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
  props: ['value'],
  data() {
    return {
      skill: '',
      list: [],
      data: [],
      dataCopy:[]
    }
  },
    watch: {
      // list: {
      //   handler(value) {
      //     console.log(value,'value')
      //     const skillId = value.map(v => v.dictCode)
      //     console.log(11111,skillId)
      //     this.$emit('input', skillId);
      //   },
      //   // immediate: true,
      //   deep: true
      // },
    
      // skill(val) {
      //   console.log(this.data,'sss')
      // },
      skill: {
      immediate: true,
      handler(val) {
        this.data = this.dataCopy.filter((item) => {

          return item.dictLabel.indexOf(val) !== -1;
        })
        
      }
      },
      value: {
        handler(value) {
          this.data.forEach(v1 => {
            value.forEach(v2 => {
              if (v1.dictCode === v2) {
                v1.tick = true
              }
            })
          })
          // this.list = this.data.filter(v => v.tick)
          let list = []
          value.forEach(v1 => {
            this.data.forEach(v2 => {
              if (v1 === v2.dictCode) {
                list.push(v2)
              }
            })
          })
          this.list = list
        },
        immediate: true,
        deep: true
      },
    },
  computed: {
   
    // list() {
    //   return this.dataCopy.filter(v => v.tick)
    // }
  },
  created() {
    this.data = JSON.parse(sessionStorage.getItem('skills'))
     this.dataCopy=this.data
    console.log(this.skillDafault)
    console.log(this.value,'this.value')
    // this.skill=this.value.filter(v => v.tick)
    //  this.list=this.skillDafault
    // this.getData()
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
        this.data = data;
        this.dataCopy=data
        // this.dataCopy.forEach(v1 => {
        //   this.value.forEach(v2 => {
        //     if (v1.dictCode === v2) {
        //       v1.tick = true
        //     }
        //   })
        // })
        this.value.forEach(v1 => {
          this.dataCopy.forEach(v2 => {
            if (v2.dictCode === v1) {
              v2.tick = true
            }
          })
        })
        this.list = this.dataCopy.filter(v => v.tick)
      })
    },
    // 选中技能
    change(index) {
      this.data[index].tick = !this.data[index].tick
      if (this.data[index].tick) {
        this.list.push(this.data[index])
      } else {
        const sign = this.list.findIndex(v => v.dictCode === this.data[index].dictCode)
        if (sign !== -1) {
          this.list.splice(sign, 1)
        }
      }
      this.$emit('input', this.list.map(v => v.dictCode))
    },
    // 删除标签
    del(item, index) {
      this.list.splice(index, 1)
      this.data.forEach(v => v.tick = false)
      this.data.forEach(v1 => {
        this.list.forEach(v2 => {
          if (v1.dictCode === v2.dictCode) {
            v2.tick = true
          }
        })
      })
      this.$emit('input', this.list.map(v => v.dictCode))
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