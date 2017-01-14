const Photo = require('../models/Photo.js');
const multer = require('multer');
const fs = require('fs');


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

const savePhoto = (file) => {
    const {path, originalname} = file;
    const targetPath = 'Assets/uploads/' + originalname;

    const src = fs.createReadStream(path);
    const dest = fs.createWriteStream(targetPath);
    src.pipe(dest);
    fs.unlink(path); //deleting the tmp_path
    return targetPath;    
}

exports.postPhoto = (req, res, next) => {
    const {title, date, url = "", isPublic, category} = req.body;
    console.log(req.file);
    const photoUrl = savePhoto(req.file);

    if(!title)
        return res.send({error: "You did not enter title!"});

    Photo.findOne({ url }, (err, existingUrl) => {
        if(err) return next(err);
        
        if(existingUrl)
            return res.status(422).send({"error": "There is already image with such a url!"});
        
        const photo = new Photo({ title, category, isPublic, date: new Date(), url: photoUrl });
        
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

const upload = multer({dest: './Assets/'});
exports.uploadFile = upload.single('file');
    