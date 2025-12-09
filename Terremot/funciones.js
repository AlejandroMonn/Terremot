var turno = 1;
var moneda1 = "";
var moneda2 = "";

var supabaseUrl = 'TU_URL_AQUI'; 
var supabaseKey = 'TU_KEY_AQUI'; 
var _supabase = supabase.createClient(supabaseUrl, supabaseKey);

function seleccionarPais(codigoMoneda, nombrePaisCompleto) {
    if (turno == 1) {
        moneda1 = codigoMoneda;
        document.getElementById("select_pais1").value = codigoMoneda;
        
        alert("Origen seleccionado: " + codigoMoneda + ". Ahora elige destino.");
        turno = 2; 
    } else {
        moneda2 = codigoMoneda;
        document.getElementById("select_pais2").value = codigoMoneda;
        alert("Destino seleccionado: " + codigoMoneda + ". Ahora puedes calcular.");
        turno = 1; 
    }
}

function cambiarDesdeSelect(numeroSelect) {
    if(numeroSelect == 1) {
        moneda1 = document.getElementById("select_pais1").value;
        turno = 2;
        alert("Origen cambiado a: " + moneda1);
    } else {
        moneda2 = document.getElementById("select_pais2").value;
        turno = 1; 
        alert("Destino cambiado a: " + moneda2);
    }
}

function formatearMoneda(input) {
    var valorLimpio = input.value.replace(/\D/g, "");
    
    if (valorLimpio === "") {
        input.value = "";
        return;
    }

    var formateado = new Intl.NumberFormat('en-US').format(valorLimpio);

    input.value = "$ " + formateado;
}

async function calcular() {
    var inputCantidad = document.getElementById("cantidad").value;
    
    var cantidadNumerica = inputCantidad.replace(/\D/g, ""); 

    if (moneda1 == "" || moneda2 == "") {
        alert("¡Oye! Te falta seleccionar los países en el mapa o la lista.");
        return;
    }
    
    if (cantidadNumerica == "") {
        alert("Pon una cantidad valida por favor.");
        return;
    }

    try {
        var respuesta = await fetch("https://api.exchangerate-api.com/v4/latest/" + moneda1);
        var datos = await respuesta.json();
        var tasa = datos.rates[moneda2];
        
        var total = cantidadNumerica * tasa;

        var totalBonito = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: moneda2 
        }).format(total);

        document.getElementById("resultado_final").innerText = "Total: " + totalBonito;
        "💰 Resultado: <br>" + totalBonito + " (" + moneda2 + ")";


        var textoHistorial = inputCantidad + " " + moneda1 + " son " + totalBonito;
        guardarEnHistorial(textoHistorial);

    } catch (error) {
        console.log(error);
        alert("Error: No pude conectar con la API de dinero.");
    }
}

async function guardarEnHistorial(texto) {
    console.log("Aun no guardo en base de datos, pero esto llegara: " + texto);
}



