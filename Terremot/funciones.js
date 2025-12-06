
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

// Las funciones calcular, formatear y guardar vendrán después
