const express = require('express');
const router = express.Router();

const { 
    register, 
    receiptUpload, 
    creationUpload, 
    saveAnswer, 
    getVideo, 
    getRecipet, 
    verify, 
    setResult,
    getAllUsers, 
    getUser,
    handleHubspotCallback,
    creationNeedToProcess,
    creationNeedToProcessUpload
} = require('../controllers');

router.post('/login', (req, res) => {
    res.send('Login response');
});
router.post('/register', async (req, res) => {
    try {
        const result = await register(req.body)
        return res.json(result);
    } catch (error) {
        return res.send(error)
    }
});
router.post('/receipt/upload', (req, res) => {
    return receiptUpload(req, res)
});
router.get('/receipt', (req, res) => {
    return getRecipet(req, res);
});
router.post('/creation/upload', (req, res) => {
    return creationUpload(req, res)
});
router.get('/creation', (req, res) => {
    return getVideo(req, res);
});
router.post('/question/answer', (req, res) => {
    return saveAnswer(req, res)
});
router.put('/verify', (req, res) => {
    return verify(req, res)
});
router.put('/result-set', (req, res) => {
    return setResult(req, res)
});
router.post('/hubspot/callback', (req, res) => {
    return handleHubspotCallback(req, res)
});

router.get('/creation-need-to-process', (req, res) => {
    return creationNeedToProcess(req, res);
});

router.post('/creation-need-to-process-upload', (req, res) => {
    return creationNeedToProcessUpload(req, res);
});

router.get('/', (req, res) => {
    return getAllUsers(req, res);
});
router.get('/:token', (req, res) => {
    return getUser(req, res);
});



module.exports = router;