//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const db = require("./databaseConfig");

const Film = {
    addFilm(info, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            var addFilmQuery = `BEGIN; INSERT INTO film (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, special_features, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?); INSERT INTO film_text (film_id, title, description) VALUES (LAST_INSERT_ID(), ?, ?) ON DUPLICATE KEY UPDATE film_id = values(film_id), title = values(title), description = values(description); INSERT INTO film_category (film_id, category_id) VALUES (LAST_INSERT_ID(), ?); `
            //adding lines of query depending on the number of actors
            for (var i = 0; i < info.actors.length; i++) {
                addFilmQuery += `INSERT INTO film_actor (actor_id, film_id) VALUES (${info.actors[i]}, LAST_INSERT_ID()); `
            }
            addFilmQuery += `COMMIT;`
            dbConn.query(addFilmQuery, [info.title, info.description, info.release_year, info.language_id, info.rental_duration, info.rental_rate, info.length, info.replacement_cost, info.rating, info.special_features, info.img, info.title, info.description, info.category_id], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                console.log(results);
                return callback(null, results);
            });
        })
    },

    findAll(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findAllFilmsQuery = `SELECT * FROM film;`
            dbConn.query(findAllFilmsQuery, (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                return callback(null, results);
            });
        })
    },

    findByID(filmID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findAllFilmsQuery = `
            SELECT f.title, f.release_year, f.description, f.rating, f.rental_rate, f.img, c.name 
            FROM film f, category c WHERE f.film_id = ?
            AND c.name = (SELECT name from category where category_id = (SELECT category_id from film_category where film_id = ?)); 
            SELECT first_name, last_name from actor WHERE actor_id IN (SELECT actor_id from film_actor where film_id = ?);
            `
            dbConn.query(findAllFilmsQuery, [filmID, filmID, filmID], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                if (results.length === 0) {
                    callback(null, null);
                    return;
                };
                return callback(null, results);
            });
        })
    },

    findByCategory(catID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findAllFilmsQuery = `SELECT * FROM film WHERE film_id IN (select film_id from film_category where category_id = ?);`
            dbConn.query(findAllFilmsQuery, [catID], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                if (results.length === 0) {
                    callback(null, null);
                    return;
                };
                return callback(null, results);
            });
        })
    },

    findByString(string, rental_rate, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findByStringQuery = `SELECT * FROM film where title LIKE ? AND rental_rate <= ?;`
            dbConn.query(findByStringQuery, [string, rental_rate], (error, results) => {
                dbConn.end();
                if (error) {
                    console.log(error)
                    return callback(error, null);
                };
                if (results.length === 0) {
                    callback(null, null);
                    return;
                };
                return callback(null, results);
            });
        })
    },

    findRates(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findRatesQuery = `SELECT MIN(rental_rate) as min, MAX(rental_rate) as max FROM film;`
            dbConn.query(findRatesQuery, (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                return callback(null, results);
            });
        })
    },

    findAllLanguages(callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findAllLanQuery = `SELECT language_id, name FROM language;`
            dbConn.query(findAllLanQuery, (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                return callback(null, results);
            });
        })
    }

}

module.exports = Film