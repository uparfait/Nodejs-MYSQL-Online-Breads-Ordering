let Hexbase = require("./Hexbase");
let insert = require("./insert_products");
let c = 1;
async function insert_products(connection) {
let _ids = new Hexbase(20);
let ids = [
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id(),
   _ids.get_id()
];
let names = [];
let images = [];
let quantitys = [];
let categories = [];
let descriptions = [];
let prices = [];
while(c < ids.length) {
   await connection.query(insert(
      ids[c - 1],
      names[c - 1] || `Bread-${c}`,
      images[c - 1] || `${(c + 1)}`,
      quantitys[c - 1] || "1",
      categories[c - 1] || "Category " + c,
      descriptions[c - 1] || "Best bread ever seen",
      prices[c - 1] || (300 * c) + 1300),
      (err,result) =>{
         if(err)  {console.log(err.message)};
      })
   c++;
}
return true;

}

module.exports = insert_products;
