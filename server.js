const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const multer = require('multer')
const sanitizeHtml  = require('sanitize-html')
const fse = require('fs-extra')
const sharp = require('sharp')
const path = require('path')


const app = express()
let db;


const upload = multer();

fse.ensureDirSync(path.join("public", "upload-img"))

app.set("view engine", "ejs")
app.set("views","./views")
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

function password(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const encodedCredentials = authHeader.split(' ')[1];
      const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
      const [username, password] = decodedCredentials.split(':');
      db.collection('User')
        .findOne({ Username: username, Pass: password })
        .then(user => {
          if (user) {
            next();
          } else {
            console.log(authHeader);
            res.status(401).send("Try again");
            
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).send("Internal Server Error");
        });
    } else {
      res.set("WWW-Authenticate", "Basic realm='MERN'");
      res.status(401).send("Authorization required");
    }
  }
  

app.get("/", async (req, res) => {
  const allusers = await db.collection('User').find().toArray();
  res.render("home", { allusers });
});

app.use(password);

app.get("/api/users", async (req, res) => {
  const allusers = await db.collection('User').find().toArray();
  res.json(allusers)
});

app.post("/create-user", upload.single("photo"), clean, async (req, res) => {
    if (req.file) {
      const photofilename = `${Date.now()}.jpg`;
      await sharp(req.file.buffer)
        .resize(844, 456)
        .jpeg({ quality: 60 })
        .toFile(path.join("public", "upload-image", photofilename))
      req.cleanData.photo = photofilename;
    }
  
    console.log(req.body);
    const info = await db.collection("User").insertOne(req.cleanData);
    const newUser = await db.collection("User").findOne({ _id: new ObjectId(info.insertedId) });
    res.send(newUser);
  });
function clean(req,res,next) {
    if (typeof req.body.Username != "string") req.body.Username = ""
    if (typeof req.body.Role != "string") req.body.Role = ""
    if (typeof req.body.Pass != "string") req.body.Pass = ""
    if (typeof req.body._id != "string") req.body._id = ""

    req.cleanData = {
        Username: sanitizeHtml(req.body.Username.trim(), {allowedTags:[] , allowedAttributes: {}}),
        Pass: sanitizeHtml(req.body.Pass.trim(), {allowedTags:[] , allowedAttributes: {}}),
        Role: sanitizeHtml(req.body.Role.trim(), {allowedTags:[] , allowedAttributes: {}})
    }
    next()
}

app.get("/admin",(req, res) => {
  res.render("admin")
});

async function start() {
  const client = new MongoClient("mongodb://admin:admin@localhost:27017/Mern?&authSource=admin");
  await client.connect();
  db = client.db();
  app.listen(3000);
}

start();
