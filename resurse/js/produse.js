window.onload=function(){

    let rangePret = document.getElementById("inp-inaltime");
    if (rangePret) {
        rangePret.oninput = function() {
            document.getElementById("infoRange").textContent = `(${this.value})`;
        };
    }

    let btnFiltrare = document.getElementById("filtrare");
    if (btnFiltrare) {
        btnFiltrare.onclick = function() {
            
            if (!valideazaDate()) return;

            let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
            let inpInaltime = parseFloat(document.getElementById("inp-inaltime").value);
            let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();
            let inpPrezentare = document.getElementById("inp-prezentare").value.trim().toLowerCase();
            let valToxic = "toate";
            let radToxic = document.getElementsByName("gr_toxic");
            for (let r of radToxic) {
                if (r.checked) {
                    valToxic = r.value;
                    break;
                }
            }
            let inpCulori = Array.from(document.getElementById("inp-culori").selectedOptions).map(opt => opt.value);
            let inpIngrijire = document.getElementById("inp-ingrijire-text").value.trim().toLowerCase();

            let pretMin = 0, pretMax = 1000000, isToatePreturi = false;
            let grupRadio = document.getElementsByName("gr_rad");
            for (let rad of grupRadio) {
                if (rad.checked) {
                    if (rad.value !== "toate") {
                        let interval = rad.value.split(":");
                        pretMin = parseInt(interval[0]);
                        pretMax = parseInt(interval[1]);
                    } else {
                        isToatePreturi = true;
                    }
                    break;
                }
            }

            let produse = document.querySelectorAll(".produs");
            for (let prod of produse) {
                let colWrapper = prod.closest(".col");
                
                let nume = prod.querySelector(".val-nume").textContent.trim().toLowerCase();
                let pret = parseFloat(prod.querySelector(".val-pret").textContent.trim());
                let inaltime = parseInt(prod.querySelector(".val-calorii").textContent.trim());
                let categorie = prod.querySelector(".val-categorie").textContent.trim().toLowerCase();
                let prezentare = prod.querySelector(".val-prezentare").textContent.trim().toLowerCase();
                let isToxic = prod.querySelector(".val-toxic").textContent.trim() === "DA";
                let culoareProdus = prod.querySelector(".val-culoare").textContent.trim().toLowerCase();
                let ingrijire = prod.querySelector(".val-ingrijire").textContent.trim().toLowerCase();

                let condNume = nume.includes(inpNume);
                let condInalt = inaltime >= inpInaltime;
                let condCateg = inpCategorie === "toate" || categorie === inpCategorie;
                let condPret = isToatePreturi || (pret >= pretMin && pret < pretMax);
                let condPrez = (inpPrezentare === "") || (prezentare.includes(inpPrezentare));
                let condToxic = (valToxic === "toate") || (valToxic === "da" && isToxic === true) ||  (valToxic === "nu" && isToxic === false);
                let condCulori = (inpCulori.length === 0) || (inpCulori.includes(culoareProdus));
                let condIngrijire = (inpIngrijire.length < 5) || (ingrijire.includes(inpIngrijire));

                if (condNume && condPret && condCateg && condInalt && condPrez && condToxic && condCulori && condIngrijire) {
                    colWrapper.style.display = "block";
                } else {
                    colWrapper.style.display = "none";
                }
            }
        };
    }

    let btnReset = document.getElementById("resetare");
    if (btnReset) {
        btnReset.onclick = function() {
            if (confirm("Ești sigur că vrei să resetezi filtrele și sortarea?")) {
                document.getElementById("inp-nume").value = "";
                document.getElementById("infoRange").textContent = "(0)";
                document.getElementById("inp-categorie").value = "toate";
                document.getElementById("i_rad4").checked = true;
                document.getElementById("inp-prezentare").value = "";
                document.getElementById("toxic_toate").checked = true;
                document.getElementById("inp-inaltime").value = 0;
                let selCulori = document.getElementById("inp-culori");
                for (let i = 0; i < selCulori.options.length; i++) {
                    selCulori.options[i].selected = false;
                }
                document.getElementById("inp-ingrijire-text").value = "";
                

                let produse = document.querySelectorAll(".produs");
                for (let prod of produse) {
                    let colWrapper = prod.closest(".col");
                    if (colWrapper) {
                        colWrapper.style.display = "block";
                    }
                }
            }
        };
    }

    function sorteaza(semn) {

        if (!valideazaDate()) return;

        let coloane = document.querySelectorAll(".grid-produse .col");
        let vColoane = Array.from(coloane);

        vColoane.sort(function(colA, colB) {
            let pretA = parseFloat(colA.querySelector(".val-pret").textContent.trim());
            let inaltimeA = parseInt(colA.querySelector(".val-calorii").textContent.trim());
            let rapA = inaltimeA / pretA;

            let pretB = parseFloat(colB.querySelector(".val-pret").textContent.trim());
            let inaltimeB = parseInt(colB.querySelector(".val-calorii").textContent.trim());
            let rapB = inaltimeB / pretB;

            if (Math.abs(rapA - rapB) < 0.0001) {
                let prezA = colA.querySelector(".val-prezentare").textContent.trim().toLowerCase();
                let prezB = colB.querySelector(".val-prezentare").textContent.trim().toLowerCase();
                return semn * prezA.localeCompare(prezB);
            }

            return semn * (rapA - rapB);
        });

        let container = document.querySelector(".grid-produse");
        for (let col of vColoane) {
            container.appendChild(col);
        }
    }

    let btnSortCresc = document.getElementById("sortCrescNume");
    if (btnSortCresc) btnSortCresc.onclick = function() { sorteaza(1); };

    let btnSortDescresc = document.getElementById("sortDescrescNume");
    if (btnSortDescresc) btnSortDescresc.onclick = function() { sorteaza(-1); };

    window.addEventListener("keydown", function(e) {
        if (e.key === "c" && e.altKey) {
            FacutSuma();
        }
    })

    let btnCalcul = document.getElementById("calculare");
    if (btnCalcul) {
        btnCalcul.onclick = function() {
            FacutSuma();
        }
    }

    function FacutSuma(){
        
        if (!valideazaDate()) return;

        let suma = 0;
            let produse = document.querySelectorAll(".produs");
            
            for (let prod of produse) {
                if (prod.closest(".col").style.display !== "none") {
                    suma += parseFloat(prod.querySelector(".val-pret").textContent.trim());
                }
            }

            let p = document.getElementById("SumaProduseAfisate");
            if (!p) {
                p = document.createElement("p");
                p.id = "SumaProduseAfisate";
                p.className = "alert alert-success fw-bold mt-3";
                
                let sectiuneProduse = document.getElementById("produse");
                sectiuneProduse.parentElement.insertBefore(p, sectiuneProduse);
                
                setTimeout(function() {
                    let p1 = document.getElementById("SumaProduseAfisate");
                    if (p1) p1.remove();
                }, 2000);
            }
            p.textContent = "Suma produselor afișate: " + suma + " RON";
    }

    function valideazaDate() {
        let isValid = true;
        
        let inpNume = document.getElementById("inp-nume");
        let valNume = inpNume.value.trim();
        if (valNume.length > 0 && /\d/.test(valNume)) {
            inpNume.classList.add("is-invalid");
            isValid = false;
        } else {
            inpNume.classList.remove("is-invalid");
        }

        let inpIngrijire = document.getElementById("inp-ingrijire-text");
        let valIngrijire = inpIngrijire.value.trim();
        if (valIngrijire.length > 0 && valIngrijire.length < 5) {
            inpIngrijire.classList.add("is-invalid");
            isValid = false;
        } else {
            inpIngrijire.classList.remove("is-invalid");
        }

        if (!isValid) {
            alert("Vă rugăm să corectați filtrele cu erori înainte de a efectua operația!");
        }

        return isValid;
    }
}