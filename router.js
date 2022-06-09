var express = require('express');
const { redirect } = require('express/lib/response');
var router = express.Router();
const blogdb = require('./blogdb');
const userdb = require('./userdb');



// show users

let readuser = async () => {
    let data = await userdb();
    data = await data.find().toArray();
    return data;
}

router.get('/users', (req, resp) => {
    readuser().then((data) => {
        resp.send(data);
    });
});


//home page

router.get('/home', (req, resp) => {
    resp.render('Home', { msg: 'you can contribute us a blog' });
});

router.post('/home', (req, resp) => {

    const insert = async () => {
        const db = await blogdb();
        const result = await db.insertOne(
            { title: req.body.title, desc: req.body.desc }
        );
        if (result.acknowledged) {
            console.warn("data inserted");
        }
    }

    insert();
    resp.render('Home', { msg: "blog added successfully!!" });


});



// Register page

router.get('/register', (req, resp) => {
    resp.render('register');
});

router.post('/register', (req, resp) => {
    const insert = async () => {
        const db = await userdb();
        const result = await db.insertOne(
            {
                profile: req.body.profile,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password1
            }
        );
        if (result.acknowledged) {
            console.warn("user registered");
        }
    }
    insert();
    resp.redirect('/route/login');
});

// login page

router.get('/login', (req, resp) => {
    resp.render('login');
});

router.post('/login', async (req, resp) => {

        const user = await userdb.findOne({username, password })
        if (!user) {
            resp.status(401).json({
                message: "Login not successful",
                error: "User not found",
            })
        } else {
             resp.render('home',{ msg: "Hii , you are logged in successfully !!" } );
    };


});

router.get('/index', (req, resp) => {
    if (req.session.user) {
        resp.render('index', { user: req.session.user });
    }
    else {
        resp.end("Unautorised user!!");
    }
});


router.get('/logout', (req, resp) => {
    req.session.destroy(function (err) {
        if (err) {
            // console.log(err);
            resp.send(err);
        }
        else {
            resp.render('base', { title: "Home", logout: "Logout Successful" });
        }
    })
})





module.exports = router;