const express = require('express');
const bodyparser = require('body-parser');
const router = require('./router');
const path = require('path');
const session = require('express-session');
const blogdb = require('./blogdb');
const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use('/static', express.static(path.join(__dirname, 'views')));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.use('/route', router);

// home page


let readblogs = async ()=> {
    let data = await blogdb();
    data = await data.find().toArray();
    return data;
}



// let blogs = readblogs() .then((data)=>{
//     // console.log(data);
//     return data;
// });

// console.log(blogs);





app.get('/', (req, resp) => {
    readblogs() .then((data)=>{
        resp.send(data);
    });
    // render('Home' , {blogs});
    // resp.end();
});

// let data = await blogs();
//     let result = await data.find().toArray();
//     return result;

app.listen(port, () => { console.log('server is listening on port http://localhost:3000') });
