import Category from '../models/Category';
import Photo from '../models/Photo';

export const postCategory = async (req, res, next) => {
  try {
    let { title } = req.body;
    const { isPrivate } = req.body;

    if (!title) {
      res.status(400).json('You did not enter the title of the category!!');
    }

    title = title.trim().toLowerCase();
    const existingCategory = await Category.findOne({ title });

    if (existingCategory) {
      return res
        .status(422)
        .json({ error: 'There is already category with provided title!' });
    }

    const category = new Category({ title: title.toLowerCase(), isPrivate });
    category.save();
    return res
      .status(200)
      .json(`Category ${title} has been successfully created!`);
  } catch (err) {
    if (err) {
      next(err);
    }
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const results = await Category.find({});
    return res.status(200).json(results);
  } catch (err) {
    res.status(500).json(err);
    return next(err);
  }
};

export const updateCategory = async (req, res) => {
  const { title, newTitle } = req.body;

  try {
    await Category.findOneAndUpdate(
      { title },
      { title: newTitle.toLowerCase().trim() },
    );

    return res.status(200).json();
  } catch (err) {
    if (err) {
      return res.status(500).send({ err });
    }
  }
};

export const removeCategory = async (req, res, next) => {
  let { title } = req.params;
  title = title.toLowerCase().trim();

  try {
    const photosWithRemovedCategory = await Photo.find({ category: title });

    photosWithRemovedCategory.forEach(async ({ _id: id }) => {
      await Photo.findByIdAndUpdate(id, { category: null });
    });

    if (!photosWithRemovedCategory.length) {
      return res
        .status(200)
        .json(`Category ${title} has been successfully deleted!`);
    }

    await Category.findOneAndRemove({ title });

    return res
      .status(200)
      .json(`Category ${title} has been successfully deleted!`);
  } catch (err) {
    if (err) {
      res.send({ err });
    }
    next(err);
  }
};
