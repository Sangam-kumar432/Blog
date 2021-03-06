var express = require('express');
const { route } = require('express/lib/application');
const res = require('express/lib/response');
const { redirect } = require('express/lib/response');
var router = express.Router();
const ecommdb = require('./ecommdb');

// show users

router.get('/users', async (req, resp) => {
    const finduser = async () => {
        let db = await ecommdb();
        db = db.collection('user');
        let user = await db.find(
            {}
        ).toArray();
        // console.log(user);
        if (!user) {
            resp.send("No user found ");
        } else
        {
            resp.render('index', { data:user , msg:"you can see the user list below"});
        };

    }
    finduser();
});


//home page

router.get('/home', (req, resp) =>
{
    const getblogs = async () => {
        let db = await ecommdb();
        db = db.collection('Verified');
        let blog = await db.find(
            {}
        ).toArray();
        // console.log(user);
        if (!blog) {
            resp.send("No blog found ");
        } else
        {
            resp.render('Home', { data:blog , msg:"see the blog list below"});
        };

    }
    getblogs();
});

router.post('/home', (req, resp) => {

    const insert = async () => {
        let db = await ecommdb();
        db = db.collection('unverified');
        const result = await db.insertOne(
            { title: req.body.title, desc: req.body.desc }
        );
        if (result.acknowledged) {
            console.warn("blog posted for approval");
        }
    }

    insert();
    const getblogs = async () => {
        let db = await ecommdb();
        db = db.collection('Verified');
        let blog = await db.find(
            {}
        ).toArray();
        // console.log(user);
        if (!blog) {
            resp.send("No blog found ");
        } else
        {
            resp.render('Home', { data:blog , msg:"Blog posted for approval"});
        };

    }
    getblogs();

});


// Pending blogs

router.get('/approve-pending-blogs', (req, resp) =>
{

    const getblogs = async () => {
        let db = await ecommdb();
        db = db.collection('unverified');
        let blog = await db.find(
            {}
        ).toArray();
        // console.log(user);
        if (!blog) {
            resp.send("No blog found ");
        } else
        {
            resp.render('blog/unverified', { data:blog , msg:"You haven't approved any blog yet"});
        };

    }
    getblogs();
});



router.post('/approve-pending-blogs', (req, resp) =>
{
    const findblog = async () => {
        let db = await ecommdb();
        db = db.collection('unverified');
        let blog = await db.findOne(
            {
                title:req.body.name
            }
        );
        console.log(blog);
        if (!blog) {
            resp.send("No blog found ");
        } else
        {
            resp.send("blog detected for approval");
            // resp.render('Home', { data:blog , msg:"see the blog list below"});
        };

    }
    findblog();



    // const insert = async () => {
    //     let db = await ecommdb();
    //     db = db.collection('Verified');
    //     const result = await db.insertOne(
    //         { title: req.body.title, desc: req.body.desc }
    //     );
    //     if (result.acknowledged) {
    //         console.warn("blog posted for approval");
    //     }
    // }

    // insert();



    // const getblogs = async () => {
    //     let db = await ecommdb();
    //     db = db.collection('unverified');
    //     let blog = await db.find(
    //         {}
    //     ).toArray();
    //     // console.log(user);
    //     if (!blog) {
    //         resp.send("No blog found ");
    //     } else
    //     {
    //         resp.render('blog/unverified', { data:blog , msg:"You haven't approved any blog yet"});
    //     };

    // }
    // getblogs();
});


// Register page

router.get('/register', (req, resp) => {
    resp.render('register');
});

router.post('/register', (req, resp) => {
    const insert = async () => {
        let db = await ecommdb();
        db = db.collection('user');
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

    const finduser = async () => {
        let db = await ecommdb();
        db = db.collection('user');
        let user = await db.findOne(
            { username: req.body.username , password:req.body.password }
        );
        // console.log(user);
        let result = user;
        if (!user) {
            resp.send("Invalid Username or password");
        } else
        {
            resp.render('loggedin', { data:result });
        };

    }
    finduser();

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