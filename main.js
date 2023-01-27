console.log("tarea");
let boton = document.getElementById("boton");
let div = document.getElementById("mostrar-datos");
let spinner = document.getElementById("spinner");

async function traerDatos() {
  try {
    let data = await fetch("https://reqres.in/api/users?delay=3");
    let datosTransformados = await data.json();
    return datosTransformados.data;
  } catch (error) {
    console.error(error);
  }
}
function minutosExpiracion(){
    let dia = new Date()
    dia.setMinutes(dia.getMinutes()+1)
    return dia;
}
async function guardarDatosLocalStorage(){
    let datos= await traerDatos()
    localStorage.setItem("datos", JSON.stringify(datos));
    localStorage.setItem("expiracion", minutosExpiracion());
   return traerDatosLocalStorage()
}
function traerDatosLocalStorage(){
    return JSON.parse (localStorage.getItem("datos"));
}
async function mostrarDatos(){
    spinner.classList.remove("d-none")
    let datos= await definirOrigen()  
    if (datos) {
        div.innerHTML=`
        <table class="table">
        <thead>
           <tr>
            <th>NOMBRE</th>
            <th>CORREO</th>
            <th>AVATAR</th>
            <th>ID</th>
           </tr>
        </thead>
        <tbody>
            ${datos.map(mapearDatos).join("")}
        </tbody>
    </table>
        `
        spinner.classList.add("d-none")
    }
}
function mapearDatos(element){
    return `
    <tr>
    <td>${element.first_name} ${element.last_name}</td>
    <td>${element.email}</td>
    <td><img class= "rounded-circle" src=${element.avatar} alt="Imagen persona"></td>
    <td>${element.id}</td>
</tr>`

}

function definirOrigen(){
    let minutosExpiracion= new Date(localStorage.getItem("expiracion"))
    let minutoActual= new Date();
    if (minutoActual>minutosExpiracion) {
        localStorage.removeItem("datos")
        localStorage.removeItem("expiracion")
        return guardarDatosLocalStorage()
    } 
    return traerDatosLocalStorage();
}
boton.addEventListener("click", mostrarDatos)
