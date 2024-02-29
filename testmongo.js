const { MongoClient } = require("mongodb");

// he mentioned that you run this in codespaces but this should work locally since its js
// this? next? class show him it running, and show the database instance running.
// grade is demonstated; report is "placeholder"

// ex. code at https://github.com/ckorpio/testme/blob/main/demo.js
// demonstrates how you can create events and handlers and bind them together 
// and then have the program execute the handler functions
// based on what it has procured.

// The uri string must be the connection string for the database (obtained on Atlas).
// 'guest'

// NOTE: DO NOT GIVE ADMIN!!
// this code will be shared so give it credentials of a user you created with low priority.
// string given for the URI will be different. Take it from Render/Mongo

// --- This is the standard stuff to get it to work on the browser
const express = require('express');
const app = express();
const port = 3000;
app.listen(port);
console.log('Server started at http://localhost:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes will go here

// Default route:
app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Starting... ';
  res.send(outstring);
});

app.get('/say/:name', function(req, res) {
  res.send('Hello ' + req.params.name + '!');
});


// Route to access database:
app.get('/api/mongo/:item', function(req, res) { // :item is a filler variable. whatever is there in the url will be entered without colons
  const client = new MongoClient(uri);

  // listDatabases(client);
  // console.log('passed listDatabases');

  const searchKey = "{ partID: '" + req.params.item + "' }";
  console.log("Looking for: " + searchKey);

  async function run() {
    try {

      const database = client.db('Database');
      const parts = database.collection('MyStuff');

      const query = { partID: req.params.item };

      const part = await parts.findOne(query);
      console.log(part);
      res.send('Found this: ' + JSON.stringify(part));  // Use stringify to print a json

    } finally {
      
      // Ensures that the client will close when you finish/error
      await client.close();
      
    }
  }
    run().catch(console.dir);
});

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();
  console.log("Databases: ");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
}
