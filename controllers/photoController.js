import fileStream from 'fs';
import multer from 'multer';
import Photo from '../models/Photo';

export const getPhotos = async (req, res, next) => {
  try {
    const results = await Photo.find();
    res.json(results);
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

export const getPhotoById = async (req, res, next) => {
  try {
    if (req.params.id) {
      const photo = await Photo.find({ _id: req.params.id });
      return res.status(200).json(photo);
    }
    res.status(400).json({ err: 'You did not provide an id!!!!' });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

export const getPhotoByCategory = async (req, res, next) => {
  try {
    if (req.params.category) {
      const results = await Photo.find({ category: req.params.category });
      return res.status(200).json(results);
    }

    return res.status(400).json({ err: 'You did not provide a category!!!!' });
  } catch (err) {
    res.status(500).json(err);
    next(err);
  }
};

const saveFile = file => {
  const { path, originalname } = file;
  const targetPath = `Assets/uploads/${originalname}`;
  const src = fileStream.createReadStream(path);
  const dest = fileStream.createWriteStream(targetPath);
  src.pipe(dest);
  fileStream.unlink(path); // deleting the tmp_path
  return targetPath;
};

export const postPhoto = async (req, res, next) => {
  try {
    const { title, url = '', isPublic, category } = req.body;

    if (!req.files) {
      return res.status(400).send('You did not attach files!!');
    } else if (!title) {
      return res.status(400).send({ error: 'You did not enter title!' });
    }

    const [file] = req.files || [];
    const filePath = saveFile(file);
    const existingUrl = await Photo.findOne({ url });

    if (existingUrl) {
      return res
        .status(422)
        .json({ error: 'There is already image with such a url!' });
    }

    const photo = new Photo({
      title,
      category,
      isPublic,
      date: new Date(),
      url: filePath,
    });
    photo.save();
    return res.status(200).json({ url: filePath, title, category });
  } catch (error) {
    res.status(500).json(error);
    return next(error);
  }
};

export const updatePhoto = async (req, res, next) => {
  try {
    const { id, ...body } = req.body;
    const possibleKeys = ['title', 'category', 'url'];
    const photo = Object.keys(body).reduce(
      (acc, currentKey) =>
        possibleKeys.includes(currentKey)
          ? {
              ...acc,
              [currentKey]: req.body[currentKey],
            }
          : acc,
      {},
    );

    if (!id) {
      return res.status(400).send();
    }

    await Photo.findOneAndUpdate({ _id: id }, photo);
    return res.status(204).json();
  } catch (error) {
    res.status(500).json({ error });
    return next(error);
  }
};

export const deletePhoto = async (req, res, next) => {
  try {
    if (req.params.id) {
      await Photo.findByIdAndRemove(req.params.id);
      return res.status(200).json();
    }
    return res.status(400).json('You did not provide id');
  } catch (error) {
    res.status(500).json({ error });
    return next(error);
  }
};

const upload = multer({ dest: './Assets/' });
export const uploadFile = upload.array('file', '4');
