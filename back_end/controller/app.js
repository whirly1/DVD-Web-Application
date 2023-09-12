//Class: DAAA/FT/1B/01
//Name: Ng Wee Herng
//Admission Number: 2214296
const express = require("express");
const app = express();

//adding all models into app.js
const Actor = require("../models/Actor");
const Category = require("../models/Catgory");
const Customer = require("../models/Customer");
const Film = require("../models/Film");
const Staff = require("../models/Staff");

//adding body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json())

const cors = require("cors");
app.use(cors());
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config");
const isLoggedInMiddleware = require("../auth/isLoggedInMiddleware");


//Endpoint 1
app.get('/actors/:actor_id', (req, res) => {
    //parameter
    const actorID = parseInt(req.params.actor_id)
    Actor.findByID(actorID, (error, actor) => {
        if (error) {
            res.type('json')
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        //if actor does not exist
        if (actor == null) {
            res.status(204).send()
            return
        }
        res.status(200).send(actor)
    })
})

//Endpoint 2
app.get('/actors', (req, res) => {
    //limit and offset via query ?
    var limit = parseInt(req.query.limit)
    var offset = parseInt(req.query.offset)
    //validate limit
    if (isNaN(limit) || limit > 20) {
        limit = 20;
    }
    //validate offset
    if (isNaN(offset)) {
        offset = 0;
    }
    Actor.findByFirstName(limit, offset, (error, actors) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(200).send(actors)
    })
})

//Endpoint 3
app.post('/actors', isLoggedInMiddleware, (req, res) => {
    const first_name = req.body.first_name.toUpperCase()
    const last_name = req.body.last_name.toUpperCase()
    Actor.addActor(first_name, last_name, (error, actorID) => {
        console.log(error)
        if (error) {
            //if there is missing data
            if (error.code === 'ER_BAD_NULL_ERROR') {
                res.type('json')
                res.status(400).send({ 'error_msg': 'missing data' })
                return
            }
            console.log(error)
            res.type('json')
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(201).send({ actor_id: actorID })
    })
})

//Endpoint 4
app.put('/actors/:actor_id', (req, res) => {
    const actorID = req.params.actor_id
    //check for what is being updated
    if (req.body.first_name == undefined && req.body.last_name == undefined) {
        res.status(400).send({ 'error_msg': 'missing data' })
        return
    }
    //check if actor exists
    Actor.findByID(actorID, (error, actor) => {
        if (actor == null) {
            res.status(204).send()
            return
        }
        Actor.updateActor(req.body, actorID, (error) => {
            if (error) {
                console.log(error)
                res.status(500).send({ 'error_msg': 'Internal server error' })
                return
            }
            res.status(200).send({ 'success_msg': 'record updated' })
        })
    })
})

//Endpoint 5
app.delete('/actors/:actor_id', (req, res) => {
    const actorID = req.params.actor_id
    //check if actor exists
    Actor.findByID(actorID, (error, actor) => {
        if (actor == null) {
            res.status(204).send()
            return
        }
        Actor.deleteActor(actorID, (error) => {
            if (error) {
                console.log(error)
                res.status(500).send({ 'error_msg': 'Internal server error' })
                return
            }
            res.status(200).send({ 'success_msg': 'actor deleted' })
        })
    })
})

//Endpoint 6
app.get('/film_categories/:category_id/films', (req, res) => {
    const categoryID = req.params.category_id
    Category.findByID(categoryID, (error, films) => {
        if (error) {
            console.log(error)
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(200).send(films)
    })
})

//Endpoint 7
app.get('/customer/:customerID/payment', (req, res) => {
    const customerID = req.params.customerID;
    var start_date = req.query.start_date
    var end_date = req.query.end_date
    Customer.paymentDetail(customerID, start_date, end_date, (error, details) => {
        if (error) {
            console.log(error)
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        var total = 0
        for (var i = 0; i < details.length; i++) {
            total += details[i].amount
        }
        res.status(200).send({ 'rental': details, 'total': total.toFixed(2) })
    })
})

//Endpoint 8
app.post('/customers', isLoggedInMiddleware, (req, res) => {
    var info = req.body
    //check for missing data
    if (info.store_id == undefined || info.first_name == undefined || info.last_name == undefined || info.email == undefined || info.address.address == undefined || info.address.district == undefined || info.address.city_id == undefined || info.address.postal_code == undefined || info.address.phone == undefined) {
        res.status(400).send({ 'error_msg': 'missing data' })
        return
    }
    Customer.addCustomer(info, (error, customerID) => {
        if (error) {
            console.log(error)
            //check for duplicate entry
            if (error.code == 'ER_DUP_ENTRY') {
                res.status(409).send({ 'error_msg': 'email already exist' })
                return
            }
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(201).send({ 'customer_id': customerID })
    })
})

//Endpoint 9
app.post('/films', isLoggedInMiddleware,(req, res) => {
    var info = req.body
    //check for missing data
    if (info.title == undefined || info.description == undefined || info.release_year == undefined || info.language_id == undefined || info.rental_duration == undefined || info.rental_rate == undefined || info.length == undefined || info.replacement_cost == undefined || info.rating == undefined || info.special_features == undefined || info.category_id == undefined) {
        res.status(400).send({ 'error_msg': 'missing data' })
        return
    }
    Film.addFilm(info, (error, results) => {
        if (error) {
            console.log(error)
            //check for what does not exist for specific message
            if (error.sqlMessage == 'Cannot add or update a child row: a foreign key constraint fails (`bed_dvd_db`.`film_actor`, CONSTRAINT `fk_film_actor_actor` FOREIGN KEY (`actor_id`) REFERENCES `actor` (`actor_id`) ON DELETE CASCADE ON UPDATE CASCADE)') {
                res.status(200).send({ 'error_msg': 'actor does not exist in database' })
                return
            }
            if (error.sqlMessage == 'Cannot add or update a child row: a foreign key constraint fails (`bed_dvd_db`.`film_category`, CONSTRAINT `fk_film_category_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE)') {
                res.status(200).send({ 'error_msg': 'category does not exist in database' })
                return
            }
            if (error.sqlMessage == 'Cannot add or update a child row: a foreign key constraint fails (`bed_dvd_db`.`film`, CONSTRAINT `fk_film_language` FOREIGN KEY (`language_id`) REFERENCES `language` (`language_id`) ON DELETE RESTRICT ON UPDATE CASCADE)') {
                res.status(200).send({ 'error_msg': 'language does not exist in database' })
                return
            }
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        //calculate affected rows
        var affRows = 0
        for(var i = 0; i < results.length; i++) {
            affRows += results[i].affectedRows
        }
        res.status(201).send({ 'film_id': `${results[1].insertId}`, 'affectedRows': affRows })
    })
})

//Endpoint 10
app.post('/address/:staff_id', (req, res) => {
    var info = req.body
    const staffID = req.params.staff_id
    //check for missing data
    if (info.address == undefined || info.district == undefined || info.city_id == undefined || info.postal_code == undefined || info.phone == undefined) {
        res.status(400).send({ 'error_msg': 'missing data' })
        return
    }
    //check if staff exist
    Staff.findByID(staffID, (error, results) => {
        if (results == null) {
            res.status(204).send()
            return
        }
        Staff.updateAddress(info, staffID, (error, results) => {
            if (error) {
                console.log(error)
                res.status(500).send({ 'error_msg': 'Internal server error' })
                return
            }
            res.status(201).send({ 'success_msg': 'record updated', 'new address_id': results })
        })
    })
})

//Login
app.post("/login/", (req, res) => {
    Staff.verify(req.body.email, req.body.password, (error, user) => {
        if (error) {
            res.status(500).send();
            return;
        }
        if (user === null) {
            res.status(401).send();
            return;
        }
        const payload = { user_id: user.staff_id };
        jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
            if (error) {
                console.log(error);
                res.status(401).send();
                return;
            }
            res.status(200).send({ token: token, user_id: user.staff_id });
        })
    });
});

app.post("/customer_login/", (req, res) => {
    Customer.verify(req.body.email, req.body.password, (error, user) => {
        if (error) {
            res.status(500).send();
            return;
        }
        if (user === null) {
            res.status(401).send();
            return;
        }
        const payload = { user_id: user.customer_id };
        jwt.sign(payload, JWT_SECRET, { algorithm: "HS256" }, (error, token) => {
            if (error) {
                console.log(error);
                res.status(401).send();
                return;
            }
            res.status(200).send({ token: token, user_id: user.customer_id });
        })
    });
});

//return all categories
app.get("/categories", (req, res) => {
    Category.findAll((error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        };
        res.status(200).send(results);
    });
})

//return all languages
app.get("/languages", (req, res) => {
    Film.findAllLanguages((error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        };
        res.status(200).send(results);
    });
})

//return all films
app.get("/films", (req, res) => {
    Film.findAll((error, results) => {
        if (error) {
            console.log(error);
            res.status(500).send();
        };
        res.status(200).send(results);
    });
})

//return film by id
app.get("/film/:film_id", (req, res) => {
    //parameter
    const filmID = parseInt(req.params.film_id)
    Film.findByID(filmID, (error, film) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        if (film == null) {
            res.status(204).send()
            return
        }
        res.status(200).send(film)
    })
})

//return film by category
app.get("/film_cat/:catID", (req, res) => {
    const catID = parseInt(req.params.catID)
    Film.findByCategory(catID, (error, films) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        if (films == null) {
            res.status(204).send()
            return
        }
        res.status(200).send(films)
    })
})

//return film by string entered and rental_rate limit entered
app.get('/search', (req, res) => {
    const string = req.query.string.toUpperCase()
    const rental_rate = parseFloat(req.query.rental_rate)
    Film.findByString(string, rental_rate, (error, films) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        if (films == null) {
            res.status(204).send()
            return
        }
        res.status(200).send(films)
    })
})

app.get('/staff/:staff_id', (req, res) => {
    const staffID = parseInt(req.params.staff_id)
    Staff.findByID(staffID, (error, info) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        if (info == null) {
            res.status(204).send()
            return
        }
        res.status(200).send(info)
    })
})

app.get('/customer/:customer_id', (req, res) => {
    const customerID = parseInt(req.params.customer_id)
    Customer.findByID(customerID, (error, info) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        if (info == null) {
            res.status(204).send()
            return
        }
        res.status(200).send(info)
    })
})

app.get('/rental_rate', (req, res) => {
    Film.findRates((error, rates) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(200).send(rates)
    })
})

app.get('/stores', (req, res) => {
    Staff.findStores((error, stores) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(200).send(stores)
    })
})

app.post('/review', isLoggedInMiddleware, (req, res) => {
    var info = req.body
    //check for missing data
    if (info.filmID == undefined || info.customerID == undefined || info.review.rating == undefined || info.review.description == undefined) {
        res.status(400).send({ 'error_msg': 'missing data' })
        return
    }
    //check if staff exist
    Customer.addReview(info.customerID, info.filmID, info.review, (error, results) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(200).send(results)
    })
})

app.get('/review/:filmID', (req, res) => {
    const filmID = parseInt(req.params.filmID)
    Customer.getReviews(filmID, (error, results) => {
        if (error) {
            res.status(500).send({ 'error_msg': 'Internal server error' })
            return
        }
        res.status(200).send(results)
    })
})

module.exports = app