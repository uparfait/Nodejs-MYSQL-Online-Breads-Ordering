(async () =>{
   // load products

   const viewer = axios;
   const b = window;
   let {data:isl} = await viewer.get("/customer/ils");
   if(isl == 1){
      document.querySelector(".btn-control").innerHTML = `
      <button><a href="/customer/logout"><b>Logout</b></a></button>`;
   }else{
      document.querySelector(".btn-control").innerHTML = `
      <button><a href="/customer/signin"><b>Login</b></a></button>
      <button><a href="/customer/signup"><b>Register</b></a></button>`;
   }

   let {
      data: products
   } = await viewer.get("/customer/breads");
   if(products.err) {
      b.location = "/error";
   }

   let breads = products.result.map(product =>{
      return (`
      <div class="product" id="vproduct" data-productid="${product.product_id}">
      <div class="pimage">
         <img src="/products/${product.product_image}" alt="waiting...">
      </div>
      <div class="pname">${product.product_name}</div>
      <div class="pdesc">${product.product_description}</div>
      <div class="pprice">${product.product_price} frw</div>
   </div>
      `);
   });
   document.querySelector(".viewer-products").innerHTML = breads.join("");
   prepare_ordering();
   function prepare_ordering() {
      let products = document.querySelectorAll("#vproduct");
      products.forEach(product =>{
         product.addEventListener("click",(e)=>{
            let product_id = product.dataset.productid;
            b.location = `/ordering/buy?product=${product_id}`;
         })
      })
   }
   function lvs() {
       let search_inp = document.querySelector("#search-products");
       search_inp.addEventListener("keyup", async (e)=>{
          let v = e.target.value;
          let result_div = document.querySelector(".fetch-results");
          let {data:match} = await viewer.get(`/customer/v1/${v}`);
          console.log(match);
          if(v.length > 2){
             if(match.match.length > 0) {
                let datas = match.match.map((p) =>{
                   return `<div class="match-result">${p.product_name}</div>`;
                });
                result_div.innerHTML = datas.join("");
                result_div.style.display = "block";
                listen();
             }else{
                result_div.style.display = "none";
             }
          }else{
             result_div.style.display = "none";
          }
        });
        function listen() {
          let result_div = document.querySelector(".fetch-results");
          let divs = document.querySelectorAll(".match-result");
          divs.forEach(div=>{
             div.onclick = function(){
                search_inp.value = div.innerText;
                result_div.style.display = "none";
                document.querySelector("#pull").click();
 
             }
          })
        }
    }
    selected();
    function selected() {
      let btn = document.querySelector(".selected");
      let container = document.querySelector("#filter");
      btn.addEventListener("click",() =>{
         (container.className == "view-categories")? container.className = "all-categories":container.className = "view-categories";
      })
    }

})()