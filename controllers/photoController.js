const Photo = require('../models/Photo.js');
const multer = require('multer');
const fs = require('fs');


exports.getPhotos = (req, res, next) => {
    Photo.find({}, (err, results) => {
        res.json(results)
    });
}

exports.getPhotoById = (req, res, next) => {
    if (req.params.id)
        Photo.find({ _id: req.params.id }, (err, results) => {
            res.json(results);
        });
    else res.json({ err: 'You did not provide an id!!!!' });
}

exports.getPhotoByCategory = (req, res, next) => {
    if (req.params.category)
        Photo.find({ category: req.params.category }, (err, results) => {
            res.json(results);
        });
    else res.json({ err: 'You did not provide a category!!!!' });
}

const saveFile = (file) => {
    const { path, originalname } = file;
    const targetPath = 'Assets/uploads/' + originalname;

    const src = fs.createReadStream(path);
    const dest = fs.createWriteStream(targetPath);
    src.pipe(dest);
    fs.unlink(path); //deleting the tmp_path
    return targetPath;
}

exports.postPhoto = (req, res, next) => {
    const { title, date, url = "", isPublic, category } = req.body;
    if (!req.files) return res.status(400).send('You did not attach files!!');
    console.log(req.files);
    const paths = req.files.map(file => {
        const filePath = saveFile(file);

        if (!title)
            return res.send({ error: "You did not enter title!" });

        Photo.findOne({ url }, (err, existingUrl) => {
            if (err) return next(err);

            if (existingUrl)
                return res.status(422).send({ "error": "There is already image with such a url!" });

            const photo = new Photo({ title, category, isPublic, date: new Date(), url: filePath });

            photo.save();
        });
        
        return {url: filePath, title, category};
    });
    return res.status(200).send(paths);
}


exports.updatePhoto = (req, res, next) => {
    let { id, title, category, date, isPublic } = req.body;


    let update = {}
    update = category ? Object.assign({}, update, { category: category.toLowerCase() }) : update;
    update = date ? Object.assign({}, update, { date }) : update;
    update = isPublic ? Object.assign({}, update, { isPublic }) : update;

    console.log({ id });
    if (!id) return res.status(400).send();

    Photo.findOneAndUpdate({ _id: id }, update, (err) => {
        if (err) return res.send({ err });

        return res.status(204).send();
    })

}

exports.deletePhoto = (req, res, next) => {
    if (req.params.id) {
        Photo.findByIdAndRemove(req.params.id, (err, results) => {
            res.json(results);
        });
    } else {
        res.status(400).send();
    }

}

const upload = multer({ dest: './Assets/' });
exports.uploadFile = upload.array('file', "4");
