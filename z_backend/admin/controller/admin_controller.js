let {
   admin_register,
   all_Products,
   logged_Users,
   pop_products,
   orded_products,
   update_products,
   delete_products,
   delete_orders,
   Admins,
   product
} = require("../../Queries/AdminQuery/query");

let {
   insert_product
} = require("../../Queries/ProductQueries/query");
const message_page = require("../../utils/outpage");

try {
   exports.overview = async (req,res) =>{
   
      let data = {};
      try{
         req.connect.query(all_Products("products"),(err,result) => {
            if(err) throw err;
            data.all_products = result.length;
            req.connect.query(logged_Users("Customers"),(err,result)=>{
               if(err) throw err;
               data.all_customes = result.length;
               req.connect.query(orded_products("orders"),(err,result) =>{
                  if(err) throw err;
                  data.all_orders = result.length;
                  req.connect.query(Admins("Admins"),(err,result)=>{
                     if(err) throw err;
                     data.admins = result.length;
                     res.status(200).json({error: false,data});
                  })
               })
            })
         })
      }
      catch(err){
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   
   }
   
   exports.orders = async (req,res) =>{
   
      try{
         req.connect.query(orded_products("orders"),(err,result) => {
            if(err) throw err;
            res.status(200).json({error: false,result});
         })
      }
      catch(err){
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   
   }
   exports.popular = async (req,res) =>{
   
      try{
         req.connect.query(pop_products("products",100),(err,result) => {
            if(err) throw err;
            res.status(200).json({error: false,result});
         })
      }
      catch(err){
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   
   }
   exports.users = async (req,res) =>{
   
      try{
         req.connect.query(logged_Users("Customers"),(err,result) => {
            if(err) throw err;
            res.status(200).json({error: false,result});
         })
      }
      catch(err){
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   
   }
   exports.all_products = async (req,res) =>{
   
      try{
         req.connect.query(all_Products("products"),(err,result) => {
            if(err) throw err;
            res.status(200).json({error: false,result});
         })
      }
      catch(err){
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   
   }
   let uploaded;
   exports.add_product = async (req,res) =>{
   
      try{
         let product_img;
         if(req.file){
            product_img = req.file.filename;
         }else{
            product_img = "noimage.png";
         }
         let uploaded_file = req.__destination + "\\dashboard\\admin\\products\\" + product_img;
         uploaded = uploaded_file;
         let {
            pprice,
            pdesc,
            pname,
            quantity,
            orders,
            category
         } = req.body;
         let data = {
            id: req.gen_id.get_id(),
            name: pname,
            image: product_img,
            quantity:  quantity,
            orders: orders,
            price: pprice,
            desc: pdesc,
            category: category
         }
         req.connect.query(insert_product("products",data),(err,result) => {
            if(err) throw err;
            res.redirect("/admin");
         });
   
   
      }
      catch(err){
         console.log(err);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   
   }
   
   exports.delete_product = async (req,res)=>{
      try{
         req.connect.query(delete_products("products",req.params.productid),(err,result) => {
            if(err) throw err;
            if(result.affectedRows == 1){
               // req.__del(req.__destination + "products\\" + req.params.i,req.__fs);
               res.status(200).json({error: false,result});
            }else{
               res.status(404).json({error: true,response: "no such product!"});
            }
           
         })
      }
      catch(err){
         console.log(err.message);
         res.status(505).json({error: true,response: "An error occured"});
      }
   }
   exports.delete_order  = async (req,res)=>{
      try{
         req.connect.query(delete_orders("orders",req.params.orderid),(err,result) => {
            if(err) throw err;
            if(result.affectedRows == 1){
               res.status(200).json({error: false,result});
            }else{
               res.status(404).json({error: true,response: "no such product!"});
            }
           
         })
      }
      catch(err){
         console.log(err.message);
         res.status(505).json({error: true,response: "An error occured"});
      }
   }
   exports.registor = async (req,res) =>{
      try {
         let {
            adminname,
            password,
            confirm
         } = req.body;
         let q = `SELECT * FROM Admins WHERE admin_name = '${adminname}'`;
         req.connect.query(q,(err,result) =>{
            if (err) throw err;
            if (result.length > 0){
               return res.type("text/html").send(message_page("Account Error!",` Admin with (${adminname}) name Already exist`));
            }
            if(password !== confirm) {
               return res.type("text/html").send(message_page("Password Error!",`password not match!`));
            }
            req.connect.query(admin_register(adminname,password,"/favicon.ico","Admins"),(err,result) =>{
               if(err) throw err;
               req.session.admin = adminname;
               req.session.user  = "admin";
               res.redirect("/admin");
            })
         })
      }catch(err) {
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   }
   exports.login = async (req,res) =>{
     try{
      if(req.session.user && req.session.admin != req.body.text){
         return res.type("text/html").send(message_page("Another user in use",`Please logout on ${req.session.admin} Account first.`));
      }
      let {
         text,
         password
      } = req.body;
      let q = `SELECT * FROM Admins WHERE admin_name = '${text}' AND password = '${password}'`;
      req.connect.query(q,(err,result) =>{
         if (err) throw err;
         if(result.length == 0){
            return res.type("text/html").send(message_page("Account not found",`username or password is incorrect`));
         }
         let admn = `SELECT * FROM Admins WHERE admin_name = '${text}'`;
         req.connect.query(admn,(err,result) =>{
            if(err) throw err;
            req.session.admin = result[0].admin_name;
            req.session.user  = "admin";
            res.redirect("/admin");
         })
      })
     }
      catch(err) {
         console.log(err.message);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
   }
   exports.product_data = async (req,res) =>{
      try{
         let pid = req.params.productid;
         req.connect.query(product("products",pid),(err,result) =>{
            if(err) throw err;
            res.status(200).json({error: false,result});
         })
   
      }
      catch(err){
         res.status(505).json({error: true,response: "An error occured"});
      }
   }
   
   exports.update_product = async (req,res) =>{
      try {
         let productimage;
         let recentimage;
         let {
            pname,
            pprice,
            quantity,
            productid,
            orders,
            category,
            pdesc
         } = req.body;
         if(req.file){
            productimage = req.file.filename;
         }
         else{
            productimage = null;
         }
         let q = `SELECT * FROM products WHERE product_id = '${productid}';`;
         req.connect.query(q,(err,result)=>{
            if(err) throw err;
            recentimage = result[0].product_image;
            let option = {
               name:pname,
               image: productimage || recentimage,
               desc:pdesc,
               quantity:quantity,
               price: pprice,
               cat:category,
               orders: orders,
               id: productid
            }
            req.connect.query(update_products(option,"products"),(err,result)=>{
               if(err) throw err;
               res.redirect("/admin");
            })
         })
      }
      catch(err){
         console.log(err);
         return res.type("text/html").send(message_page("Unexpected Error",`An error occured it may be internal server error`));
      }
      
   }
}catch(e){
   console.log(e.message);
}