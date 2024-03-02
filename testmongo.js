const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://guest:guest@cluster0.6k7ugaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// default route:
app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});

// database access route:
app.get('/api/mongo/:item', function(req, res) {
  const client = new MongoClient(uri);

  const searchKey = "{ partID: '" + req.params.item + "' }";
  console.log("Looking for: " + searchKey);

  async function run() {
    try {

      const database = client.db('Database');
      const parts = database.collection('MyStuff');

      const query = { partID: req.params.item };

      const part = await parts.findOne(query);
      console.log(part);
      res.send('Found this: ' + JSON.stringify(part));

    } finally {
      await client.close();
    }
  }
    run().catch(console.dir);
});
