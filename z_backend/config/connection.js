const mysql      = require('mysql');
let isdata_exist = true; 
let conn = mysql.createConnection({
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'root',
    password: process.env.PASSWORD || ''
});

async function connection(callback) {

    await conn.connect((error) => {
        if (error) {return consolr.log(error)};
        conn.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME || "Bakery"};`,
        (error, result)=>{
            if(error) {return consolr.log(error)};
            if(result.affectedRows == 1) {isdata_exist = false}
            conn.end(async function(Errors) {
                if(Errors) {return consolr.log(Errors)};
                conn = mysql.createConnection({
                    host: process.env.HOST || 'localhost',
                    user: process.env.USER || 'root',
                    password: process.env.PASSWORD || '',
                    database: process.env.DATABASE_NAME || "Bakery"
                });
            
                await conn.connect((error) => {
                    if(error){
                        callback(error, null,null);
                    }else{
                        callback(null, conn,isdata_exist);
                    }
                })
            });
         });
    });

    }

exports.connection = connection;
