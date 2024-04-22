(async () => {
   let b = window;
   
      const tabs     = document.querySelector(".lists");
      let lists      = tabs.querySelectorAll("li");
      let right_tabs = document.querySelectorAll("#container");
      let view_tab   = document.querySelector(".Overview");
      let orders_tab = document.querySelector(".Orders");
      let pop_tab    = document.querySelector(".Popular");
      let users_tab  = document.querySelector(".Users");
      let allp_tab   = document.querySelector(".All-products");
      let addp_tab   = document.querySelector(".Add-product");
      let viewer     = axios;
      let img_input = document.querySelector("#pimage");
      let pimage = document.querySelector(".imagesuploaded");
      let inpts = document.querySelectorAll("#hidden");
      document.querySelector(".imagecontainer").onclick = e =>{
         img_input.click();
      }
      img_input.onchange = e =>{
         inpts.forEach(input => {
            input.files[0] = img_input.files[0];
         })
         let filereader = new FileReader();
         filereader.readAsDataURL(img_input.files[0]);
         filereader.onload = i =>{
            pimage.src = i.target.result;
         }
      }
      function upimage() {
         document.querySelector("#imgc").onclick = e =>{
            document.querySelector("#imagep").click();
         }
         document.querySelector("#imagep").onchange = e =>{
            inpts.forEach(input => {
               input.files[0] = document.querySelector("#imagep").files[0];
            })
            let filereader = new FileReader();
            filereader.readAsDataURL(document.querySelector("#imagep").files[0]);
            filereader.onload = i =>{
               document.querySelector(".uploadedi").src = i.target.result;
            }
         }
      }
      lists.forEach( (list,index) => {
         list.onclick = ()=> {
            lists.forEach( (list,index) => {
                  list.id = "";
            });
            list.id = "active";
            right_tabs.forEach( (list,index) => {
                  list.style.display = "none";
            });
            right_tabs[index].style.display = "flex";
         }
      });
         let {
            data: name
         } = await viewer.get("/admin/name");
         document.querySelector("#name").innerText = name;
      view_tab.addEventListener("click",async (e) =>{
        try{
         let {
            data: overview
         } = await viewer.get("/admin/get/overview");
         if(overview.error){
            throw overview.error;
         }
         document.querySelector("#total-c").innerHTML = overview.data.all_customes;
         document.querySelector("#total-p").innerHTML = overview.data.all_products;
         document.querySelector("#total-o").innerHTML = overview.data.all_orders;
         document.querySelector("#total-a").innerHTML = overview.data.admins;
        }catch(err){
         b.location = b.location;
        }
   
      });
      orders_tab.addEventListener("click",async (e)=>{
         try{
            let {
               data: orders
            } = await viewer.get("/admin/get/orders");
            if(orders.error){
               throw orders.error;
            }
            let Orders = orders.result.map((product)=> {
               return (
                  `
                  <div class="tr" data-oid="${product.order_id}" data-cid="${product.curstomer_id}">
                  <div>${product.curstomer_name}</div>
                  <div><img src="/products/${product.product_image}" alt="" srcset=""></div>
                  <div>${product.product_name}</div>
                  <div>${product.product_price} frw</div>
                  <div>${product.product_quantity}</div>
                  <div>${product.customer_quantity}</div>
                  <div>${product.payed_price} frw</div>
                  <div><button class="deleteOrder">delete</button></div>
               </div>
                  `
               )
            });
            document.querySelector(".viewer-orders").querySelector(".table-body").innerHTML = Orders.join("");
            rd_order();
           }catch(err){
            b.location = b.location;
           }
      })
      pop_tab.addEventListener("click",async (e) =>{
         try{
          let {
             data: popular
          } = await viewer.get("/admin/get/popular");
          if(popular.error){
             throw popular.error;
          }
          let popularies = popular.result.map(popular => {
            return (`
            <div class="tr" data-pid="${popular.product_id}">
            <div><img src="/products/${popular.product_image}" alt="" srcset=""></div>
            <div>${popular.product_name}</div>
            <div>${popular.product_price} frw</div>
            <div>${popular.purchased}</div>
         </div>
            `);
          });
          document.querySelector(".popularies").querySelector(".table-body").innerHTML = popularies.join("");
          
         }catch(err){
            b.location = b.location;
         }
    
       })
       users_tab.addEventListener("click",async (e) =>{
            try{
             let {
                data: users
             } = await viewer.get("/admin/get/users");
             if(users.error){
                throw users.error;
             }
             let allusers = users.result.map(user => {
               return (`
               <div class="tr" data-uid="${user.customer_id}">
               <div>${user.customer_id}</div>
               <div>${user.customer_name}</div>
               <div>${user.customer_number}</div>
               <div>${user.customer_district}</div>
               <div>${user.customer_password}</div>
             </div>
               `);
             });
             document.querySelector(".all-users").querySelector(".table-body").innerHTML = allusers.join("");
             rm_product();
            }catch(err){
               b.location = b.location;
            }
       })
       allp_tab.addEventListener("click",async (e) =>{
         try{
          let {
             data: products
          } = await viewer.get("/admin/get/allproducts");
          if(products.error){
             throw products.error;
          }
          let allproducts = products.result.map(product => {
            return (`
            <div class="tr" data-pid="${product.product_id}">
            <div>${product.product_id}</div>
            <div>
               <img src="/products/${product.product_image}" alt="" srcset="">
            </div>
            <div>${product.product_name}</div>
            <div>${product.product_price} frw</div>
            <div>${product.product_quantity}</div>
            <div>${product.purchased}</div>
            <div><button class="change-product">change</button></div>
            <div><button class="remove-product">remove</button></div>
         </div>
            `);
          });
          document.querySelector(".viewr-allproducts").querySelector(".table-body").innerHTML = allproducts.join("");
          rm_product();
          md_products();
         }catch(err){
            b.location = b.location;
         }
    })
      lists[0].click();
      function rm_product() {
         let btns = document.querySelectorAll(".remove-product");
         btns.forEach(btn =>{
            btn.onclick = async ()=>{
               let p_id = btn.parentNode.parentNode.dataset.pid;
               let im  = btn.parentNode.parentNode.querySelector("img").src.split("/").pop();
               try{
                  let {
                     data: delet
                  } = await viewer.delete(`/admin/delete/${p_id}/${im}`);
                  if(delet.error){
                     throw delet.error;
                  }
                  btn.parentNode.parentNode.innerHTML = "";
               }
               catch(err) {
                  b.location = b.location;
               }
               
   
               
            }
         })
      }
    function rd_order() {
         let btns = document.querySelectorAll(".deleteOrder");
         btns.forEach((btn) =>{
            btn.addEventListener("click",async (e) =>{
               let o_id = btn.parentNode.parentNode.dataset.oid;
               let c_id = btn.parentNode.parentNode.dataset.cid;
               try{
                  let {
                     data: delet
                  } = await viewer.delete(`/admin/deleteorder/${o_id}/${c_id}`);
                  if(delet.error){
                     throw delet.error;
                  }
                  btn.parentNode.parentNode.innerHTML = "";
               }
               catch(err) {
                  b.location = b.location;
               }
            })
         })
      } 
      function md_products() {
         let btns = document.querySelectorAll(".change-product");
         btns.forEach(btn =>{
            btn.onclick = async (e) =>{
               let p_id = btn.parentNode.parentNode.dataset.pid;
               try{
                  let {
                     data: update
                  } = await viewer.get(`/admin/product/${p_id}`);
                  if(update.error){
                     throw update.error;
                  }
                  document.body.innerHTML += `
                  <div class="update">
                  <div class="viewer-addproduct" id="container">
                     <div class="inner">
                        <form action="/admin/update" method="post" enctype="multipart/form-data">
                           <div class="image">
                              <h1>SELECT IMAGE</h1>
                              <div class="imagecontainer" id="imgc">
                                 <img src="/products/${update.result[0].product_image}" alt="" srcset="" class="uploadedi">
                                 <input type="file" name="productimage" id="imagep">
                              </div>
                           </div>
                           <div class="product-details">
                              <div class="name">
                                 <p>product name: </p>
                                 <input type="text" name="pname" id="pname" value="${update.result[0].product_name}" required>
                              </div>
                              <div class="price">
                                 <p>product price: </p>
                                 <input type="number" name="pprice" id="pprice" value="${update.result[0].product_price}" required>
                                 <p>RWF</p>
                              </div>
                              <div class="q">
                                 <p>p_quantity:&emsp;</p>
                                 <input type="number" name="quantity" id="quantity" value="${update.result[0].product_quantity}" required>
                                 <input type="text" name="productid" id="productid" value="${update.result[0].product_id}" style="display:none">
                              </div>
                              <div class="o">
                                 <p>Orders/temp:&emsp;&emsp;</p>
                                 <input type="number" name="orders" id="order" value="${update.result[0].purchased}" required>
                              </div>
                              <div class="c">
                                 <p>Category:&emsp;&nbsp;</p>
                                 <input type="text" name="category" id="category" value="${update.result[0].product_category}" required>
                              </div>
                              <div class="desc">
                                 <p>description:&emsp; </p>
                                 <input type="text" name="pdesc" id="pdesc" value="${update.result[0].product_description}" required>
                              </div>
                              <div class="btn">
                                 <input type="submit" value="update product">
                                 <input type="reset" value="Cancel" id="cancel-btn">
                              </div>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
                  `;
                  upimage();
                  document.querySelector("#cancel-btn").onclick = function(){
                     let a = document.createElement("a");
                     a.href = "/admin";
                     a.click();
                  }
               }
               catch(err) {
                  b.location = b.location;
                  md_products();
               }
            }
         })
      }
   
   
})()