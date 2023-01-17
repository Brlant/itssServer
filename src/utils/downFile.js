const downFile = (url) => {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.download = 'xx';
  a.href = url;
  document.body.appendChild(a);
  a.click(); 
  document.body.removeChild(a);
  /*
  * download: HTML5新增的属性
  * url: 属性的地址必须是非跨域的地址
   */
};

export default downFile
