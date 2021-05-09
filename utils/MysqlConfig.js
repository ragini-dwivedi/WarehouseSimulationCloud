const mysql = require('mysql');

const db = mysql.createPool({
    host: 'us-cdbr-east-03.cleardb.com',
    user: 'b71cad681d773f',
    password: 'df6f4a1c',
    database: 'heroku_5fa0a60c7eed8c8'
});

db.getConnection((err) => {
    if(err){
        throw err;
    }
    else{
        console.log("connect to Mysql db");
    }
    //TEST
    db.query('SELECT * FROM admin', (err, results)=>{
        if (err) throw err;
        console.log(results);
    })
});

module.exports = db;