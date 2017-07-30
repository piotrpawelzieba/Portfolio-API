const Category = require('../models/Category');
const Photo = require('../models/Photo');

exports.postCategory = (req, res, next) => {
    let {title, isPrivate=true} = req.body;
    title = title.trim().toLowerCase();
    if(!title) res.status(400).send('You did not enter the title of the category!!');
    
    Category.findOne({title}, (err, existingCategory) => {
        if(err) next(err);

        if(existingCategory)
            return res.status(422).send({'error': 'There is already category with provided title!'});
        
        const category = new Category({title: title.toLowerCase(), isPrivate});

        category.save();
        res.status(200).send(`Category ${title} has been successfully created!`);
    });
}

exports.getCategories = (req, res, next) => {
    Category.find({}, (err, results) => {
        res.status(200).send(results);
    });
}


exports.updateCategory = (req, res, next) => {
    const {title, newTitle} = req.body;
     
    Category.findOneAndUpdate({title}, {title: newTitle.toLowerCase().trim()}, (err)=>{
        if(err) return res.send({err});

        return res.status(200).send();
    });
}

exports.removeCategory = (req, res, next) => {
    let {title} = req.params;
    title = title.toLowerCase().trim();
    console.log({title});
    Category.findOneAndRemove({title}, (err) => {
        
        if(err) 
            return res.send({err});

        Photo.find({category: title}, (err, results)  => {
            console.log({results});
            if(!results.length) return res.status(200).send(`Category ${title} has been successfully deleted!`);

            results.forEach(({_id:id}) => {
                Photo.findByIdAndUpdate(id, {category: null}, (err)=>{
                    if(err) return res.send({err});
                    
                });
            })
            return res.status(200).send(`Category ${title} has been successfully deleted!`);
        });

        
    });
}