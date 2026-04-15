const express= require("express");
const path= require("path");
const fs=require("fs");
const sass=require("sass");
const sharp=require("sharp");

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

function validareDateErori() {
    const caleJson = path.join(__dirname, "resurse/json/erori.json");

    // 1. Verificare existență fișier (0.025p)
    if (!fs.existsSync(caleJson)) {
        console.error("Eroare critică: Fișierul erori.json nu există. Aplicația se va închide.");
        process.exit(1); 
    }

    const rawData = fs.readFileSync(caleJson, "utf-8");

    // 2. Verificare proprietăți duplicate pe string (0.2p)
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

    let obErori;
    try {
        obErori = JSON.parse(rawData);
    } catch (e) {
        console.error("Eroare de sintaxă: Fișierul erori.json nu este un JSON valid.");
        return;
    }

    // 3. Verificare proprietăți globale (0.025p)
    if (!obErori.info_erori || !obErori.cale_baza || !obErori.eroare_default) {
        console.error("Eroare conținut: Lipsesc una sau mai multe proprietăți de bază (info_erori, cale_baza, eroare_default).");
    }

    // 4. Verificare proprietăți eroare_default (0.025p)
    if (obErori.eroare_default) {
        let errDef = obErori.eroare_default;
        if (!errDef.titlu || !errDef.text || !errDef.imagine) {
            console.error("Eroare eroare_default: Lipsesc una sau mai multe proprietăți obligatorii (titlu, text, imagine).");
        }
    }

    // 5. Verificare existență folder cale_baza (0.025p)
    let caleBazaCompleta = "";
    if (obErori.cale_baza) {
        caleBazaCompleta = path.join(__dirname, obErori.cale_baza);
        if (!fs.existsSync(caleBazaCompleta)) {
            console.error(`Eroare cale: Folderul specificat în cale_baza ("${obErori.cale_baza}") nu există în sistemul de fișiere.`);
        }
    }

    // 6. Verificare existență imagini (0.05p)
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

    // 7. Verificare identificatori duplicați (0.15p)
    if (obErori.info_erori) {
        let dictionarId = {};
        
        for (let err of obErori.info_erori) {
            if (!dictionarId[err.identificator]) {
                dictionarId[err.identificator] = [];
            }
            
            // Extragem toate proprietatile in afara de identificator
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