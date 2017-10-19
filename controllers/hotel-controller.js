const Hotel = require('mongoose').model('Hotel')
const Category = require('mongoose').model('Category')

module.exports = {
  addHotel: (req, res) => {
    let bodyParams = req.body

    let hotelObj = {
      title: bodyParams.title,
      location: bodyParams.location,
      image: bodyParams.image,
      category: bodyParams.type,
      description: bodyParams.textArea,
      dateCreation: Date.now()
    }

    Hotel.create(hotelObj)
      .then(h => {
        Category.findOne({ catName: req.body.type }).then(foundCat => {
          foundCat.hotels.push(h._id)
          foundCat.save().then(() => {
            res.render('hotels/generateHotel', { successMessage: 'All is ok' })
          })
        })
      })
      .catch(e => {
        res.locals.globalError = e.message
        res.render('hotels/generateHotel')
      })
  },
  getAddHotelView: (req, res) => {
    Category.find({}).then(cats => {
      res.render('hotels/generateHotel', { cats })
    })
  },
  getDetails: (req, res) => {
    let targetHotel = req.query.id

    Hotel.findById(targetHotel)
      .populate('comments.creator')
      .then(selectedHotel => {
        selectedHotel.prop = selectedHotel.like.length
        selectedHotel.viewCounter += 1
        selectedHotel.save().then(function (e) {
          if (e) {
            console.log(e)
          }

          let comments = []
          for (let elem of selectedHotel.comments) {
            let tempObj = {
              creator: elem.creator._id,
              userName: elem.creator.username,
              userComment: elem.description,
              userTitle: elem.title,
              datePosted: elem.creationDate.toUTCString()
            }

            comments.push(tempObj)
          }
          comments.sort((a,b)=>{
            return Date.parse(b.datePosted)-Date.parse(a.datePosted)
          })
          res.render('hotels/details', { selectedHotel, comments })
        })
      })
  },
  likeDislike: (req, res) => {
    let hotelId = req.params.id

    Hotel.findById(hotelId).then(selectedHotel => {
      let userId = req.user._id

      let indexOfElem = selectedHotel.like.indexOf(userId)
      if (indexOfElem >= 0) {
        selectedHotel.like.splice(indexOfElem, 1)
      } else {
        selectedHotel.like.push(userId)
      }
      selectedHotel.save().then(e => {
        if (e) {
          console.log(e)
        }
        res.redirect('back')
      })
    })
  },
  getList: (req, res) => {
    let page = Number(req.query.page) || 1
    let limit = 2
    let queryObj = {}

 
    Hotel.count({}).then(hotelCount => {

      let maxPages = Math.ceil(hotelCount / limit)

      let category = ""

      if (page > maxPages) {
        page = maxPages
      }
      if (page < 0) {
        page = 1
      }
      let pages = {
        nextPage: page + 1 > maxPages ? maxPages : page + 1,
        prevPage: page - 1 < 1 ? 1 : page - 1
      }

      if(req.query.location!=undefined&&req.query.location!=''){
        queryObj.location=req.query.location
      }
      if(req.query.type!=undefined&&req.query.type!=''){
        queryObj.category=req.query.type
      }

      Category.find().then(cats=>{
        Hotel.find(queryObj).sort('-dateCreation').skip((page - 1) * limit).limit(limit).then(hotels => {
          res.render('hotels/hotelList', { hotels, pages, cats })
        })
      })

    })
  }
}
