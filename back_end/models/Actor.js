//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const db = require("./databaseConfig");

const Actor = {
    findByID(actorID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return 
            const findActorByIDQuery = "SELECT actor_id, first_name, last_name FROM actor WHERE actor_id = ?;";
            dbConn.query(findActorByIDQuery, [actorID], (error, results) => {
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

    findByFirstName(limit, offset, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            //connection successful and run query to return
            const findByNameQuery = "SELECT actor_id, first_name, last_name FROM actor ORDER BY first_name LIMIT ? OFFSET ?";
            dbConn.query(findByNameQuery, [limit, offset], (error, results) => {
                dbConn.end();
                if (error) {
                    return callback(error, null);
                };
                return callback(null, results);
            });
        })
    },

    addActor(first_name, last_name, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else { //connection successful and run query to return
                const insertActorQuery = `INSERT INTO actor (first_name, last_name) VALUES (?, ?);`;
                dbConn.query(insertActorQuery, [first_name, last_name], (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null, results.insertId);
                });
            }
        })
    },

    updateActor(actor, actorID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function (err) {
            if (err) {
                console.log(err);
                return callback(err, null);
            } else { //connection successful and run query to return
                var updateActorQuery = `UPDATE actor SET `;
                var inputs = []
                if (actor.first_name == undefined) {
                    updateActorQuery += `last_name = ?`
                    inputs.push(actor.last_name)
                }
                else if (actor.last_name == undefined) {
                    updateActorQuery += `first_name = ?`
                    inputs.push(actor.first_name)
                }
                else {
                    updateActorQuery += `first_name = ?, last_name = ?`
                    inputs.push(actor.first_name, actor.last_name)
                }
                updateActorQuery += ` WHERE actor_id = ?;`
                inputs.push(actorID)
                dbConn.query(updateActorQuery, inputs, (error, results) => {
                    dbConn.end();
                    if (error) {
                        return callback(error, null);
                    };
                    return callback(null);
                });
            }
        })
    },

    deleteActor(actorID, callback) {
        var dbConn = db.getConnection();
        dbConn.connect(function(err) {
            if (err) {
                console.log(err);
                return callback(err,null);
            } else { //connection successful and run query to return
                const deleteActorQuery = `DELETE FROM actor WHERE actor_id = ?; DELETE FROM film_actor WHERE actor_id = ?`
                dbConn.query(deleteActorQuery, [actorID, actorID], (error, results) => {
                    dbConn.end();
                    if(error) {
                        return callback(error, null);
                    }
                    return callback(null);
                })
            }
        })
    },
}

module.exports = Actor

