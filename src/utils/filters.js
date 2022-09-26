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
export default {
  filterProjectStatus,
  formatDate
}
