window.addEventListener("DOMContentLoaded", function(){
    let btnTema = document.getElementById("schimba_tema");
    let iconTema = document.querySelector("#icon_tema i");

    if(document.body.classList.contains("dark")){
        btnTema.checked = true;
        if (iconTema) {
            iconTema.classList.remove("bi-moon-fill", "text-dark");
            iconTema.classList.add("bi-sun-fill", "text-white");
        }
    } else {
        btnTema.checked = false;
        if (iconTema) {
            iconTema.classList.remove("bi-sun-fill", "text-white");
            iconTema.classList.add("bi-moon-fill", "text-dark");
        }
    }

    btnTema.onclick = function(){
        if(document.body.classList.contains("dark")){
            document.body.classList.remove("dark");
            localStorage.removeItem("tema");
            
            if (iconTema) {
                iconTema.classList.remove("bi-sun-fill", "text-white");
                iconTema.classList.add("bi-moon-fill", "text-dark");
            }
        }
        else{
            document.body.classList.add("dark");
            localStorage.setItem("tema","dark");
            
            if (iconTema) {
                iconTema.classList.remove("bi-moon-fill", "text-dark");
                iconTema.classList.add("bi-sun-fill", "text-white");
            }
        }
    }
});