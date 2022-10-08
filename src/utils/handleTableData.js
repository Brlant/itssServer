function handleTableData(row, index) {
    let res = {
        show: false
    }
    switch (index) {
        case 0:
            res.content = row.username
            break;
        case 1:
            res.content = row.deptName
            break;
        case 2:
            res.content = row.scheduleWorkTime
            break;
        case 3:
            res.content = row.approvedWorkTime
            break;
        case 4:
            res.content = row.approvalPendingWorkTime
            break;
        default:
            const data = row.timeTrackList[index - 5]
            // // res.content = data.approvedWorkTime + ' | ' + data.approvalPendingWorkTime +  ' | ' + data.approvalRejectionWorkTime
            // if(!data.approvedWorkTime){
            //     data.approvedWorkTime=''
            // }else if(!data.approvalPendingWorkTime){}
            // res.content = `<span style="color:grey">${data.approvedWorkTime}</span><span style="color:#333"> ${data.approvalPendingWorkTime}</span><span style="color:red">  ${data.approvalRejectionWorkTime}</span>`
            if (data.approvalPendingWorkTime) {
                res.show = true
            }
            res.workDate=data
            res.approvedWorkTime = data.approvedWorkTime
            res.approvalPendingWorkTime = data.approvalPendingWorkTime
            res.approvalRejectionWorkTime = data.approvalRejectionWorkTime
            break;
    }
    return res
}

export default handleTableData