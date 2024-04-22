const admin_router = require("express").Router();
const {
   overview,
   orders,
   popular,
   users,
   all_products,
   add_product,
   delete_product,
   delete_order,
   registor,
   login,
   product_data,
   update_product
} = require("../controller/admin_controller");
const multer  = require("multer");
let disk_storage = require("../../../database/products/neve delete this folder/database");
disk_storage = disk_storage() + "\\products";
const Hexbase = require("../../utils/Hexbase");
let file_name = new Hexbase(25);
const storage = multer.diskStorage({
   destination: function(field,file,cb){
      cb(null,disk_storage);
   },
   filename: function(field,file,cb){
      let file_extension = file.originalname.slice(file.originalname.lastIndexOf("."));
      cb(null,String(file_name.get_filename() + file_extension));
   }
 });
 let upload = multer({storage: storage});
admin_router.get("/admin/get/overview",overview);
admin_router.get("/admin/get/orders",orders);
admin_router.get("/admin/get/popular",popular);
admin_router.get("/admin/get/users",users);
admin_router.get("/admin/get/allproducts",all_products);
admin_router.post("/admin/addproduct",upload.single('productimage'),add_product);
admin_router.delete("/admin/delete/:productid/:i",delete_product);
admin_router.delete("/admin/deleteorder/:orderid/:customerid",delete_order);
admin_router.get("/admin/product/:productid",product_data);
admin_router.post("/adminstrator/register",registor);
admin_router.post("/adminstrator/login",login);
admin_router.post("/admin/update",upload.single('productimage'),update_product);
module.exports = admin_router;