const express = require('express');

const bodyParser = require('body-parser');


 

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = "mongodb+srv://mode-mongo-crud:Arif012210@cluster0.qmxdm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  app.get('/products', (req, res) => {
    productCollection.aggregate([ { $sample: { size: 3 } } ]
   )
    .toArray( (err, documents) => {
      res.send(documents);
    })
  })


  app.post("/addProduct", (req, res) => {
  const product = req.body;
  productCollection.insertOne(product)
  .then(resust => {
    console.log('data added succesfully');
    res.redirect("/");
  })
  console.log(product);
  })


  app.patch('/update/:id', (req, res) => {
    console.log(req.body.price);
       productCollection.updateOne({_id: ObjectId(req.params.id)},
       
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    
    .then(result => {
      res.send(result.modifiedCount > 0);
    })

  })


  
  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount > 0 );
    });
  })

app.get('/product/:id', (req, res) => {
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray( (err, documents) => {
      res.send(documents[0]);
    })
})

});


app.listen(3000);