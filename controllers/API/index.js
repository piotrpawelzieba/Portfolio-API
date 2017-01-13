const bodyParser = require('body-parser');
const router = require('express').Router();

router.use(bodyParser.json());

router.get('/', (req, res) => {
    res.send('Success');
});


router.post('/', (req, res) => {
    res.send({
        id: req.body.id,
        full: req.body.full
    });
});



module.exports = router;