function insert_startup_products(
   id,
   name,
   image,
   quantity,
   category,
   description,
   price
) {
   return (
      `
      INSERT INTO products SET 
      product_id = '${id}', 
      product_name = '${name}', 
      product_image = '${image}.jpg', 
      product_quantity = '${quantity}',
      product_category = '${category}',
      product_description = '${description}',
      product_price = ${price},
      purchased = 'Pending';
      `
   );
}
module.exports = insert_startup_products;