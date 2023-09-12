//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const mysql = require("mysql");

var dbconnect = {
    getConnection: function () {
        var conn = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'bed_dvd_root',
            password: 'pa$$woRD123', 
            database: 'bed_dvd_db',
            dateStrings: true,
            multipleStatements: true
        });
        return conn;
    }
}

module.exports = dbconnect;