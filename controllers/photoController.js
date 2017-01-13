const Photo = require('../models/Photo.js');

exports.getPhotos = (req, res, next) => {
    Photo.find({}, (err, results) => {
        res.json(results)
    });
}

exports.getPhotoById = (req, res, next) => {
    if(req.params.id)
        Photo.find({_id: req.params.id }, (err, results)=>{
           res.json(results);
        });
    else res.json({err: 'You did not provide an id!!!!'});
}

exports.getPhotoByCategory = (req, res, next) => {
    if(req.params.category)
        Photo.find({category: req.params.category }, (err, results)=>{
           res.json(results);
        });
    else res.json({err: 'You did not provide a category!!!!'});
}

exports.postPhoto = (req, res, next) => {
    const {title, date, url, isPublic} = req.body;
    
    if(!title || !date || !url || !isPublic)
        return res.send({error: "You did not enter all needed data!"});

    Photo.findOne({ url }, (err, existingUrl) => {
        if(err) return next(err);
        
        if(existingUrl)
            return res.status(422).send({"error": "There is already image with such a url!"});
        
        const photo = new Photo({ title, url, isPublic, date });
        
        photo.save();
        res.json(photo);
    });
}

exports.deletePhoto = (req, res, next) => {
    if(req.params.id){
        Photo.findByIdAndRemove(req.params.id, (err, results) =>{
            res.json(results);
        });
    } else {
        res.json({err: "You didn't pass any id"});
    }

}