//function for the customer

//Function for customer registration
function customer_registration(c_id, c_number, c_password, c_district, dbname) {
    return (`
    INSERT INTO ${dbname} SET 
    customer_id = '${c_id}, 
    customer_number = '${c_number}', 
    customer_password = '${c_password}', 
    customer_district = '${c_district}';
    `);
}

//Function for checking customer credentials
function checking_credentials(c_number, c_password, dbname) {
    return (`
    SELECT * FROM ${dbname} WHERE customer_number = '${c_number}' AND customer_password = '${c_password}';
    `);
}

//Function to fetch all the products
function fetch_allProducts(dbname) {
    return `SELECT * FROM ${dbname};`;
}

//Function for pending orders
function pending(dbname, c_id) {
    return `SELECT * FROM ${dbname} WHERE customer_id = '${c_id}';`;
}


//Function for customer orders
function orders(dbname, c_id) {
    return `SELECT * FROM ${dbname} WHERE customer_id = '${c_id}';`;
}

//Function for popular products
function popular_products(dbname, c_id) {
    return `SELECT * FROM ${dbname} WHERE customer_id = '${c_id}';`;
}

//Function for customer history
function history(dbname, c_id) {
    return `SELECT * FROM ${dbname} WHERE customer_id = '${c_id}';`;
}

    exports.customer_registration = customer_registration;
    exports.checking_credentials = checking_credentials;
    exports.fetch_allProducts = fetch_allProducts;
    exports.pending = pending;
    exports.orders = orders;
    exports.popular_products = popular_products;
    exports.history = history;