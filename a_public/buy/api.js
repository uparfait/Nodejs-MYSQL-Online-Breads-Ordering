
(async () =>{
   const viewer = axios;
   const b = window;
   let pid = b.location.search.slice(b.location.search.lastIndexOf("=") + 1);
   let isl = await viewer.get("customer/ils");
   function err(){
      b.location = b.location;
   }
   if(isl == 1){
      document.querySelector(".btn-control").innerHTML = `
      <button><a href="/customer/logout"><b>Logout</b></a></button>`;
   }else{
      document.querySelector(".btn-control").innerHTML = `
      <button><a href="/customer/signin"><b>Login</b></a></button>
      <button><a href="/customer/signup"><b>Register</b></a></button>`;
   }
   try{
      let {
         data: product
      } = await viewer.get(`/ordering/${pid}`);
      if(product.err) {
         err();
      }
      let product_image = document.querySelector(".Pimage");
      let product_price = document.querySelector(".pprice").querySelector("span");
      let product_name = document.querySelector(".pname").querySelector("h1");
      let product_tota = document.querySelector(".total");
      let product_pdesc = document.querySelector(".pdesc");
      product_image.src = `/products/${product.result[0].product_image}`;
      product_price.innerText = product.result[0].product_price;
      product_name.innerText = product.result[0].product_name;
      product_tota.innerText = `Total: ${product.result[0].product_price} frw`;
      product_pdesc.innerText = product.result[0].product_description;
      document.querySelector(".pid").value = pid;
     
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
   }catch(e){
      err();
   }
})()