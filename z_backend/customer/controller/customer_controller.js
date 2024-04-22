let {
   fetch_products,
   fetch_popularies,
   fetch_categories
} = require("../../Queries/ProductQueries/query");
let messagepage = require("../../utils/outpage");

try {
   exports.load_products = async (req,res) =>{
      try{
        req.connect.query(fetch_products("products"),(err,result) =>{
           if(err) throw err;
           res.status(200).json({err: false, result});
        });
      }catch(err){
        console.log(err.message);
        res.status(505).json({err: true});
      }
     }
     
     exports.load_popularies= async (req,res) =>{
        try{
           req.connect.query(fetch_popularies("products"),(err,result) =>{
              if(err) throw err;
              res.status(200).json({err: false, result});
           });
         }catch(err){
           console.log(err.message);
           res.status(505).json({err: true});
         }
     }
     
     exports.load_categories = async (req,res) =>{
        try{
           req.connect.query(fetch_categories("products"),(err,result) =>{
              if(err) throw err;
              res.status(200).json({err: false, result});
           });
         }catch(err){
           console.log(err.message);
           res.status(505).json({err: true});
         }
     }
     
     exports.send_product = async (req,res) =>{
        try{
           let query = `SELECT product_image,
                               product_name,
                               product_price,
                               product_description FROM products WHERE product_id = '${req.params.pid}';`;
           req.connect.query(query,(err,result) =>{
              if(err) throw err;
              if(result.length == 0) throw new Error("unknown id");
              res.status(200).json({err: false, result});
           });
         }catch(err){
           console.log(err.message);
           res.status(505).json({err: true});
         }
     }
     
     exports.purchase = async (req,res) =>{
       try{
        let user_id = req.session.userid;
        let product_id = req.query.product;
        let customer_quantity = req.query.quantity;
        let order_id = req.gen_id.get_id() + req.gen_id.get_id() + req.gen_id.get_id();
     
        let query_product = `SELECT * FROM products WHERE product_id = '${product_id}';`;
        let customer_product = `SELECT * FROM customers WHERE customer_id = '${user_id}';`;
        req.connect.query(query_product,(err,resu) =>{
           if(err){
              res.status(404).send(messagepage("Unknown product","Sorry this product doesn't exist"));
              throw err;
           }
      
        req.connect.query(customer_product,(err,result) =>{
           if(err){
              res.status(404).send(messagepage("Unexpected Error","Sorry this this purchase doesn't placed!"));
              throw err;
           }
           let product_image = resu[0].product_image;
           let product_name = resu[0].product_name;
           let curstomer_name = result[0].customer_name;
           let product_quantity = resu[0].product_quantity;
           let product_price =  resu[0].product_price;
           let payed_price = Number(customer_quantity) * Number(product_price);
           let _orders = Number(resu[0].purchased) + 1;
           let q = `INSERT INTO orders SET product_id = '${product_id}',
                                           curstomer_id = '${user_id}',
                                           product_image = '${product_image}',
                                           product_name  = '${product_name}',
                                           curstomer_name = '${curstomer_name}',
                                           product_quantity = '${product_quantity}',
                                           customer_quantity = '${customer_quantity}',
                                           product_price = '${product_price}',
                                           payed_price = '${payed_price}',
                                           order_id    = '${order_id}',
                                           descion = 'Pending...';`;
           req.connect.query(q,(err,success)=>{
              if(err) {
                 res.status(404).send(messagepage("Unexpected Error","Sorry this this purchase doesn't placed!"));
                 console.log(err);
                 return;
              }
              req.connect.query(`UPDATE products SET purchased = '${_orders}' WHERE product_id = '${product_id}';`,(req,res)=>{});
              res.type("text/html").send(messagepage("Success",`Product is successful placed in Orders!!. <br> Wait in a bit... until product is being delivered over <br> And you will pay when you get a product. <br>  <a href="/history">Continue</a>`));
              return;
           })
     
        });
     });
       }catch(err){
        console.log(err);
       }
     }
     
     exports.histories = async (req,res) =>{
        try {
           let user_id = req.session.userid;
     
           let q = `SELECT product_image,
                           product_name,
                           customer_quantity,
                           payed_price,
                           descion FROM orders WHERE curstomer_id = '${user_id}';`;
           req.connect.query(q,(err,result) =>{
              if(err){
                 res.status(200).json({err: true});
                 throw err;
              }
              res.status(200).json({err: false, result});
           })
        }
        catch(err) {
           res.status(200).json({err: true});
           console.log(err);
        }
           
     }
     
     exports.registor = (req,res) =>{
        try {
           if(req.session.userid) {
              return res.type("text/html").send(messagepage("Another account","Logout on first account"));
           }
           let {
              number,
              password,
              confirm,
              name,
              district
           } = req.body;
           password = password.replaceAll("\\","");
           confirm = confirm.replaceAll("\\","");
           district = district.replaceAll("\\","");
           name = name.replaceAll("\\","");
     
           if(password != confirm) {
              return res.type("text/html").send(messagepage("Password error","password not match"));
           }
           let q = `SELECT * FROM customers WHERE customer_number = '${number}';`;
           req.connect.query(q,async (error,result) =>{
              if(error) throw error;
              if(result.length > 0){
                 return res.type("text/html").send(messagepage("Account taken","There is another account using this number!"));
              }
              let hash =  req.bcrypt_.hashSync(password,req.salt_);
              let userid = req.gen_id.get_id();
        
              let qe = `INSERT INTO customers SET 
              customer_id = '${userid}',
              customer_number = '${number}',
              customer_name   = '${name}',
              customer_district = '${district}',
              customer_password = '${hash}';`;
              req.connect.query(qe,(error,result) =>{
                 if(error) throw error;
                 req.session.customer = name;
                 req.session.userid  = userid;
                 res.redirect("/");
              })
        
           })
        }
        catch(e) {
           console.log(e);
           res.status(404).send(messagepage("Unexpected Error","Something went wrong!"));
        }
     
     }
     
     exports.login = (req,res) =>{
        try {
           if(req.session.userid) {
              return res.type("text/html").send(messagepage("Another account","Logout on first account"));
           }
           let {number,password} = req.body;
           password  = password.replaceAll("\\","");
           let q = `SELECT * FROM customers WHERE customer_number = '${number}';`;
           req.connect.query(q,(err,result) =>{
              if(err) throw err;
              if(result.length == 0) {
                 return res.status(404).send(messagepage("Account Error","Incorrect information"));
              }
              let check = req.bcrypt_.compareSync(password,result[0].customer_password);
              if(!check) {
                 return res.status(404).send(messagepage("Account Error","Incorrect information"));
              }
              req.session.customer = result[0].customer_name;
              req.session.userid  = result[0].customer_id;
              res.redirect("/");
           });
        }catch(err) {
           console.log(err);
           res.status(404).send(messagepage("Error","Something went wrong!"));
        }
        
     }
     
     exports.lvs = (req,res) =>{
        let s = req.params.s;
        let q = `SELECT product_name FROM products WHERE product_name LIKE '%${s}%' LIMIT 6;`;
        req.connect.query(q,(err,result)=>{
           if(err) console.log(err);
           res.status(200).json({match: result});
        })
     }
     
     exports.searchs = (req,res) =>{
        try {
           let product = req.query["search-products"];
           product = product.replaceAll("\\","");
           let {min,max} = req.query;
           let q = `SELECT product_id,
                           product_image,
                           product_name,
                           product_price,
                           product_description FROM products WHERE product_name LIKE '%${product || "a"}%' 
                          ${(max)?" AND product_price <= '" + max + "'" : ""} ${(min)?" AND product_price >= '" + min + "'" : ""};`;
           req.connect.query(q,(error,result)=>{
              if(error) {
                 throw error;
              }
              else{
                 res.status(200).json({error: false,result});
              }
           });
        }
        catch(err){
           console.log(err.message);
           res.status(505).json({err: true});
         }
     }
}catch(e){
   console.log(e.message);
}