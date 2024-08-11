const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 4000;


//middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9vjp0tf.mongodb.net/?appName=Cluster0`;
console.log(uri)


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();

    const coffeCollection = client.db('coffeDB').collection('coffe');
    const userCollection = client.db('coffeDB').collection('user');

   app.get('/coffe',async(req,res) =>{
      const cursor = coffeCollection.find();
      const result = await cursor.toArray();
      res.send(result)
   })


   app.get('/coffe/:id',async(req,res) =>{
    const id = req.params.id;
    const query = {_id:new ObjectId(id)}
    const result = await coffeCollection.findOne(query)
    res.send(result);
   })
   
   
    app.post('/coffe',async(req,res) =>{
      const newCoffe = req.body;
      console.log(newCoffe);
      const result = await coffeCollection.insertOne(newCoffe);
      res.send(result)
    })

    app.put('/coffe/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const options = {upsert:true};
      const updatedCoffe = req.body;
      const coffe ={
        $set:{
          name: updatedCoffe.name,
          quantity: updatedCoffe.quantity,
          supplier: updatedCoffe.supplier,
          taste: updatedCoffe.taste,
          category: updatedCoffe.category,
          details: updatedCoffe.details,
          photo: updatedCoffe.photo
        }
      }
      const result = await coffeCollection.updateOne(filter,coffe,options);
      res.send(result);
    })


    app.delete('/coffe/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await coffeCollection.deleteOne(query);
      res.send(result);
    })

    //user related apis

   app.get('/user',async(req,res)=>{
    const cursor = userCollection.find();
    const users = await cursor.toArray();
    res.send(users)
   })

   app.post ('/user',async(req,res)=>{
    const user =  req.body;
    console.log(user);
    const result = await userCollection.insertOne(user);
    res.send(result);
   }) 


   app.patch('/user',async(req,res) =>{
    const user = req.body;
    const filter = {email:user.email}
    const updateDoc = {
      $set:{
        lastLoggedAt:user.lastLoggedAt
      }
    }
    const result = await userCollection.updateOne(filter,updateDoc)
    res.send(result);
   })


   app.delete('/user/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await userCollection.deleteOne(query);
    res.send(result)
   })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('coffe making server is runnig')
})


app.listen(port,()=>{
    console.log(`coffee server is running on port:${port}`)
})