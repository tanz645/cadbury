const Joi = require('joi');
const axios = require('axios');
const fs = require('fs')
const { getConnection } = require('../client/mongodb')
const config = require('../config');
const ObjectId = require('mongodb').ObjectId; 
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const command = ffmpeg();
const userRegisterSchema = Joi.object({
    cid: Joi.string()        
        .min(1)
        .max(200)
        .required(),
    uid: Joi.string()
        .required(),
    captcha: Joi.string().required(),
});
const userAnswerSchema = Joi.object({
    answer: Joi.string()        
        .min(1)
        .max(500)
        .required(),
    token: Joi.string()        
        .min(1)
        .max(200)
        .required()
});
const userVerifySchema = Joi.object({
    type: Joi.string()        
        .valid('aeon', 'tf','econsave','nationwide','invalid')
        .required(),
    token: Joi.string()        
        .min(1)
        .max(200)
        .required()
});
const userResultSchema = Joi.object({
    type: Joi.string()        
        .valid('video', 'bespoke','nationwide')
        .required(),
    token: Joi.string()        
        .min(1)
        .max(200)
        .required()
});
const journey_state = [
    'registered',
    'receipt_uploaded',
    'creation_uploaded',
    'question_answered',
    'verified',
    'result_published'
];
const CUSTOMER_COLLECTION = 'customers';
const reciept_mime_type = ['image/png','image/jpeg', 'application/pdf'];
const creation_mime_type = ['video/mp4','video/mpeg', 'video/ogg'];
const creation_audio_mime_type = ['audio/mp3','audio/mpeg'];
const reciept_max_file_size = 10485760;
const creation_max_file_size = 20971520;

const register = async (body) => {
    try {
        await userRegisterSchema.validateAsync(body);        
        try {
            const captchaResposne = await axios({
                method: 'POST',
                url: 'https://www.google.com/recaptcha/api/siteverify',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: `secret=6Lf7VaUdAAAAAKFoMzlLqvMmAavta_rUemqAm2Ah&response=${body.captcha}`               
              })
              console.log(captchaResposne.data)
            if(!captchaResposne.data.success || captchaResposne.data.success === 'false'){
                throw new Error('Captcha not valid')
            }
            const db = getConnection(config.databases.mongo.db)
            const userCol = db.collection(CUSTOMER_COLLECTION);       
            body.created_at = new Date();
            body.updated_at = new Date();
            body.journey_state = journey_state[0];
            body.cid = body.cid,
            body.uid = body.uid,
            body.receipt_link = '';
            body.video_link = '';                   
            body.promo_code = '';
            body.verified = false;
            body.verified_at = null;
            body.verification_type = '';
            body.answer = '';
            body.result_set_at = null;
            body.result = '';
            body.result_type = '';
            body.customer_id = '';
            const insert = await userCol.insertOne(body)
            return Promise.resolve({ token: insert.insertedId });
        } catch (error) {
            console.log(error)
            return Promise.reject('Server error')
        }
    } catch (e) {
        console.log(e)
        return Promise.reject(e.details[0].message)
    }
};

const receiptUpload = async (req, res) => {
    let receipt;
    if(!req.body || !req.body.token){
        return res.status(400).send('Token is required');
    }
    const db = getConnection(config.databases.mongo.db)
    const userCol = db.collection(CUSTOMER_COLLECTION);
    try {
        const userById = await userCol.findOne({ _id: new ObjectId(req.body.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        // if(userById.journey_state !== journey_state[0]){
        //     return res.status(400).send('Not in proper state to upload receipt'); 
        // }
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.receipt) {
            return res.status(400).send('No files were uploaded.');
        }
        receipt = req.files.receipt;    
        if(receipt.size > reciept_max_file_size){
            return res.status(400).send('Max file size 10mb');
        }    
        if(!reciept_mime_type.includes(receipt.mimetype)){
            return res.status(400).send('Only png and jpeg/jpg are allowed.');
        }
        
        receipt.name = `${req.body.token}_${receipt.name}`;
        const recieptLink = '/receipt/' + receipt.name;
        uploadPath = config.FILE_UPLOAD + recieptLink;
        receipt.mv(uploadPath, async function(err) {
            if (err){
                console.log(err)
                return res.status(500).send(err);
            }            
            const toUpdate = {
                journey_state: journey_state[1],
                receipt_link: recieptLink,
                updated_at: new Date(), 
            }              
            try {
                await userCol.updateOne({ _id:new ObjectId(req.body.token) },{ $set: toUpdate })
                return res.send('File uploaded!');
            } catch (error) {
                console.log(error)
                return res.status(500).send('Sorry can not process your request');
            }      
            
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }
    
};

const creationUpload = async (req, res) => {
    let creation, creationAudio;
    if(!req.body || !req.body.token){
        return res.status(400).send('Token is required');
    }
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.body.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        // if(userById.journey_state !== journey_state[1]){
        //     return res.status(400).send('Not in proper state to upload video'); 
        // }
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0 || (!req.files.creation && !req.files.creationAudio)) {
            return res.status(400).send('No files were uploaded.');
        }
    
        creation = req.files.creation;  
        creationAudio = req.files.creationAudio;
        console.log(creation.size)
        if(creation.size > creation_max_file_size || creationAudio.size > creation_max_file_size){
            return res.status(400).send('Max file size 20mb');
        }    
        if(!creation_mime_type.includes(creation.mimetype)){
            return res.status(400).send('Only mp4, mpeg and ogg are allowed.');
        }
        
        if(!creation_audio_mime_type.includes(creationAudio.mimetype)){
            return res.status(400).send('Only mp3,mpeg');
        }
        actualLinkName = `${req.body.token}_actual_${creation.name}`;
        creation.name = `${req.body.token}_${creation.name}`;        
        console.log({
            actualLinkName
        })
        creationAudio.name = `${req.body.token}_${creationAudio.name}`;
        const creationLink = '/creation/' + creation.name;
        const creationAudioLink = '/creation/' + creationAudio.name;
        const actualLink = `/creation/${actualLinkName}`;
        uploadPath = config.FILE_UPLOAD + creationLink;
        audioPath = config.FILE_UPLOAD + creationAudioLink;
        const actualLinkPath = config.FILE_UPLOAD +actualLink;
        console.log(req.body.size)
        creation.mv(uploadPath, function(err) {
            if (err){
                console.log(err)
                return res.status(500).send('Can not upload video');
            }   
            creationAudio.mv(audioPath, function(err){
                if (err){
                    console.log(err)
                    return res.status(500).send('Can not upload audio');
                }
                const actualLink = `/creation/${actualLinkName}`;
                command
                    .input(audioPath)
                    .input(uploadPath)                                     
                    // .keepDAR()
                    .on('error', function(err) {
                        console.log(`Converting An error occurred ${req.body.token} : ` + err.message);
                        // fs.unlinkSync(uploadPath);
                        // fs.unlinkSync(audioPath);
                        return res.status(500).send('Sorry can not process your request');
                    })
                    .on('end', function() {
                        console.log(`Ended ${req.body.token} : `);
                        // fs.unlinkSync(uploadPath)
                        // fs.unlinkSync(audioPath)  
                    })
                    .save(actualLinkPath)  
                
                    console.log(`Conversion Processing finished: ${req.body.token}!`);
                    const toUpdate = {
                        journey_state: journey_state[2],
                        video_link: actualLink,                            
                        updated_at: new Date(), 
                    }                       
                    userCol.updateOne({ _id:new ObjectId(req.body.token) },{ $set: toUpdate }).then(() => {
                        return res.send('File uploaded!');
                    }).catch(error => {
                        console.log(error)
                        return res.status(500).send('Sorry can not process your request');
                    }) 
                                                                                      
            })
             
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
};

const saveAnswer = async (req, res) => {    
    if(!req.body || !req.body.token){
        return res.status(400).send('Token is required');
    }
    if(!req.body.answer){
        return res.status(400).send('Answer can not be empty');
    }
    try {
        await userAnswerSchema.validateAsync(req.body);
    } catch (error) {        
        return res.status(400).send(error.details[0].message);        
    }
    
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.body.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        // if(userById.journey_state !== journey_state[2]){
        //     return res.status(400).send('Not in proper state to answer question'); 
        // }
        const toUpdate = {
            journey_state: journey_state[3],            
            updated_at: new Date(), 
            answer: req.body.answer
        }                       
        await userCol.updateOne({ _id:new ObjectId(req.body.token) },{ $set: toUpdate })
        return res.send('answer saved');
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
};

const getVideo = async (req, res) => {   
    if(!req.query || !req.query.token){
        return res.status(400).send('Token is required');
    }    
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.query.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        return res.send(userById.video_link);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
};

const getRecipet = async (req, res) => {   
    if(!req.query || !req.query.token){
        return res.status(400).send('Token is required');
    }    
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.query.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        return res.send(userById.receipt_link);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
};

const verify = async (req, res) => {
    if(!req.body || !req.body.token){
        return res.status(400).send('Token is required');
    }    
    try {
        await userVerifySchema.validateAsync(req.body);
    } catch (error) {        
        return res.status(400).send(error.details[0].message);        
    }
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.body.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        if(!userById.customer_id){
            return res.status(400).send('No customer id found');
        }
        const properties = [
            {
                "property": "verify",
                "value": req.body.type
            }
        ];
        properties.push({
            "property": "video_url",
            "value": `https://www.cadbury.cnygiftfromtheheart.com/message-play?hash=${userById._id}`
        })
        const hubspotResposne = await axios({
            method: 'POST',
            url: `https://api.hubapi.com/contacts/v1/contact/vid/${userById.customer_id}/profile?hapikey=${config.hubspot_api_key}`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                properties             
            })               
          })          
        // if(userById.journey_state !== journey_state[3]){
        //     return res.status(400).send('Not in proper state to verify user'); 
        // }
        
        const toUpdate = {
            journey_state: journey_state[4],            
            updated_at: new Date(), 
            verified_at: new Date(),
            verified: true,
            verification_type:  req.body.type           
        }                       
        await userCol.updateOne({ _id:new ObjectId(req.body.token) },{ $set: toUpdate })
        return res.send('user verified');
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
}

const setResult = async (req, res) => {
    if(!req.body || !req.body.token){
        return res.status(400).send('Token is required');
    }    
    try {
        await userResultSchema.validateAsync(req.body);
    } catch (error) {        
        return res.status(400).send(error.details[0].message);        
    }
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.body.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        if(userById.journey_state !== journey_state[4]){
            return res.status(400).send('Need to be verified to publish result'); 
        }
        if(!userById.customer_id){
            return res.status(400).send('No customer id found');
        }
        const hubspotResposne = await axios({
            method: 'POST',
            url: `https://api.hubapi.com/contacts/v1/contact/vid/${userById.customer_id}/profile?hapikey=${config.hubspot_api_key}`,
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                properties: [
                    {
                        "property": "result",
                        "value": req.body.type
                    }
                ]                
            })               
          });          
        const toUpdate = {
            journey_state: journey_state[5],            
            updated_at: new Date(), 
            result_set_at: new Date(),            
            result_type:  req.body.type           
        }                       
        await userCol.updateOne({ _id:new ObjectId(req.body.token) },{ $set: toUpdate })
        return res.send('user result published');
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
}

const getAllUsers = async (req, res) => {
    
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const cursor = userCol.find({});    
        const result = await cursor.toArray();
        return res.json(result);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }    
}

const getUser = async (req, res) => {
    if(!req.params || !req.params.token){
        return res.status(400).send('Token is required');
    }    
    try {
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        const userById = await userCol.findOne({ _id: new ObjectId(req.params.token)});    
        if (!userById) {
            return res.status(400).send('No user found');        
        }
        return res.json(userById);
    } catch (error) {
        console.log(error)
        return res.status(500).send('Sorry can not process your request');
    }       
};

const handleHubspotCallback = (req, res) => {    
    if(req.body && req.body.vid && req.body.properties && req.body.properties.cid && req.body.properties.cid.value){
        const db = getConnection(config.databases.mongo.db)
        const userCol = db.collection(CUSTOMER_COLLECTION);
        console.log('webhook: userID:', req.body.properties.cid.value)
        userCol.findOne({ uid: req.body.properties.uid.value }).then(userById => {
            if (!userById) {
                console.log('webhook error ===> No user found');        
            }
            const toUpdate = {
                customer_id: req.body.vid,            
                updated_at: new Date(),                      
            }                       
            userCol.updateOne({ uid: req.body.properties.uid.value },{ $set: toUpdate }).then(result => {
                console.log(`webhook: updated user cid: [uid: ${req.body.properties.uid.value}]`, result)                
            }).catch(err => {
                console.log('webhook error ===> Can not update: ', err); 
            })            
        }).catch(err => {
            console.log('webhook error ===> No user found: ', err);  
        });
        return res.status(200).send('webhook triggered'); 
    }else{
        console.log('webhook error ===> Not valid request: ', req.body); 
        return res.status(400).json({message: 'Not valid request', request: req.body});
    }
    
};

module.exports = {
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
    handleHubspotCallback
}