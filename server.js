const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const multer = require('multer')
const sanitizeHtml  = require('sanitize-html')
const fse = require('fs-extra')
const sharp = require('sharp')
const path = require('path')
const React = require('react')
const ReactDOMServer = require('react-dom/server');
const UserCard = require('./src/component/UserCard').default


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
          if (user && user.Role == "Admin") {
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
  const generateHTML = ReactDOMServer.renderToString(
    <div className='container'>
      <div className='user-grid'>
        {allusers.map(user => <UserCard  key={user._id} name={user.Username} Role={user.Role} photo={user.photo} id={user._id} readOnly={true}/>)}
      </div>
    </div>
  )
  res.render("home", { generateHTML });
});

app.use(password);

app.delete("/user/:id", async (req, res) => {
  if (typeof req.params.id != "string") req.params.id = ""
  const doc = await db.collection('User').findOne({_id: new ObjectId(req.params.id)})
  if (doc.photo){
    fse.remove(path.join("public","upload-img", doc.photo))
  }
  db.collection('User').deleteOne({_id: new ObjectId(req.params.id)})
  res.send("Deleted")
})

app.post("/update-user", upload.single("photo"), clean, async (req, res) => {
  if (req.file) {
    const photofilename = `${Date.now()}.jpg`;
    await sharp(req.file.buffer)
      .resize(170, 170)
      .jpeg({ quality: 60 })
      .toFile(path.join("public", "upload-img", photofilename))
    req.cleanData.photo = photofilename

    const info = await db.collection('User').findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
    if (info.value.photo) {
      fse.remove(path.join("public", "upload-img", info.value.photo))
    }
    res.send(photofilename)
  } else {
    db.collection('User').findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData})
    res.send(false)
  }
})

app.get("/api/users", async (req, res) => {
  const key = req.query.key || ""; 
  const limit = parseInt(req.query.limit) || 5;

  const filter = { Username: { $regex: key, $options: "i" } };

  const searchResult = await db.collection("User")
    .find(filter)
    .limit(limit)
    .toArray();

  res.json(searchResult);
});


app.post("/create-user", upload.single("photo"), clean, async (req, res) => {

    const existingUser = await db.collection("User").findOne({ Username: req.cleanData.Username });
    if (existingUser) {
      return res.status(400).send("Username already exists")
    }else{
    if (req.file) {
      const photofilename = `${Date.now()}.jpg`;
      await sharp(req.file.buffer)
        .resize(170, 170)
        .jpeg({ quality: 60 })
        .toFile(path.join("public", "upload-img", photofilename))
      req.cleanData.photo = photofilename;
    }
  
    console.log(req.body);
    const info = await db.collection("User").insertOne(req.cleanData);
    const newUser = await db.collection("User").findOne({ _id: new ObjectId(info.insertedId) });
    res.send(newUser);
  }
  });
function clean(req,res,next) {
    if (typeof req.body.Username != "string") req.body.Username = ""
    if (typeof req.body.Role != "string") req.body.Role = ""
    if (typeof req.body.Team != "string") req.body.Team = ""
    if (typeof req.body.Pass != "string") req.body.Pass = ""
    if (typeof req.body._id != "string") req.body._id = ""

    req.cleanData = {
        Username: sanitizeHtml(req.body.Username.trim(), {allowedTags:[] , allowedAttributes: {}}),
        Pass: sanitizeHtml(req.body.Pass.trim(), {allowedTags:[] , allowedAttributes: {}}),
        Team: sanitizeHtml(req.body.Team.trim(), {allowedTags:[] , allowedAttributes: {}}),
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
