const express = require('express');

const app = express();

app.get("/",(req,res) => {
    res.send("Welcome to HomePage")
})


app.get("/admin",(req,res) => {
    res.send("welcome Admin")
})


app.listen(3000);