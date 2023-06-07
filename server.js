const express = require('express');
const {MongoClient} = require('mongodb')
const app = express();
let db 

app.set("view engine", "ejs")
app.set("views","./views")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

function password(req,res,next){
    res.set("WWW-Authenticate", "Basic realm='Our MERN App'")
    if (req.headers.authorization == "Basic YWRtaW46YWRtaW4="){
        next()
    }else{
        console.log(req.headers.authorization)
        res.status(401).send("Try again later")
    }
}


app.get("/", async (req,res) => {
    const allusers = await db.collection('User').find().toArray()
    res.render("home", { allusers})
})

app.use(password)

app.get("/api/users", async (req, res) => {
    const allusers = await db.collection('User').find().toArray()
    res.json(allusers)

})

app.post("/create-user", async (req, res) => {
    console.log(req.body)
    res.send("create")
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

