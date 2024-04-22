const customer_router = require("express").Router();
let {
   load_products,
   load_popularies,
   load_categories,
   send_product,
   purchase,
   histories,
   login,
   registor,
   lvs,
   searchs
} = require("../controller/customer_controller");
const cutomer_authorisation = require("../../middlewares/customer_author");
customer_router.get("/customer/breads",load_products);
customer_router.get("/customer/popularies",load_popularies);
customer_router.get("/customer/categories",load_categories);
customer_router.get("/ordering/:pid",cutomer_authorisation,send_product);
customer_router.get("/purchasing/",cutomer_authorisation,purchase);
customer_router.get("/customer/histories/",histories);
customer_router.post("/customer/login/",login);
customer_router.get("/customer/v1/:s",lvs);
customer_router.post("/customer/register/",registor);
customer_router.get("/customer/searchs/",searchs);
module.exports = customer_router;