const express = require('express');
const app = express();
const port = process.env.PORT || 7800;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const mongourl = "mongodb://localhost:27017";
const bodyParser = require('body-parser');
let db;
let col_name="users";

//Encode in utf-8 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Health Check
app.get('/',(req,res) => {
    res.status(200).send('Health Ok')
});


//Post(Insert Data)
app.post('/addUser',(req,res) => {
    console.log(req.body)
    db.collection(col_name).insert(req.body,(err,result) => {
        if(err) throw err;
        res.send("Data Inserted")
    })
})

//Get(Get users)
app.get('/users',(req,res)=>{
    var query = {"isActive":true}
    db.collection(col_name).find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
});

//update users
app.put('/updateUser',(req,res) => {
    db.collection(col_name).update(
        {_id:Number(req.body._id)},
        {
            $set:{
                "name": req.body.name,
                "city": req.body.city,
                "isActive": true
            }
        },(err,result) => {
            if(err) throw err;
            res.send('Data Updated')
        }
    )
});

//Delete User
app.delete('/deleteUser',(req,res) => {
    db.collection(col_name).remove({_id:Number(req.body._id)},(err,result) => {
        if(err) throw err;
        res.send('Data Deleted')
    })
})


MongoClient.connect(mongourl,(err,client) => {
    if(err) console.log(err);
    db = client.db('EduSep');
    app.listen(port,(err) => {
        console.log(`Server is ruuning on port ${port}`);
    });
});
