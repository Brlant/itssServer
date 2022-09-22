import { unitOrderList } from '../../../api/order/import'
import { userUnitList } from '../../../api/system/unit'
export default {
  data() {
    return {
    //  发货单位
      filterSenderList:[],
      // 收货单位
      consigneeList:[],
      //承运商
      carrierList:[],
    };
  },
  computed: {

  },
  created() {
    this.queryFilterSender()
    this.queryFilterReceive()
    // this.queryCarrierList()
  },
  methods: {
    //发货单位
    queryFilterSender(query){
      let params = {
        pageNum:1,
        pageSize:200,
        unitName:query,
        unitStatus:0
      }
      userUnitList(params,0).then(res=>{
        this.filterSenderList = res.rows
        if(res.rows && res.rows.length == 1){
          
        }
      })
      // new unitOrderList().unitList(params).then(res=>{
      //   this.filterSenderList = res.rows
      // })
    },
    queryFilterReceive(query){
      let params = {
        pageNum:1,
        pageSize:200,
        unitName:query,
        unitStatus:0
      }
      userUnitList(params,1).then(res=>{
        this.consigneeList = res.rows
      })
    },
    //承运商
    // queryCarrierList(query){
    //   let params = {
    //     pageNum:1,
    //     pageSize:1000,
    //     carrierName:query,
    //     state:0
    //   }
    //   new unitOrderList().carrierList(params).then(res=>{
    //     this.carrierList = res.rows
    //   })
    // }
  }
};
