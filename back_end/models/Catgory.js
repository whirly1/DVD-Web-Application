//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const db = require("./databaseConfig");

const Category = {
    findByID(categoryID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findFilmsByIDQuery = `select f.film_id, f.title, c.name as category, f.rating, f.release_year, f.length from film f, film_category fc, category c where f.film_id = fc.film_id and fc.category_id = c.category_id and fc.category_id = ?;`
            dbConn.query(findFilmsByIDQuery, [categoryID], (error, results) => {
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
            const findAllCatQuery = `SELECT category_id, name FROM category;`
            dbConn.query(findAllCatQuery, (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                return callback(null, results);
            });
        })
    }
}

module.exports = Category