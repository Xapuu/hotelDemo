const Hotel = require('mongoose').model('Hotel')


module.exports = {
    addComment:(req,res)=>{
        
        let currnetHotel = req.params.id
        let userId = req.user._id
        let commentBody=req.body
        let commentObj = {
            creator:userId,
            title:commentBody.title,
            description:commentBody.comment,
            creationDate:Date.now()
        }

        Hotel.findById(currnetHotel).then(selectedHotel=>{
            selectedHotel.comments.push(commentObj)

            selectedHotel.save().then(()=>{
                res.redirect('back')
            })
        })
    }
}