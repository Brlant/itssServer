<template>
  <div class="approval">
    <div class="header">
      <span
        @click="check(0)"
        :class="{ curren: n == 0 }"
        style="cursor: pointer"
        >精简模式</span
      >
      <span>|</span>
      <span
        @click="check(1)"
        :class="{ curren: n == 1 }"
        style="cursor: pointer"
        >详情模式</span
      >
    </div>
    <div>
      <!-- 精简模式 -->
      <compact-mode
        @parentSearch="search"
        v-if="n == 0"
        :childData="parentData"
        :queryId="queryId"
      ></compact-mode>
      <details-mode
        v-else
        :detailDatas="detailData"
        @datailParent="detailMode"
         :queryId="queryId"
         :start='start'
         :end='end'
      ></details-mode>
      <!-- 详情模式 -->
    </div>
  </div>
</template>
<script>
import compactMode from "./compactMode";
import detailsMode from "./detailsMode";
import moment from "moment";
import "moment/locale/zh-cn";
import {
  approvalItems,
  approvalMonth,
  listByUserId,
} from "@/api/workproject/approval.js";
export default {
  components: {
    compactMode,
    detailsMode,
  },
  data() {
    return {
      n: 0,
      parentData: {},
      query: {},
      queryDetail: {},
      detailData: [],
      queryId: [],
      beginDate: "",
      endDate: "",
      start:'',
      end:''
    };
  },
  created() {
    this.query = { time: moment().format("YYYY-MM-DD"), name: "" };
    let weekOfday = moment().format("E");
    this.beginDate = moment()
      .subtract(weekOfday - 1, "days")
      .format("YYYY-MM-DD");

    this.endDate = moment()
      .add(7 - weekOfday, "days")
      .format("YYYY-MM-DD");
    console.log(this.beginDate);
    this.queryDetail = {
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      status: 0,
    };
    this.searchTest(this.query);
    this.listId();
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    listId() {
       this.queryId=[]
      let data = {
        userId: this.$store.state.user.user.userId,
        startDate: this.beginDate,
        endDate: this.endDate,
      };
      listByUserId(data).then((res) => {
        res.data.forEach((v) => {
          this.queryId.push(v.projectId);
        });
        console.log("this.queryId", this.queryId);
      });
    },
    check(index) {
      if (index == 0) {
        this.n = 0;
        this.searchTest(this.query);
        let weekOfday = moment().format("E");
        this.beginDate = moment()
          .subtract(weekOfday - 1, "days")
          .format("YYYY-MM-DD");

        this.endDate = moment()
          .add(7 - weekOfday, "days")
          .format("YYYY-MM-DD");
        this.listId();
      } else {
        this.n = 1;
        this.detailMode(this.queryDetail);
        this.beginDate=this.queryDetail.startDate
         this.endDate=this.queryDetail.endDate
        //  this.listId();
      }
    },
    //精简模式
    searchTest({ time, name }) {
      let data = {
        projectName: name,
        workDate: time,
      };

      approvalItems(data).then((res) => {
        if (res.data) {
          this.parentData = res.data;
        }
      });
    },
    search(val) {
      let weekOfday = moment(val.time).format("E");
      console.log(weekOfday, "sssss");
      this.beginDate = moment(val.time)
        .subtract(weekOfday - 1, "days")
        .format("YYYY-MM-DD");

      this.endDate = moment(val.time)
        .add(7 - weekOfday, "days")
        .format("YYYY-MM-DD");
      this.searchTest(val);
      this.listId();
    },
    //详情模式
    detailMode(date) {
      console.log(date, "ddddd");
      this.queryDetail = date;
        this.beginDate=this.queryDetail.startDate
         this.endDate=date.endDate
           this.start=date.startDate
         this.end=this.queryDetail.endDate
         this.listId();
      approvalMonth(date).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            this.detailData = res.data;
          }
        }
      });
    },
  },
};
</script>
<style lang='scss' scope>
.approval {
  .header {
    margin-bottom: 10px;
    padding: 0 10px;
    span {
      margin-right: 10px;
    }
    .curren {
      color: #3d7dff;
    }
  }
}
</style>
