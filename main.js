const apiKey = '96a175f292280c03deb559c1674feb67';
const apiUrl = `https://api.coinlayer.com/live?access_key=${apiKey}`;

// Function to fetch live crypto data and update the table
async function fetchAndDisplayLiveCryptoData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.success) {
            const liveCryptoBody = document.getElementById('liveCryptoBody');
            liveCryptoBody.innerHTML = ''; // Clear existing content

            // Sort the cryptos by rank and limit to the top 15
            const sortedCryptos = Array.from(data.rates).sort((a, b) => a.rank - b.rank).slice(0, 15);



            // Update the table with the live crypto data
            sortedCryptos.forEach(crypto => {
                const row = liveCryptoBody.insertRow();
                const cellCrypto = row.insertCell(0);
                const cellPrice = row.insertCell(1);
                const cellChange = row.insertCell(2);

                cellCrypto.textContent = crypto.name;
                cellPrice.textContent = crypto.rate.toFixed(2);
                cellChange.textContent = `${crypto.change}%`;
            });
            cryptoData = data.crypto;
        } else {
            console.error('API request failed:', data.error.info);
        }
    } catch (error) {
        console.error('Error fetching live crypto data:', error.message);
    }
}


// Fetch and display live crypto data initially
fetchAndDisplayLiveCryptoData();

// Set an interval to fetch and update live crypto data every 60 seconds
setInterval(fetchAndDisplayLiveCryptoData, 60000);


let watchlist = [];

function updateWatchlistTable() {
    const watchlistBody = document.getElementById('watchlistBody');
    watchlistBody.innerHTML = ''; // Clear existing content

    watchlist.forEach(crypto => {
        const row = watchlistBody.insertRow();
        const cellCrypto = row.insertCell(0);
        const cellActions = row.insertCell(1);

        cellCrypto.textContent = crypto;
        // Add action buttons, e.g., remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function() {
            removeFromWatchlist(crypto);
        };
        cellActions.appendChild(removeButton);
    });
}
//adding to wishlist
function addToWatchlist() {
    const cryptoInput = document.getElementById('cryptoInput');
    const newCrypto = cryptoInput.value.toUpperCase();

    if (newCrypto && !watchlist.includes(newCrypto)) {
        watchlist.push(newCrypto);
        updateWatchlistTable();
        cryptoInput.value = ''; // Clear the input field
    }
}
function removeFromWatchlist(cryptoToRemove) {
    watchlist = watchlist.filter(crypto => crypto !== cryptoToRemove);
    updateWatchlistTable();
}
updateWatchlistTable();
//to populate with historical crypto data
async function populateCryptoOptions() {
    const cryptoSelect = document.getElementById('cryptoSelect');
    try {
        const response = await fetch('https://api.coinlayer.com/list?access_key=' + apiKey);
        const data = await response.json();

        if (data.success) {
            Array.from(data.crypto).forEach(crypto => {
                const option = document.createElement('option');
                option.value = crypto.symbol;
                option.textContent = crypto.name;
                cryptoSelect.appendChild(option);
            });
        } else {
            console.error('Failed to fetch crypto list:', data.error.info);
        }
    } catch (error) {
        console.error('Error fetching crypto list:', error.message);
    }
}



// Function to load historical data
async function getCryptoValue() {
    const cryptoSymbolInput = document.getElementById('cryptoSymbol');
    const dateInput = document.getElementById('date');
    const cryptoValueTableBody = document.getElementById('cryptoValueBody');

    const cryptoSymbol = cryptoSymbolInput.value.toUpperCase();
    const date = dateInput.value;

    try {
        const response = await fetch(`${apiUrl}${date}?access_key=${apiKey}&symbols=${cryptoSymbol}`);
        const data = await response.json();

        if (data.success) {
            const cryptoValue = data.rates[cryptoSymbol];
            
            // Clear existing content
            cryptoValueTableBody.innerHTML = '';

            // Add row to the table
            const row = cryptoValueTableBody.insertRow();
            const cellDate = row.insertCell(0);
            const cellCryptoSymbol = row.insertCell(1);
            const cellValue = row.insertCell(2);

            cellDate.textContent = date;
            cellCryptoSymbol.textContent = cryptoSymbol;
            cellValue.textContent = cryptoValue.toFixed(2); // Adjust decimal places as needed
        } else {
            console.error('Failed to fetch crypto value:', data.error.info);
        }
    } catch (error) {
        console.error('Error fetching crypto value:', error.message);
    }
}

//conversion
async function conversion() {
    const fromCryptoSelect = document.getElementById('fromCrypto');
    const toCryptoSelect = document.getElementById('toCrypto');

    try {
        const response = await fetch('https://api.coinlayer.com/list?access_key=' + apiKey);
        const data = await response.json();

        if (data.success) {
           cryptoData = data.crypto;
        } else {
            console.error('Failed to fetch crypto list:', data.error.info);
            return;
        }
    } catch (error) {
        console.error('Error fetching crypto list:', error.message);
        return;
    }
    Array.from(cryptoData).forEach(crypto => {
        const option = document.createElement('option');
        option.value = crypto.symbol;
        option.textContent = crypto.name;
        fromCryptoSelect.appendChild(option.cloneNode(true));
        toCryptoSelect.appendChild(option);
    }); 
}
populateCryptoOptions();

conversion();






// Function to perform crypto conversion
async function convertCrypto() {
    const fromCryptoSelect = document.getElementById('fromCrypto');
    const toCryptoSelect = document.getElementById('toCrypto');
    const conversionAmountInput = document.getElementById('conversionAmount');
    const conversionResultDiv = document.getElementById('conversionResult');

    const fromCrypto = fromCryptoSelect.value.toUpperCase();
    const toCrypto = toCryptoSelect.value.toUpperCase();
    const conversionAmount = conversionAmountInput.value;

    try {
        const response = await fetch(`${apiUrl}?access_key=${apiKey}&from=${fromCrypto}&to=${toCrypto}&amount=${conversionAmount}`);
        const data = await response.json();

        if (data.success) {
            const result = data.result.toFixed(8); // You can adjust the number of decimal places as needed
            conversionResultDiv.textContent = `${conversionAmount} ${fromCrypto} is equal to ${result} ${toCrypto}`;
        } else {
            console.error('Failed to convert crypto:', data.error.info);
            conversionResultDiv.textContent = 'Failed to convert crypto. Please check your input.';
        }
    } catch (error) {
        console.error('Error converting crypto:', error.message);
        conversionResultDiv.textContent = 'Error converting crypto. Please try again.';
    }
}

// Initial setup
populateCryptoOptions();