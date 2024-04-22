// =========== dependencies ===========
const express = require("express");
const dotenv  = require("dotenv");
const expressSession = require("express-session");
const bcrypt  = require("bcryptjs");
const cors    = require("cors");
const Hexbase = require("./utils/Hexbase");
let admin_router = require("./admin/routes/admin_router");
let fs = require("node:fs");
let database = require('./config/database');
const Authorisation = require("./middlewares/admin_author");
const customer_auth = require("./middlewares/customer_author");
const remove_image = require("./utils/delete");
const mesage_page = require("./utils/outpage");
const customer_router = require("./customer/routes/customer_routes");
let disk_storage = require("../database/products/neve delete this folder/database");
disk_storage = disk_storage() + "\\";
let connecting;
database((connection) =>{
  connecting = connection;
});
// =========== configure environment ===========
dotenv.config();
// =========== instanceof express ===========
const app = express();
// =========== hexbase userid or file names ===========
const user_id     = new Hexbase(20); // userid with 20 characters
const file_name   = new Hexbase(25); // filename with 25 characters
const salt        = bcrypt.genSaltSync(10);
const server_port = process.env.SERVER_PORT || 7000;
// =========== middlewares ===========
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(expressSession({
   secret: process.env.SESSION_SECRET
}));
app.use("/customer/ils",function(r,s){
  if(r.session.userid){
    s.type("text/plain").send("1");
  }else{
    s.type("text/plain").send('0');
  }
});
app.use("/customer/logout",(r,s)=>{
  if(!r.session.userid){
    return s.redirect("/customer/signin");
  }
  delete r.session.customer;
  delete r.session.userid;
  s.redirect("/");
})
app.use("/products/:p",(r,s)=>{
  let f = disk_storage + "products\\" + r.params.p;
  let type = r.params.p.split(".").pop();
  fs.exists(f, (is) =>{
    if(is){
      fs.readFile(f,(Error,re)=>{
        s.type(`image/${type}`).send(re);
      })
    }else{
      s.send("/notfound/file.jpg");
    }
  })
  
});
app.use("/app/:p",(r,s)=>{
  let f = disk_storage + "app\\" + r.params.p;
  let type = r.params.p.split(".").pop();
  fs.exists(f, (is) =>{
    if(is){
      fs.readFile(f,(Error,re)=>{
        s.type(`image/${type}`).send(re);
      })
    }else{
      s.send("/notfound/file.jpg");
    }
  })
  
});
app.use("/wrapper/:p",(r,s)=>{
  let f = disk_storage + "wrapper\\" + r.params.p;
  let type = r.params.p.split(".").pop();
  fs.exists(f, (is) =>{
    if(is){
      fs.readFile(f,(Error,re)=>{
        s.type(`image/${type}`).send(re);
      })
    }else{
      s.send("/notfound/file.jpg");
    }
  })
  
});
app.use(cors());
app.use("/admin/name",Authorisation,(r,s,n)=>{
  s.end(r.session.admin.split(" ").pop());
 n();
});
app.use((r,s,n)=>{
  r.connect = connecting;
  r.gen_id = user_id;
  r.gen_filename = file_name;
  r.__destination = disk_storage;
  r.salt_ = salt;
  r.bcrypt_ = bcrypt;
  r.__del = remove_image;
  r.__fs  = fs;
  n();
 });
 // ================= deal with Routes for customers ================
 app.use("/",express.static("../a_public/home/"));
 app.use("/ordering/buy",customer_auth,express.static("../a_public/buy/"));
 app.use("/populars",express.static("../a_public/popular/"));
 app.use("/history",customer_auth,express.static("../a_public/history/"));
 app.use("/offers",express.static("../a_public/offers/"));
 app.use("/customer/signin",express.static("../a_public/login/"));
 app.use("/customer/signup",express.static("../a_public/register/"));
 app.use("/offers",express.static("../a_public/offers/"));
 app.use("/search",express.static("../a_public/search"));
 app.use("/",customer_router);
// ================= deal with Routes for admin ================
app.use("/admin/",Authorisation);
app.use("/admin",express.static("../dashboard/admin/"));
app.use("/adminstrator/signin",express.static("../dashboard/login/"));
app.use("/adminstrator/signup",express.static("../dashboard/register/"));
app.use("/",admin_router);
app.use("/error/",(req,res) => res.type("text/html").send(mesage_page("ERROR","Some errors occured!")));
 app.use((req,res) => res.type("text/html").send(mesage_page()));
// ========== start server =========
app.listen(server_port, ()=> console.log("\n(Server on)http://localhost:%d\n", server_port));
