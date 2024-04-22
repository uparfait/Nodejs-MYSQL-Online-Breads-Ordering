// Function for admin to insert his/her credentials
function admin_register(name, password, profile, dbname) {
  return (`
  INSERT INTO ${dbname} SET admin_name = '${name}', password = '${password}',profile = '${profile}';
  `);
}

//Function for checking all the product he/she has
function all_Products(dbname) {
    return `SELECT * FROM ${dbname};`;
}

function product(dbname,pid) {
    return `SELECT * FROM ${dbname} WHERE product_id = '${pid}';`;
}

//Function for users 
function logged_Users(dbname) {
    return `SELECT * FROM ${dbname};`;
}

//Function for admins 
function Admins(dbname) {
    return `SELECT * FROM ${dbname};`;
}

//function for 10 top popular products
function pop_products(dbname,limit) {
    return `SELECT * FROM ${dbname} ORDER BY purchased DESC LIMIT ${limit || 100};`;
}

//Function to fetch orded products
function orded_products(dbname) {
    return `SELECT * FROM ${dbname};`;
}

//Function to update products
function update_products(option,dbname) {
    return (
        `
        UPDATE ${dbname} SET product_name = '${option.name}',
                                  product_image = '${option.image}',
                                  product_description = '${option.desc}',
                                  product_quantity = '${option.quantity}',
                                  product_price = '${option.price}',
                                  product_category = '${option.cat}',
                                  purchased = '${option.orders}'
                                  WHERE product_id = '${option.id}';
        `
    );
}

//Function to delete products 
function delete_products(dbname,pId) {
    return `DELETE FROM ${dbname} WHERE product_id = '${pId}';`;
}
function delete_orders(dbname,pId) {
    return `DELETE FROM ${dbname} WHERE order_id = '${pId}';`;
}
    exports.admin_register = admin_register;
    exports.all_Products = all_Products;
    exports.logged_Users = logged_Users;
    exports.pop_products = pop_products;
    exports.orded_products = orded_products;
    exports.update_products = update_products;
    exports.delete_products = delete_products;
    exports.Admins = Admins;
    exports.product = product;
    exports.delete_orders = delete_orders;