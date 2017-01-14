const Photo = require('../models/Photo');
const path = require('path');
console.log(path);
debugger;
module.exports = (req, res) => {
    Photo.find({}, (err, response) => {
        const photos = response.map(({title, url, category, isPublic})=>({title, url, category, isPublic}));
        console.log(photos);
        const viewBag = {
            Title:"Photo Repository", 
            Subtitle:"Upload photo",
            photos
        };
        res.render('../views/pages/index.ejs', viewBag);
    });
}
