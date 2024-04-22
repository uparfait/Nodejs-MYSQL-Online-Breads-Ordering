
function insert_product(tbname,option){
   return (`
         INSERT INTO ${tbname} (product_id,  
            product_name,  
            product_image,  
            product_quantity,
            product_category,
            product_description, 
            product_price, 
            purchased)   
             VALUES( 
         '${option.id}', 
         '${option.name}', 
         '${option.image}', 
         '${option.quantity}',
         '${option.category}', 
         '${option.desc}', 
         '${option.price}', 
         '${option.orders}');
      `);
}
exports.fetch_products = (tbname) =>{
   return (`SELECT product_id,
   product_image,
   product_name,
   product_price,
   product_description FROM ${tbname};`);
}

exports.fetch_popularies = (tbname) =>{
   return (`SELECT product_id,
   product_image,
   product_name,
   product_price FROM ${tbname} LIMIT 5;`);
}
exports.fetch_categories = (tbname) =>{
   return (`SELECT product_id,
   product_image,
   product_category FROM ${tbname} LIMIT 5;`);
}
exports.insert_product = insert_product;