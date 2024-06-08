const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;


// middleWare
app.use(express.json())
app.use(cors())



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6ygkpv0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
    try {
      
        const database = client.db("reviveDB");
        const usedProducts = database.collection("usedProducts");
        const products = database.collection("products");
        const bookings = database.collection("bookings");

        app.get("/usedProducts", async (req, res) => {
          const result = await usedProducts.find().toArray();
          res.send(result);
        });

        app.get("/usedProducts/:id", async (req, res) => {
          const id = req.params.id;

          console.log(id);

          const allProducts = await products.find().toArray();

          const specificProducts = allProducts.filter(
            (products) => parseInt(products.category) === parseInt(id)
          );

          console.log(specificProducts);

          res.send(specificProducts);
        });

        app.get("/bookings", async (req, res) => {
          const result = await bookings.find().toArray();

          res.send(result);
        });

        app.post("/bookings", async (req, res) => {
          const newProduct = req.body;

          console.log(newProduct);

          const result = await bookings.insertOne(newProduct);

          res.send(result);
        });

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", async (req, res) => {
    res.send("Revive Server is Running");
})

app.listen(port, () => {
    console.log("Server Is Running From port", port);
})

