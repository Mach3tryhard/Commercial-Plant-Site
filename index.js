const express= require("express");
const path= require("path");

app= express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.get("/cale",function(req,res){
    res.send("test")
    console.log("Am primit o cerere GET pe /cale")
});

app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"index.html"));

});

app.use("/resurse",express.static(path.join(__dirname,"resurse")));

app.get("/cale2",function(req,res){
    res.write("ceva\n");
    res.write("altceva\n");
    res.end();
});

app.listen(8080);
console.log("Serverul a pornit!");