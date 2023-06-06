const express = require('express');
const {MongoClient} = require('mongodb')
const app = express();
let db 

app.set("view engine", "ejs")
app.set("views","./views")
app.use(express.static("public"))

app.get("/", async (req,res) => {
    const allusers = await db.collection('User').find().toArray()
    res.render("home", { allusers})
})

app.get("/api/users", async (req, res) => {
    const allusers = await db.collection('User').find().toArray()
    res.json(allusers)

})


app.get("/admin",(req,res) => {
    res.render("admin")
})

async function start(){
    const client = new MongoClient("mongodb://admin:admin@localhost:27017/Mern?&authSource=admin")
    await client.connect()
    db = client.db()
    app.listen(3000);
}

start()

