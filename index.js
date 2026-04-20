const express= require("express");
const path= require("path");
const fs=require("fs");
const sass=require("sass");
const sharp=require("sharp");
const pg = require("pg");

app= express();
app.set("view engine", "ejs")

obGlobal = {
    obErori:null,
    obImagini:null,
    folderScss:path.join(__dirname,"resurse/scss"),
    folderCss:path.join(__dirname,"resurse/css"),
    folderBackup:path.join(__dirname,"backup"),
}

const vect_foldere = ["temp", "logs", "backup", "fisiere_uploadate"];
for (let numeFolder of vect_foldere) {
    let caleFolder = path.join(__dirname, numeFolder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(caleFolder);
    }
}

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

app.get("/favicon.ico", function(req, res) {
    res.sendFile(path.join(__dirname, "resurse/imagini/favicon/favicon.ico"));
});

app.use(function(req, res, next) {
    res.locals.ip = req.ip;
    next();
});

client=new Client({
    database:"cti_2026",
    user:"tris",
    password:"1243",
    host:"localhost",
    port:5432
})

client.connect()


function initErori(){
    let continut = fs.readFileSync(path.join(__dirname,"resurse/json/erori.json")).toString("utf-8");
    let erori=obGlobal.obErori=JSON.parse(continut)
    let err_default=erori.eroare_default
    err_default.imagine=path.join(erori.cale_baza, err_default.imagine)
    for (let eroare of erori.info_erori){
        eroare.imagine=path.join(erori.cale_baza, eroare.imagine)
    }
}
initErori();

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss); // "folder1/folder2/a.scss" -> "a.scss"
        let numeFis=numeFisExt.split(".")[0]   /// "a.scss"  -> ["a","scss"]
        caleCss=numeFis+".css"; // output: a.css
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}


//la pornirea serverului
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}


fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})

function afisareEroare(res, identificator, titlu, text, imagine){
    let eroare = obGlobal.obErori.info_erori.find((elem) => elem.identificator == identificator);
    let errDefault = obGlobal.obErori.eroare_default;

    let titluGasit = titlu || eroare?.titlu || errDefault.titlu;
    let textGasit = text || eroare?.text || errDefault.text;
    let imagineGasita = imagine || eroare?.imagine || errDefault.imagine;

    if (eroare && eroare.status) {
        res.status(identificator);
    } else if (!eroare) {
        res.status(500);
    }

    res.render("pagini/eroare", {
        imagine: imagineGasita,
        titlu: titluGasit,
        text: textGasit,
    });
}

app.get(["/", "/index", "/home",],function(req,res){
    res.render("pagini/index");
});

app.use("/resurse", function(req, res, next) {
    let caleCompleta = path.join(__dirname, "resurse", req.url.split('?')[0]);
    if (fs.existsSync(caleCompleta) && fs.statSync(caleCompleta).isDirectory()) {
        return afisareEroare(res, 403);
    }
    next();
});

app.use("/resurse",express.static(path.join(__dirname,"resurse")));
app.use("/dist",express.static(path.join(__dirname,"node_modules/bootstrap/dist")));

app.get("/eroare",function(req,res){
    afisareEroare(res,404,"Eroare 404");
});

app.get(/\.ejs$/, function(req, res) {
    afisareEroare(res, 400); 
});

app.get("/*pagina",function(req,res){
    res.render("pagini"+req.url,function(err,rezRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                afisareEroare(res,404)
            }
            else{
                afisareEroare(res);
            }
        }
        else {
            res.send(rezRandare);
            console.log("Randare finalizată cu succes");
        }
    });
});


app.listen(8080);
console.log("Serverul a pornit!");