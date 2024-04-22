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
   document.querySelector(".right-content").innerHTML = breads.join("");

   let {
      data: popular
   } = await viewer.get("/customer/popularies");

   let popular_breads = popular.result.map(product =>{
      return (`
      <div class="popular" id="vproduct" data-productid="${product.product_id}">
      <div class="img">
         <img src="/products/${product.product_image}" alt="waiting...">
      </div>
      <div class="popname">${product.product_name}</div>
      <div class="popprice">${product.product_price} frw</div>
   </div>
      `);
   });
   document.querySelector(".populars").innerHTML += popular_breads.join("");

   let {
      data: categories
   } = await viewer.get("/customer/categories");

   let categories_breads = categories.result.map(product =>{
      return (`
      <div class="category" id="vproduct" data-productid="${product.product_id}">
      <div class="img">
         <img src="/products/${product.product_image}" alt="waiting...">
      </div>
      <div class="catname">${product.product_category}</div>
   </div>
      `);
   });
   document.querySelector(".categories").innerHTML += categories_breads.join("");
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
   wrappers();
   function wrappers() {
      let counter = 0;
      let wrappers_image = document.querySelectorAll(".wrappermg");
      setInterval(()=>{
         if(counter === (wrappers_image.length - 1)) {
            counter = 0;
         }else{
            counter++;
         }
         wrappers_image.forEach(img =>{
            img.style.opacity = 0;
         });
         wrappers_image[counter].style.opacity = 1;
      },3000);
   }
})()