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

let vect_foldere=[ "temp", "logs", "backup", "fisiere_uploadate" ]
for (let folder of vect_foldere){
    let caleFolder=path.join(__dirname, folder);
    if (!fs.existsSync(caleFolder)) {
        fs.mkdirSync(path.join(caleFolder), {recursive:true});   
    }
}

app.use("/resurse",express.static(path.join(__dirname, "resurse")));
app.use("/dist",express.static(path.join(__dirname, "node_modules/bootstrap/dist")));

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname,"resurse/imagini/favicon/favicon.ico"))
});

app.get(["/", "/index","/home"], function(req, res){
    const dataCurenta = new Date();
    const vectLuni=["ianuarie", "februarie","martie", "aprilie", "mai","iunie","iulie", "august","septembrie","octombrie","noiembrie","decembrie"];
    const lunaCurenta = vectLuni[dataCurenta.getMonth()];

    let imaginiFiltrate = obGlobal.obImagini.imagini.filter(img => {
        return img.intervale_luni && img.intervale_luni.includes(lunaCurenta);
    });

    if (imaginiFiltrate.length % 2 !== 0) {
        imaginiFiltrate.pop();
    }

    res.render("pagini/index", {
        ip: req.ip,
        imagini: obGlobal.obImagini.imagini
    });
});

console.log("Folder index.js", __dirname);
console.log("Folder curent (de lucru)", process.cwd());
console.log("Cale fisier", __filename);

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


function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;
    let caleGalerie=obGlobal.obImagini.cale_galerie

    let caleAbs=path.join(__dirname,caleGalerie);
    let caleAbsMediu=path.join(caleAbs, "mediu");
    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    
    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_relativa.split(".");
        let caleFisAbs=path.join(caleAbs,imag.cale_relativa);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        sharp(caleFisAbs).resize(300).toFile(caleFisMediuAbs);
        imag.cale_relativa_mediu=path.join("/", caleGalerie, "mediu", numeFis+".webp" )
        imag.cale_relativa=path.join("/", caleGalerie, imag.cale_relativa)
        
    }
}
initImagini();

function compileazaScss(caleScss, caleCss){
    if(!caleCss){

        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]
        caleCss=numeFis+".css";
    }
    
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }

    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))
    }
    rez=sass.compile(caleScss, {"sourceMap":true});
    fs.writeFileSync(caleCss,rez.css)
    
}

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

app.use("/resurse", function(req, res, next) {
    let caleCompleta = path.join(__dirname, "resurse", req.url.split('?')[0]);
    if (fs.existsSync(caleCompleta) && fs.statSync(caleCompleta).isDirectory()) {
        return afisareEroare(res, 403);
    }
    next();
});

app.get("/eroare",function(req,res){
    afisareEroare(res,404,"Eroare 404");
});

app.get(/\.ejs$/, function(req, res) {
    afisareEroare(res, 400); 
});

app.get("/*pagina", function(req, res){
    console.log("Cale pagina", req.url);
    if (req.url.startsWith("/resurse") && path.extname(req.url)==""){
        afisareEroare(res,403);
        return;
    }
    if (path.extname(req.url)==".ejs"){
        afisareEroare(res,400);
        return;
    }
    try{
        res.render("pagini"+req.url, function(err, rezRandare){
            if (err){
                if (err.message.includes("Failed to lookup view")){
                    afisareEroare(res,404)
                }
                else{
                    afisareEroare(res);
                }
            }
            else{
                res.send(rezRandare);
            }
        });
    }
    catch(err){
        if (err.message.includes("Cannot find module")){
            afisareEroare(res,404)
        }
        else{
            afisareEroare(res);
        }
    }
});

function validareDateErori() {
    const caleJson = path.join(__dirname, "resurse/json/erori.json");
    const rawData = fs.readFileSync(caleJson, "utf-8");
    /// ASTA E TOT F
    let obErori;
    try {
        obErori = JSON.parse(rawData);
    } catch (e) {
        console.error("Eroare de sintaxă: Fișierul erori.json nu este un JSON valid.");
        return;
    }

    // Cerința A (0.025p): Nu există fisierul erori.json
    if (!fs.existsSync(caleJson)) {
        console.error("Eroare critică: Fișierul erori.json nu există. Aplicația se va închide.");
        process.exit(1); 
    }

    // Cerința B (0.025p): Nu există una dintre proprietățile: info_erori, cale_baza, eroare_default
    if (!obErori.info_erori || !obErori.cale_baza || !obErori.eroare_default) {
        console.error("Eroare conținut: Lipsesc una sau mai multe proprietăți de bază (info_erori, cale_baza, eroare_default).");
    }

    // Cerința C (0.025p): Pentru eroarea default lipseste titlu, text sau imagine
    if (obErori.eroare_default) {
        let errDef = obErori.eroare_default;
        if (!errDef.titlu || !errDef.text || !errDef.imagine) {
            console.error("Eroare eroare_default: Lipsesc una sau mai multe proprietăți obligatorii (titlu, text, imagine).");
        }
    }

    // Cerința D (0.025p): Folderul specificat în "cale_baza" nu există
    let caleBazaCompleta = "";
    if (obErori.cale_baza) {
        caleBazaCompleta = path.join(__dirname, obErori.cale_baza);
        if (!fs.existsSync(caleBazaCompleta)) {
            console.error(`Eroare cale: Folderul specificat în cale_baza ("${obErori.cale_baza}") nu există în sistemul de fișiere.`);
        }
    }

    // Cerința E (0.05p): Nu există vreunul dintre fișierele imagine asociate erorilor
    if (obErori.cale_baza && obErori.info_erori && obErori.eroare_default) {
        let imaginiDeVerificat = [obErori.eroare_default.imagine];
        
        for (let err of obErori.info_erori) {
            if (err.imagine) imaginiDeVerificat.push(err.imagine);
        }

        for (let img of imaginiDeVerificat) {
            let caleImg = path.join(caleBazaCompleta, img);
            if (!fs.existsSync(caleImg)) {
                console.error(`Eroare imagine lipsă: Fișierul imagine "${img}" nu există la calea specificată.`);
            }
        }
    }

    // Cerința F (0.2p): Proprietate specificată de mai multe ori (verificare pe string)
    let depth = 0;
    let keysStack = [[]];
    let regexChei = /\{|\}|"([^"]+)"\s*:/g;
    let match;

    while ((match = regexChei.exec(rawData)) !== null) {
        if (match[0] === '{') {
            depth++;
            if (!keysStack[depth]) keysStack[depth] = [];
            else keysStack[depth].length = 0; 
        } else if (match[0] === '}') {
            depth--;
        } else if (match[1]) {
            let cheie = match[1];
            if (keysStack[depth].includes(cheie)) {
                console.error(`Eroare formatare JSON: Proprietatea "${cheie}" apare de mai multe ori în același obiect.`);
            } else {
                keysStack[depth].push(cheie);
            }
        }
    }

    // Cerința G (0.15p): Există mai multe erori cu același identificator
    if (obErori.info_erori) {
        let dictionarId = {};
        
        for (let err of obErori.info_erori) {
            if (!dictionarId[err.identificator]) {
                dictionarId[err.identificator] = [];
            }
            
            let { identificator, ...proprietatiFaraId } = err;
            dictionarId[err.identificator].push(proprietatiFaraId);
        }

        for (let id in dictionarId) {
            if (dictionarId[id].length > 1) {
                console.error(`Eroare duplicare ID: Există mai multe erori cu identificatorul "${id}". Proprietățile acestora sunt:`);
                console.error(JSON.stringify(dictionarId[id], null, 4));
            }
        }
    }
}

validareDateErori();

app.listen(8080);
console.log("Serverul a pornit!");