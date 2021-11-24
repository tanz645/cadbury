const Joi = require('joi');
const { getConnection } = require('../client/mongodb')
const config = require('../config');
const ObjectId = require('mongodb').ObjectId; 
const path = require('path');

const userRegisterSchema = Joi.object({
    customer_id: Joi.string()
        .alphanum()
        .min(3)
        .max(100)
        .required()
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
const journey_state = [
    'registered',
    'receipt_uploaded',
    'creation_uploaded',
    'question_answered',
    'verified'
];
const CUSTOMER_COLLECTION = 'customers';
const reciept_mime_type = ['image/png','image/jpeg'];
const creation_mime_type = ['video/mp4','video/mpeg', 'video/ogg'];
const reciept_max_file_size = 2097152;
const creation_max_file_size = 4194304;

const register = async (body) => {
    try {
        await userRegisterSchema.validateAsync(body);        
        try {
            const db = getConnection(config.databases.mongo.db)
            const userCol = db.collection(CUSTOMER_COLLECTION);       
            body.created_at = new Date();
            body.updated_at = new Date();
            body.journey_state = journey_state[0];
            body.receipt_link = '';
            body.video_link = '';
            body.promo_code = '';
            body.verified = false;
            body.verified_at = null;
            body.verification_type = '';
            body.answer = '';
            body.result = '';
            body.result_type = '';
            const insert = await userCol.insertOne(body)
            return Promise.resolve({ token: insert.insertedId });
        } catch (error) {
            return Promise.reject('Server error')
        }
    } catch (e) {
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
        if(userById.journey_state !== journey_state[0]){
            return res.status(400).send('Not in proper state to upload receipt'); 
        }
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.receipt) {
            return res.status(400).send('No files were uploaded.');
        }
        receipt = req.files.receipt;    
        if(receipt.size > reciept_max_file_size){
            return res.status(400).send('Max file size 2mb');
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
    let creation;
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
        if(userById.journey_state !== journey_state[1]){
            return res.status(400).send('Not in proper state to upload video'); 
        }
        let uploadPath;
        if (!req.files || Object.keys(req.files).length === 0 || !req.files.creation) {
            return res.status(400).send('No files were uploaded.');
        }
        creation = req.files.creation;    
        if(creation.size > creation_max_file_size){
            return res.status(400).send('Max file size 4mb');
        }    
        if(!creation_mime_type.includes(creation.mimetype)){
            return res.status(400).send('Only mp4, mpeg and ogg are allowed.');
        }
        
        creation.name = `${req.body.token}_${creation.name}`;
        const creationLink = '/creation/' + creation.name;
        uploadPath = config.FILE_UPLOAD + creationLink;
        creation.mv(uploadPath, async function(err) {
            if (err){
                console.log(err)
                return res.status(500).send('Can not upload video');
            }   
            const toUpdate = {
                journey_state: journey_state[2],
                video_link: creationLink,
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
        if(userById.journey_state !== journey_state[2]){
            return res.status(400).send('Not in proper state to answer question'); 
        }
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
        if(userById.journey_state !== journey_state[3]){
            return res.status(400).send('Not in proper state to verify user'); 
        }
        const toUpdate = {
            journey_state: journey_state[4],            
            updated_at: new Date(), 
            verified_at: new Date(),
            verified: new Date(),
            verification_type:  req.body.type           
        }                       
        await userCol.updateOne({ _id:new ObjectId(req.body.token) },{ $set: toUpdate })
        return res.send('user verified');
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
module.exports = {
    register,
    receiptUpload,
    creationUpload,
    saveAnswer,
    getVideo,
    getRecipet,
    verify,
    getAllUsers
}