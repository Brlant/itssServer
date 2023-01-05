function findItemById(id, list) {
  let res = list.find(item => item.id == id)
  if (res) {
    return res
  } else {
    for (let i=0; i<list.length; i++) {
      if (list[i].children instanceof Array && list[i].children.length > 0) {
        res = findItemById(id, list[i].children)
        if(res){
          return res
        }
      }
    }
    return null
  }
}

export default findItemById
