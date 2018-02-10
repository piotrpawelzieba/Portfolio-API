import 'path';
import Photo from '../models/Photo';

export default function(req, res) {
  Photo.find({}, (err, response) => {
    const photos = response.map(({ title, url, category, isPublic }) => ({
      title,
      url,
      category,
      isPublic,
    }));
    const viewBag = {
      Title: 'Photo Repository',
      Subtitle: 'Upload photo',
      photos,
    };
    res.render('../views/pages/index.ejs', viewBag);
  });
}
