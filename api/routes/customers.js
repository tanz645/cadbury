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
    getAllUsers, 
    getUser 
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
router.get('/', (req, res) => {
    return getAllUsers(req, res);
});
router.get('/:token', (req, res) => {
    return getUser(req, res);
});

module.exports = router;