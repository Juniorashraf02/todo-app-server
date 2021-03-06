const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.asxxn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const tasksCollections = await client.db('todo-app').collection('tasks');

        // get all the tasks
        app.get('/tasks', async (req, res) => {
            const query = {};
            const results = await tasksCollections.find(query).toArray();
            res.send(results);
        });

        // post a task
        app.post('/tasks', async(req, res) => {
            const data= req.body;
            const result = await tasksCollections.insertOne(data);
            res.send(result);
        });


        app.delete('/tasks/:id', async(req, res) => {
            const id=req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await tasksCollections.deleteOne(query);
            res.send(result);
        })

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })

    } finally { }
}
run().catch(console.dir);




