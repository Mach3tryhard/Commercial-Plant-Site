window.onload=function(){

    let rangePret = document.getElementById("inp-pret");
    if (rangePret) {
        rangePret.oninput = function() {
            document.getElementById("infoRange").textContent = `(${this.value})`;
        };
    }

    let btnFiltrare = document.getElementById("filtrare");
    if (btnFiltrare) {
        btnFiltrare.onclick = function() {
            let inpNume = document.getElementById("inp-nume").value.trim().toLowerCase();
            let inpPretMin = parseFloat(document.getElementById("inp-pret").value);
            let inpCategorie = document.getElementById("inp-categorie").value.trim().toLowerCase();
            let inpPrezentare = document.getElementById("inp-prezentare").value.trim().toLowerCase();
            let inpToxic = document.getElementById("inp-toxic").checked;
            let inpCulori = Array.from(document.getElementById("inp-culori").selectedOptions).map(opt => opt.value);
            let inpIngrijire = document.getElementById("inp-ingrijire-text").value.trim().toLowerCase();

            let inaltimeMin = 0, inaltimeMax = 1000000, isToateInaltimi = false;
            let grupRadio = document.getElementsByName("gr_rad");
            for (let rad of grupRadio) {
                if (rad.checked) {
                    if (rad.value !== "toate") {
                        let interval = rad.value.split(":");
                        inaltimeMin = parseInt(interval[0]);
                        inaltimeMax = parseInt(interval[1]);
                    } else {
                        isToateInaltimi = true;
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
                let condPret = pret >= inpPretMin;
                let condCateg = inpCategorie === "toate" || categorie === inpCategorie;
                let condInalt = isToateInaltimi || (inaltime >= inaltimeMin && inaltime < inaltimeMax);
                let condPrez = (inpPrezentare === "") || (prezentare.includes(inpPrezentare));
                let condToxic = !inpToxic || (isToxic === false);
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
            document.getElementById("inp-nume").value = "";
            document.getElementById("inp-pret").value = 0;
            document.getElementById("infoRange").textContent = "(0)";
            document.getElementById("inp-categorie").value = "toate";
            document.getElementById("i_rad4").checked = true;
            document.getElementById("inp-prezentare").value = "";
            document.getElementById("inp-toxic").checked = false;
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
        };
    }

    function sorteaza(semn) {
        let coloane = document.querySelectorAll(".grid-produse .col");
        let vColoane = Array.from(coloane);

        vColoane.sort(function(colA, colB) {
            let pretA = parseFloat(colA.querySelector(".val-pret").textContent.trim());
            let pretB = parseFloat(colB.querySelector(".val-pret").textContent.trim());

            if (pretA === pretB) {
                let numeA = colA.querySelector(".val-nume").textContent.trim().toLowerCase();
                let numeB = colB.querySelector(".val-nume").textContent.trim().toLowerCase();
                return semn * numeA.localeCompare(numeB);
            }

            return semn * (pretA - pretB);
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
    })
}