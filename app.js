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

//setup express static link
app.use(express.static('public/'));

//establish database connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
});

mongoose.set('useFindAndModify', false);

//express server
app.listen(process.env.PORT || port, () => console.log(`Wiki API starts on ${port}`));

//setup article schema and article model
const articleSchema = {
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
};

const Article = mongoose.model("Article", articleSchema);

app.get('/articles', (req, res) => {
    Article.find({}, (err, foundArticles) => {
        if (!err) {
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
});

app.post('/articles', (req, res) => {
    const articleTitle = req.body.title;
    const articleContent = req.body.content;

    const article = new Article({
        title: articleTitle,
        content: articleContent
    });

    article.save((err) => {
        if (!err) {
            res.send(`Successfully created a new article`);
        } else {
            res.send(err);
        }
    });


});