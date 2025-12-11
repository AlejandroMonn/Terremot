// Global variables (bad practice but very novice style)
var turn = 1; // 1 = selecting origin, 2 = selecting destination
var currency1 = "";
var currency2 = "";

// Supabase Config (Paste your keys here)
var supabaseUrl = 'YOUR_URL_HERE'; 
var supabaseKey = 'YOUR_KEY_HERE'; 
var _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// --- 1. SELECTION LOGIC (Map and Selects connected) ---

// This function is called from the map buttons
function selectCountry(currencyCode, countryNameFull) {
    if (turn == 1) {
        currency1 = currencyCode;
        document.getElementById("select_pais1").value = currencyCode;
        
        alert("Origin selected: " + currencyCode + ". Now choose destination.");
        turn = 2; // Pass turn
    } else {
        currency2 = currencyCode;
        document.getElementById("select_pais2").value = currencyCode;
        alert("Destination selected: " + currencyCode + ". Now you can calculate.");
        turn = 1; // Reset cycle
    }
}

// This function is called from the dropdowns (select)
function changeFromSelect(selectNumber) {
    if(selectNumber == 1) {
        currency1 = document.getElementById("select_pais1").value;
        turn = 2; // Pass turn
        alert("Origin changed to: " + currency1);
    } else {
        currency2 = document.getElementById("select_pais2").value;
        turn = 1; // Reset cycle
        alert("Destination changed to: " + currency2);
    }
}

// --- 2. FORMATTING LOGIC (Thousands and Signs) ---
function formatCurrencyInput(input) {
    // 1. Remove anything that is not a digit (letters, symbols, old commas)
    var cleanValue = input.value.replace(/\D/g, "");
    
    if (cleanValue === "") {
        input.value = "";
        return;
    }

    // 2. Convert to number and use Intl to format with commas
    // We use 'en-US' for thousand separation
    var formattedValue = new Intl.NumberFormat('en-US').format(cleanValue);

    // 3. Put the $ sign at the beginning (novice uses $ as generic symbol)
    input.value = "$ " + formattedValue;
}

// --- 3. CALCULATION AND RESULT ---
async function calculate() {
    var inputAmount = document.getElementById("cantidad").value;
    
    // 1. Clean the input for math (remove $ and ,) 
    var numericAmount = inputAmount.replace(/\D/g, ""); 

    // Validations
    if (currency1 == "" || currency2 == "") {
        alert("Hey! You need to select the countries on the map or the list.");
        return;
    }
    
    if (numericAmount == "") {
        alert("Please enter a valid amount.");
        return;
    }

    try {
        // 2. API Connection
        var response = await fetch("https://api.exchangerate-api.com/v4/latest/" + currency1);
        var data = await response.json();
        var rate = data.rates[currency2];
        
        // 3. Math calculation
        var total = numericAmount * rate;

        // 4. Format the result beautifully
        var formattedTotal = new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: currency2 
        }).format(total);

        // 5. Display on screen (Commit 13 adds emoji)
        document.getElementById("resultado_final").innerHTML = 
            "💰 Result: <br>" + formattedTotal + " (" + currency2 + ")";

        // 6. Prepare history text
        var historyText = "Conversion of " + inputAmount + " " + currency1 + " to " + formattedTotal + " " + currency2;
        saveToHistory(historyText);

    } catch (error) {
        console.log(error);
        alert("Error: Could not connect to the currency API.");
    }
}

// --- 4. SUPABASE WRITE LOGIC (Commit 14) ---
async function saveToHistory(text) {
    console.log("Attempting to save to Supabase...");

    // Insert into 'historial_monedas' table
    const { error } = await _supabase
        .from('historial_monedas')
        .insert([{ descripcion: text }]); // Column name 'descripcion' as defined in database

    if (error) {
        console.log("Error saving: " + error.message);
    } else {
        console.log("Save successful!");
    }
}

// --- 5. SUPABASE READ LOGIC (Commit 16) ---
async function loadHistory() {
    // Check if we are on the correct page by looking for the element
    var list = document.getElementById("lista-historial");
    if (!list) return; 

    try {
        // Fetch last 10 records, ordered by ID descending
        const { data, error } = await _supabase
            .from('historial_monedas')
            .select('*')
            .order('id', { ascending: false })
            .limit(10);

        if (error) {
            list.innerHTML = "<li>Error loading the list :(</li>";
            console.log(error);
        } else {
            // Clear the "Loading..." message
            list.innerHTML = "";

            data.forEach(function(item) {
                var row = document.createElement("li");
                row.className = "item-historial";
                row.innerText = item.descripcion; 
                
                list.appendChild(row);
            });
        }
    } catch (err) {
        console.log(err);
        list.innerHTML = "<li>Connection Error.</li>";
    }
}






