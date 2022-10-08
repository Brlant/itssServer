const filterProjectStatus = function (val) {
  const statusMap = {
    1: "进行中",
    2: "未开始",
    3: "已结束",
    4: "已终止"
  }
  return statusMap[val]
}
const formatDate = function (dateString) {
  if (dateString === null || dateString === undefined) {
    return ""
  }
  dateString = parseInt(dateString)
  var date = new Date(dateString);
  var YY = date.getFullYear();
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + "/" + MM + "/" + DD;
}
const toObject = function(stringArr,type){
  let arrTemp =  stringArr//JSON.parse(stringArr)
 if(stringArr){
    if(type=='plan'){
      return arrTemp.planLoad
    }
    if(type=='real'){
      return arrTemp.realLoad
    }
 }
  
}
// 修改范围（1.基础信息,2.成员安排)
const toUpdateScope=((val)=>{
  const sourceMap={
    1:'基础信息',
    2:'成员安排'
  }
  return sourceMap[val]
})
// 状态（1.待审核,2.已通过,3.已拒绝)
const toStatus=((val)=>{
  const sourceMap={
    1:'待审核',
    2:'已通过',
    2:'已拒绝',
  }
  return sourceMap[val]
})
export default {
  filterProjectStatus,
  formatDate,
  toObject,
  toUpdateScope,
  toStatus
}
