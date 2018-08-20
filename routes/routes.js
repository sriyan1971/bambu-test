
const dbConf = require('../config/bambu_mdb')
const appRouter = function (app) {
    const mongoose = require('mongoose');
    mongoose.Promise = require('bluebird');
    mongoose.connect('mongodb://localhost:27017/bambu' , { useMongoClient: true, promiseLibrary: require('bluebird')} ) 
  .then(() => console.log('Succesfully connected to bambu mongoDB '))
  .catch((err) => console.error('mongo erro' + err));

  const PersonSchema = new mongoose.Schema({
    name:{ type: String, required: false, match: /[a-z]/ },
    age:{type:Number, min:18, max:100, required: false },
    latitude:{ type: Number, required: false},
    longitude:{ type: Number, required: false},
    monthlyIncome: {type: Number, required: false},
    experienced: {type: Boolean, required: false},
    score: {type: Number, required: false, min:0, max:1,index: true}
});

// a setter to capitalize the name
PersonSchema.path('name').set(function (v) {
return capitalize(v);
});

const personModel = mongoose.model('persons', PersonSchema,'persons');

    //root API end
    app.get("/", function(req, res) {
        res.status(200).send("Welcome to our Bambu restful API");
    });
  
    // API end point to get  all persons in the database 
    app.get("/all-people", function (req, res) {
      personModel.find({ }, function (error, persons) {
        if (error) {
            console.log(persons);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).send(reponceStr);
        } else if (persons) { 
            console.log(persons);
            res.setHeader('Content-Type', 'application/json');
            res.status(200).send(persons);
         }
        }).sort({'score':-1})
    });

     // API end point to get  persons with these optional query parameters
     // age=23 , latitude=40.71667, longitude=19.56667, monthlyIncome=5500&, experienced=false
    app.get("/people-like-you", function (req, res) { 
        let age = req.query.age ;
        let latitude = req.query.latitude;
        let longitude = req.query.longitude;
        let monthlyIncome =  req.query.monthlyIncome;
        let experienced =req.query.experienced;   
               
        personModel.find({$or:[ {'age':age}, {'latitude':latitude}, {'longitude':longitude}, {'monthlyIncome':monthlyIncome}, {'experienced':experienced} ] }, function (error, persons) {  //  , latitude : latitude, longitude : longitude, monthlyIncome : monthlyIncome, experienced : experienced
            if (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                res.status(500).send(error);
            } 
            else if (persons) { 
                console.log({ peopleLikeYou: persons});
                res.setHeader('Content-Type', 'application/json');
                res.status(200).send({ peopleLikeYou: persons}); 
            }
            
        }).sort({'score':-1})

    });


  }

  
  
  module.exports = appRouter;