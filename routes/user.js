const express = require('express');
const router = express.Router();

router.post('/login', (req, res)=>{
    res.send('Login response');
});
router.post('/user-greetings/register', (req, res)=>{
    res.send('user-greetings register');
});
router.post('/user-greetings/qa', (req, res)=>{
    res.send('user-greetings qa');
});
router.get('/user-greetings', (req, res)=>{
    res.send('user-greetings');
});
router.get('/user-greetings/:id', (req, res)=>{
    res.send('user-greetings single user');
});
router.post('/user-greetings/upload', (req, res)=>{
    res.send('user-greetings upload');
});
router.post('/user-greetings/:id/upload-reciept', (req, res)=>{
    res.send('user-greetings upload reciept');
});
router.post('/user-greetings/:id/verify/:verified', (req, res)=>{
    res.send('user-greetings upload reciept');
});
router.post('/user-greetings/:id/win/:verified', (req, res)=>{
    res.send('user-greetings upload reciept');
});

module.exports = router;