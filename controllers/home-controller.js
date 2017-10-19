const Hotel = require('mongoose').model('Hotel')

module.exports = {
  index: (req, res) => {
    Hotel.find({}).sort('-dateCreation').limit(20).then(hotels=>{
    res.render('home/index',{hotels})    
    })
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
