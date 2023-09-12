//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const db = require("./databaseConfig");

const Customer = {
    paymentDetail(customerID, start_date, end_date, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findPaymentQuery = `select f.title, p.amount, p.payment_date from film f, payment p, rental r, inventory i where p.rental_id = r.rental_id and r.inventory_id = i.inventory_id and i.film_id = f.film_id and p.customer_id = ? and (p.payment_date between ? and ?);`
            dbConn.query(findPaymentQuery, [customerID, start_date, end_date], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                console.log(results);
                return callback(null, results);
            });
        })
    },

    addCustomer(info, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const addCustomerQuery = `BEGIN; INSERT INTO address (address, address2, district, city_id, postal_code, phone) VALUES(?, ?, ?, ?, ?, ?); INSERT INTO customer (store_id, first_name, last_name, email, address_id, password) VALUES(?, ?, ?, ?, LAST_INSERT_ID(), ?); COMMIT;`
            // `
            // BEGIN;
            // INSERT INTO address (address, address2, district, city_id, postal_code, phone)
            //     VALUES(?, ?, ?, ?, ?, ?);
            // INSERT INTO customer (store_id, first_name, last_name, email, address_id) 
            //     VALUES(?, ?, ?, ?, LAST_INSERT_ID());
            // COMMIT;
            // `
            dbConn.query(addCustomerQuery, [info.address.address, info.address.address2, info.address.district, info.address.city_id, info.address.postal_code, info.address.phone, info.store_id, info.first_name, info.last_name, info.email, info.password], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                console.log(results);
                return callback(null, results[2].insertId);
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
                const query = "SELECT * FROM customer WHERE email=? and password=?";
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

    findByID(customerID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findStaffByIDQuery = "SELECT * FROM customer WHERE customer_id = ?;";
            dbConn.query(findStaffByIDQuery, [customerID], (error, results) => {
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

    addReview(customerID, filmID, review, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const addReviewQuery = `INSERT INTO review (customer_id, film_id, rating, description) values (?, ?, ?, ?);`
            dbConn.query(addReviewQuery, [customerID, filmID, review.rating, review.description], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                console.log(results);
                return callback(null, results);
            });
        })
    },

    getReviews(filmID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findStaffByIDQuery = "SELECT r.*, c.first_name, c.last_name FROM review r, customer c WHERE film_id = ? AND r.customer_id = c.customer_id;";
            dbConn.query(findStaffByIDQuery, [filmID], (error, results) => {
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
    }
}

module.exports = Customer