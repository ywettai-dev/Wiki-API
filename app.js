const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

//setup view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

//establish database connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);

//express server
app.listen(process.env.PORT || port, () => console.log(`Wiki API starts on ${port}`));