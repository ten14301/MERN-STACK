(()=>{var e={860:e=>{"use strict";e.exports=require("express")},13:e=>{"use strict";e.exports=require("mongodb")}},t={};function n(s){var r=t[s];if(void 0!==r)return r.exports;var o=t[s]={exports:{}};return e[s](o,o.exports,n),o.exports}(()=>{const e=n(860),{MongoClient:t}=n(13),s=e();let r;s.set("view engine","ejs"),s.set("views","./views"),s.use(e.static("public")),s.get("/",(async(e,t)=>{const n=await r.collection("User").find().toArray();t.render("home",{allusers:n})})),s.get("/api/users",(async(e,t)=>{const n=await r.collection("User").find().toArray();t.json(n)})),s.get("/admin",((e,t)=>{t.render("admin")})),async function(){const e=new t("mongodb://admin:admin@localhost:27017/Mern?&authSource=admin");await e.connect(),r=e.db(),s.listen(3e3)}()})()})();