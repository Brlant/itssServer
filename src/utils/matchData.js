function matchData(obj, arr) {
  let res = {}
  for (let i in obj) {
    arr.forEach(item => {
      if (i === item.name) {
        res[i] = obj[i]
      }
    })
  }
  return res
}

export default matchData
