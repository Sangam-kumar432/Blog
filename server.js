const express = require('express');
const bodyparser = require('body-parser');
const router = require('./router');
const path = require('path');
const session = require('express-session');
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

// blog list page

app.get('/',async  (req, resp) => {
   resp.redirect('/route/home');
});

app.listen(port, () => { console.log('server is listening on port http://localhost:3000') });
