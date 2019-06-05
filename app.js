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

//Getting All Articles 
app.route('/articles')

    .get((req, res) => {
        Article.find({}, (err, foundArticles) => {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err);
            }
        });
    })

    .post((req, res) => {
        const articleTitle = req.body.title;
        const articleContent = req.body.content;

        const article = new Article({
            title: articleTitle,
            content: articleContent
        });

        article.save((err) => {
            if (!err) {
                res.send(`Successfully created a new article.`);
            } else {
                res.send(err);
            }
        });
    })

    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send(`Successfully deleted all articles.`);
            } else {
                res.send(err);
            }
        });
    });

//Getting Specific Article
app.route('/articles/:articleTitle')

    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, foundArticle) => {
            if (!err) {
                if (foundArticle) {
                    res.send(foundArticle);
                } else {
                    res.send(`No article with "${req.params.article}" could be found!`);
                }
            }
        });
    })

    .put((req, res) => {
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            title: req.body.title,
            content: req.body.content
        }, (err) => {
            if (!err) {
                res.send(`Successfully updated the article.`);
            }
        });
    })

    .patch((req, res) => {
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            $set: req.body
        }, (err) => {
            if (!err) {
                res.send(`Successfully updated the article`);
            }
        });
    });