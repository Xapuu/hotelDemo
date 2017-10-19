const Category = require('mongoose').model('Category')

module.exports = {
    getView:(req,res)=>{
        res.render('cat/catForm')
    },
    createCat:(req,res)=>{
        console.log(req.body)
        Category.create({
            catName:req.body.category
        }).then((e)=>{
            res.redirect('/')
        })
    }
}