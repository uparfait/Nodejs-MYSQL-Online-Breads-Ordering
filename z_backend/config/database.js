const {connection} = require('./connection');
const insert_products = require("../utils/startup_products");
let connect;
let percent = 0;
function database(callback) {
    connection(async (error,conn,database_exist)=>{
        if(error) throw error;
        connect = conn;
        callback(connect);
        console.log('Database connected');
        if(!database_exist) {
            admin_tb();
            customer_table();
            products_table();
            orders_table();
        }else{
            console.log("All tables already available.");
            finally_(false);
        }
    
    });
     
    
    function admin_tb() {
        let query = `CREATE TABLE IF NOT EXISTS ${process.env.ADMIN_TABLE || "Admins"} (admin_name VARCHAR(255), password VARCHAR(255), profile VARCHAR(255));`;
        connect.query(query, (error, result) => {
            if(error) throw error;
            console.log('\n\n');
            console.log('+---------------------+');
            console.log('|  Building DATABASE  |');
            console.log('+---------------------+');
            percent +=25;
            console.log(' Admin table created %d%',percent)
            
        });
    }
    
    function customer_table() {
        let query = `CREATE TABLE IF NOT EXISTS ${process.env.CUSTOMER_TABLE || 'Customers'} (customer_id VARCHAR(255), 
                                                                               customer_number VARCHAR(255),
                                                                               customer_name VARCHAR(255),
                                                                               customer_district VARCHAR(255), 
                                                                               customer_password VARCHAR(255));`;
        connect.query(query, (error, result) => {
            if(error) throw error;
            percent +=25;
            console.log(' Customer table created %d%',percent)
        });
    }
    
    function products_table() {
        let query = `CREATE TABLE IF NOT EXISTS ${process.env.PRODUCTS_TABLE || 'products'} (product_id VARCHAR(255), 
                                                                               product_name VARCHAR(255), 
                                                                               product_image VARCHAR(255), 
                                                                               product_quantity VARCHAR(255),
                                                                               product_category VARCHAR(255),
                                                                               product_description VARCHAR(255),
                                                                               product_price int(255),
                                                                               purchased int(255));`;
            connect.query(query, (error, result) => {
                if(error) throw error;
                percent += 25;
                console.log(' Products table created %d%',percent);
            });
    }
    
    function orders_table() {
            let query = `CREATE TABLE IF NOT EXISTS ${process.env.ORDERS_TABLE || 'orders'} (product_id VARCHAR(255), 
                                                                               curstomer_id VARCHAR(255), 
                                                                               product_image VARCHAR(255), 
                                                                               product_name VARCHAR(255),
                                                                               curstomer_name VARCHAR(255), 
                                                                               product_quantity VARCHAR(255), 
                                                                               customer_quantity VARCHAR(255), 
                                                                               product_price VARCHAR(255), 
                                                                               payed_price VARCHAR(255),
                                                                               order_id    VARCHAR(255),
                                                                               descion  VARCHAR(255));`;
            connect.query(query, (error, result) => {
                if(error) throw error;
                percent += 25;
                console.log(' Orders table created %d%',percent)
                finally_(true);
            });
    }
    async function finally_(db) {
        if(db){
            console.log("+-------------------------------+");
            console.log("|                               |");
            console.log("|  Inserting start up products  |");
            console.log("|                               |");
            console.log("+-------------------------------+");
            if(await insert_products(connect)){
                console.log("+------------------------+");
                console.log("|                        |");
                console.log("|  Every thing is ready  |");
                console.log("|                        |");
                console.log("+------------------------+");
            }
            else{
                console.log("Something got wrong!");
            }
        }else{
            console.log("+------------------------+");
            console.log("|                        |");
            console.log("|  Every thing is ready  |");
            console.log("|                        |");
            console.log("+------------------------+");
        }
        }
}

module.exports = database;