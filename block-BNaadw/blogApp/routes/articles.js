var express = require('express');
var router = express.Router();
let Article = require('../models/articles');
let Comment = require('../models/comments')

// dispaly  all the articles
router.get('/', (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('listArticles', { articles: articles })
  })
})

// create article form
router.get('/new', (req, res, next) => {
  res.render('createArticle');
})

// create articles
router.post('/', (req, res, next) => {
  req.body.tags = req.body.tags.trim().split();
  console.log(req.body)
  Article.create(req.body, (err, article) => {
    if (err) return next(err);
    
    res.redirect('/articles')
  })
})
// render specific article 
router.get('/:id', (req, res, next) => {
  var id = req.params.id;

  // Article.findById(id, (err, article) => {
  //   console.log(article.tags);
  //   if (err) return next(err);
  //   res.render('articleDetails', { article })
  // })

  // query building
  Article.findById(id).populate('comments').exec((err,article) => {
    if (err) return next(err);
    console.log(article);
    res.render('articleDetails', { article })
  })
})

// render article edit form 
router.get('/:id/edit', (req, res, next) => {
  var id = req.params.id;
  Article.findById(id, (err, article) => {
    article.tags = article.tags.join(" ");
    if (err) return next(err);
    res.render('editArticle', { article })
  })
})

// update specific article 
router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  req.body.tags = req.body.tags.trim().split();
  Article.findByIdAndUpdate(id, req.body, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + id)
  })
})

// delete a specific article

router.get('/:id/delete', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndDelete(id, (err, article) => {
    if (err) return next(err);
    // edge case when article delted comments also deleted
    Comment.remove({ articleId : article.id}, (err) => {
    if (err) return next(err);
    res.redirect('/articles');
    })
  })
})
// like button
router.get('/:id/like', (req, res, next) => {
  var id = req.params.id;
  Article.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  })
})
// comment
router.post('/:articleId/comments' ,(req,res,next) => {
  var articleId = req.params.articleId;
  console.log(req.body);
  req.body.articleId = articleId;
  Comment.create(req.body, (err,comment) => {
    if(err) return next(err);
    Article.findByIdAndUpdate(articleId,{$push: { comments : comment.id}}, (err,article) => {
    if(err) return next(err);
    res.redirect('/articles/' + articleId);
    })
  })
})
module.exports = router;
