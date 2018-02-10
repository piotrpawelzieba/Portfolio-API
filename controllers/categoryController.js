import Category from '../models/Category';
import Photo from '../models/Photo';

export const postCategory = (req, res, next) => {
  let { title } = req.body;
  const { isPrivate } = req.body;
  title = title.trim().toLowerCase();
  if (!title) {
    res.status(400).send('You did not enter the title of the category!!');
  }

  Category.findOne({ title }, (err, existingCategory) => {
    if (err) next(err);

    if (existingCategory) {
      return res
        .status(422)
        .send({ error: 'There is already category with provided title!' });
    }

    const category = new Category({ title: title.toLowerCase(), isPrivate });

    category.save();
    res.status(200).send(`Category ${title} has been successfully created!`);
  });
};

export const getCategories = (req, res) => {
  Category.find({}, (err, results) => {
    res.status(200).send(results);
  });
};

export const updateCategory = (req, res) => {
  const { title, newTitle } = req.body;

  Category.findOneAndUpdate(
    { title },
    { title: newTitle.toLowerCase().trim() },
    err => {
      if (err) return res.send({ err });

      return res.status(200).send();
    },
  );
};

export const removeCategory = (req, res) => {
  let { title } = req.params;
  title = title.toLowerCase().trim();
  Category.findOneAndRemove({ title }, err => {
    if (err) return res.send({ err });

    Photo.find({ category: title }, (error, results) => {
      if (error) return res.send({ error });

      if (!results.length) {
        return res
          .status(200)
          .send(`Category ${title} has been successfully deleted!`);
      }

      results.forEach(({ _id: id }) => {
        Photo.findByIdAndUpdate(id, { category: null }, findErr => {
          if (findErr) return res.send({ err: findErr });
        });
      });
      return res
        .status(200)
        .send(`Category ${title} has been successfully deleted!`);
    });
  });
};
