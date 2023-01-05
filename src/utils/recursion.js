function recursion(array, id) {
  if(array) {
    for(var i = 0; i < array.length; i++) {
      if(array[i].id == id) {
        var items = [] ;
        items.unshift(id) 
        return items;
      } else {
        if(array[i].children) {
          var res = recursion(array[i].children, id);                
          if(res) {
            res.unshift(array[i].id);
            return res ;
          }
        }
      }
    }
  }
}

export default recursion
