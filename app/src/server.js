var express = require('express');
var config = require('./config');
var logger = require('./logger').getLogger('server');
var xmlLoader = require('./xmlLoader');
var app = express();
var router = express.Router();

// Initial config
logger.debug('Configuring');
app.set('view engine', 'jade');
app.set('views', __dirname + '/view');

// Middleware setup
logger.debug('Setting up middleware');
app.use('/3rdparty', express.static(__dirname + '/../../node_modules'));
app.use(express.static(__dirname + '/../resources'));

router.get('/', function (req, res) {
    res.status(200).render('index');
});

router.get('/api/character', function (req, res) {
    xmlLoader.listXmlFiles(function (err, files) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).send(files);
    });
});

router.get('/api/character/:filename', function (req, res) {
    xmlLoader.loadXmlFile(req.params.filename, function (err, data) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(200).send(data);
    });
});

router.use(function (req, res) {
    logger.error('Failed to load page [%s]', req.url);
    res.status(404).render('error', {error: {msg: 'Unable to locate page ' + req.url, info: ''}});
});

router.use(function (err, req, res) {
    logger.error('Internal server error on page [%s]', req.url);
    console.error(err.stack);
    res.status(500).render('error', {error: {msg: 'An error occurred during the request.', info: err}});
});

app.use(router);

app.listen(config.get('express:port'), config.get('express:ip'), function (error) {
    if (error) {
        logger.error(error);
        process.exit(1);
    }

    logger.info('Server started in %s mode and listening at http://%s:%s',
        app.settings.env, config.get('express:ip'), config.get('express:port'));
});