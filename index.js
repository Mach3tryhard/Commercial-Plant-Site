const express= require("express");
const path= require("path");

const app = express();
app.set("view engine", "ejs")

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.get("/cale",function(req,res){
    res.send("test")
    console.log("Am primit o cerere GET pe /cale")
});

app.get(["/", "/index", "/acasa",],function(req,res){
    res.render("pagini/index");
});

app.use("/resurse",express.static(path.join(__dirname,"resurse")));

app.get("/cale2",function(req,res){
    res.write("ceva\n");
    res.write("altceva\n");
    res.end();
});

app.get("/:pagina", function(req, res) {
    let pagina = req.params.pagina;

    res.render("pagini/" + pagina, function(eroare, rezultatRandare) {
        if (eroare) {
            if (eroare.message.startsWith("Failed to lookup view")) {
                let eroare404 = dateErori.info_erori.find(e => e.identificator === 404);
                
                res.status(404).render("pagini/eroare", {
                    titlu: eroare404.titlu,
                    text: eroare404.text,
                    imagine: dateErori.cale_baza + eroare404.imagine
                });
            } else {
                res.status(500).render("pagini/eroare", {
                    titlu: dateErori.eroare_default.titlu,
                    text: dateErori.eroare_default.text,
                    imagine: dateErori.cale_baza + dateErori.eroare_default.imagine
                });
            }
        } else {
            res.send(rezultatRandare);
        }
    });
});

app.listen(8080);
console.log("Serverul a pornit!");