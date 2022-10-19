<template>
  <div class="menuTree">
    <tree-transfer
      :title="title"
      :from_data="fromData"
      :to_data="toData"
      pid="parentId"
      :defaultProps="{ label: 'label' }"
      @addBtn="add"
      @removeBtn="remove"
      :mode="mode"
      height="480px"
      filter
      openAll
      :placeholder="placeholder"
    >
    </tree-transfer>
    <!-- , children: 'children' -->
    <!-- 标题 类型：Array 必填：false 默认：["源列表", "目标列表"]
                搜索提示语
                源数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
                目标数据 类型：Array 必填：true 补充：数据格式同element-ui tree组件，但必须有id和pid
                配置项-同el-tree中props 必填： false 补充：用法和el-tree的props一样
                点击添加按钮时触发的事件 回调参数：function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                点击移除按钮时触发的事件 回调参数：function(fromData,toData,obj),树形穿梭框transfer模式分别为1.移动后左侧数据，2.移动后右侧数据，3.移动的节点keys、nodes、halfKeys、halfNodes对象；通讯录addressList模式时返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                设置模式，字段可选值为transfer|addressList 类型：String 必填：false 补充：mode默认为transfer模式，即树形穿梭框模式，可配置字段为addressList改为通讯录模式，通讯录模式时按钮不可自定义名字，如要自定义标题名在title数组传入四个值即可，addressList模式时标题默认为通讯录、收件人、抄送人、密送人
                高度 类型：String 必填：false 默认：100%
                高度 类型：String 必填：false 默认：320px
                是否开启筛选功能 类型：Boolean 必填：false
                *****自定义搜索方法******
                是否默认展开全部 类型：Boolean 必填：false -->
  </div>
</template>

<script>
import treeTransfer from "el-tree-transfer";
export default {
  name: "menuTree",
  components: { treeTransfer },
  props: {
    // el-tree node-key 必须唯一
    node_key: {
      type: String,
      default: "id",
    },
    // 自定义 pid参数名，因为后端给的参数名为parentId
    pid: {
      type: String,
      default: "parentId",
    },
    fromData: {
      type: Array,
      default() {
        return [];
      },
    },
    toData: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    toData: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit("getRightData", val);
      },
    },
  },
  data() {
    return {
      // fromData:[],
      // toData:[],
      title: ["待选菜单", "已选菜单"],
      placeholder: "请输入关键字",
      mode: "transfer",
      disabled: false, // 是否禁止
      temData: [], // 临时数据(存放全部树数据)
      checkedKeys: [], //已勾选的id数组（右侧树的id数组）
      nodeKey: "id",
    };
  },
  mounted() {
    console.log(this.$props.pid)
  },
  methods: {
    
    // 监听穿梭框组件添加
    add(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", this.fromData);
      console.log("toData:", this.toData);
      console.log("obj:", obj);
    },
    // 监听穿梭框组件移除
    remove(fromData, toData, obj) {
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      console.log("fromData:", fromData);
      console.log("toData:", toData);
      console.log("obj:", obj);
    },
    // 右侧目标数据勾选事件
    rightCheck(nodeObj, treeObj, checkAll) {
      console.log(nodeObj, "nodeObj");
      console.log(treeObj, "treeObj");
      console.log(checkAll, "checkAll");
    },
  },
};
</script>
<style lang="scss">
.menuTree .wl-transfer .transfer-title {
  display: none;
}
.menuTree .wl-transfer .transfer-main {
  height: 100%;
}
.menuTree {
  width: 100%;
}
</style>
