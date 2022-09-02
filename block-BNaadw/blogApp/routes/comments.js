var express = require('express');
var router = express.Router();
let Comment = require('../models/comments');
let Article = require('../models/articles')

// update comment

router.get('/:commentId/edit', (req, res, next) => {
    var commentId = req.params.commentId;
    Comment.findById(commentId, (err, comment) => {
        if (err) return next(err);
        res.render('editComment', { comment })
    })
})

router.post('/:id', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err, comment) => {
        console.log(req.body)
        if (err) return next(err);
        res.redirect('/articles/' + comment.articleId)
    })
})

router.get('/:id/delete', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndDelete(id, (err, comment) => {
        if (err) return next(err);
    // edge case when comment delted comments  refernce id is also deleted

        Article.findByIdAndUpdate(comment.articleId, { $pull: { comments: comment.id } }, (err, article) => {
            if (err) return next(err);
            res.redirect('/articles/' + comment.articleId)
        })
    })
})

router.get('/:id/like', (req, res, next) => {
    var id = req.params.id;
    Comment.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, comment) => {
        if (err) return next(err);
        res.redirect('/articles/' + comment.articleId);
    })
})

module.exports = router;
