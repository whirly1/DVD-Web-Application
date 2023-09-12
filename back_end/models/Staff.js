//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const db = require("./databaseConfig");

const Staff = {
    findByID(staffID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findStaffByIDQuery = "SELECT * FROM staff WHERE staff_id = ?;";
            dbConn.query(findStaffByIDQuery, [staffID], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                if (results.length === 0) {
                    callback(null, null);
                    return;
                };
                console.log(results);
                return callback(null, results);
            });
        })
    },

    updateAddress(info, staffID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const updateAddressQuery = `BEGIN; INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES(?, ?, ?, ?, ?, ?); UPDATE staff SET address_id = LAST_INSERT_ID() WHERE staff_id = ?; COMMIT;`
            // `
            // BEGIN;
            // SELECT * FROM staff WHERE staff_id = ?;
            // INSERT INTO address (address, address2, district, city_id, postal_code, phone)
            //     VALUES(?, ?, ?, ?, ?, ?);
            // UPDATE staff SET address_id = LAST_INSERT_ID() WHERE staff_id = ?;
            // COMMIT;
            // `
            dbConn.query(updateAddressQuery, [info.address, info.address2, info.district, info.city_id, info.postal_code, info.phone, staffID], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                console.log(results);
                return callback(null, results[1].insertId);
            });
        })
    },

    verify(email, password, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                return callback(err, null);
            } else {
                const query = "SELECT * FROM staff WHERE email=? and password=?";
                dbConn.query(query, [email, password], (error, results) => {
                    console.log(results)
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);
                    } else {
                        const user = results[0];
                        return callback(null, user);
                    }
                });
            }
        });
    },

    findStores(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {//database connection gt issue!
                console.log(err);
                return callback(err, null);
            } else {
                const findStoresQuery = "SELECT s.store_id, a.address FROM store s, address a WHERE s.address_id = a.address_id;";
                dbConn.query(findStoresQuery, (error, results) => {
                    if (error) {
                        callback(error, null);
                        return;
                    }
                    if (results.length === 0) {
                        return callback(null, null);
                    } else {
                        const user = results;
                        return callback(null, results);
                    }
                });
            }
        });
    }
}

module.exports = Staff