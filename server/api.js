
const mongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const connAdd = "mongodb://127.0.0.1:27017";


// get trains
app.get("/trains",(req,res)=>{
    mongoClient.connect(connAdd).then((clientObj) => {
        var database = clientObj.db("trainApp");
        database.collection('trainData').find({}).toArray().then((documents) => {
            res.send(documents);
        }).catch((error) => {
            res.send(error);
        })
    })
})
// add new train
app.post("/addTrain",(req,res)=>{
    const train = {
        trainName: req.body.trainName,
        trainNo:req.body.trainNo,
        day:req.body.day,
        route:req.body.route
    }    

    mongoClient.connect(connAdd).then((clientObj)=>{
        var database = clientObj.db("trainApp");
        database.collection('trainData').insertOne(train).then(()=>{
            res.send("new train added");
        }).catch((error)=>{
            console.log(error);
        })
    })
})


// get stations
app.get("/stations",(req,res)=>{
    mongoClient.connect(connAdd).then((clientObj)=>{
        var database = clientObj.db("trainApp");
        database.collection("stationData").find({}).toArray().then((documents)=>{
            res.send(documents);
        }).catch((errror)=>{
        console.log(errror);
    })
})
})

// add new station
app.post("/addStation",(req,res)=>{
    const station = {
        stationName: req.body.stationName,
        stationCode:req.body.stationCode.toUpperCase()
    }        
    mongoClient.connect(connAdd).then((clientObj)=>{
        var database = clientObj.db("trainApp");
        database.collection('stationData').insertOne(station).then(()=>{
            res.send("new station added");
        }).catch((error)=>{
            console.log(error);
        })
    })
})

app.listen(5000);
console.log("Server Strated 5000 : http://127.0.0.1:5000")