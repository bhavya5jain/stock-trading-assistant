var apiKey = "ahi6lquf8mnfvARX9R46s6wZ2oGlwUPG"; // Replace with your actual API key

document.getElementById("stockForm").addEventListener("submit", function(event) {
    event.preventDefault();
    getStockInformation();
});

var stockNameInput = document.getElementById("stockName");
stockNameInput.addEventListener("input", function() {
    var stockName = this.value;
    fetchStockSuggestions(stockName);
});


function fetchStockSuggestions(stockName) {
    var suggestionsDiv = document.getElementById("stockSuggestions");
    suggestionsDiv.innerHTML = "";

    if (stockName && stockName.trim() !== "") {

        var url = `https://financialmodelingprep.com/api/v3/search?query=${stockName}&limit=5&apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    var ulElement = document.createElement("ul");
                    data.forEach(stock => {
                        var liElement = document.createElement("li");
                        liElement.textContent = stock.symbol + " - " + stock.name;
                        liElement.addEventListener("click", function() {
                            stockNameInput.value = stock.symbol;
                            suggestionsDiv.innerHTML = "";
                        });
                        ulElement.appendChild(liElement);
                    });

                    suggestionsDiv.appendChild(ulElement);
                    suggestionsDiv.style.display = "block";
                } else {
                    suggestionsDiv.style.display = "none";
                }
            })
            .catch(error => {
                console.error(error);
                suggestionsDiv.style.display = "none";
            });

    } else {

        suggestionsDiv.style.display = "none";

    }

}


document.addEventListener("click", function(event) {

    var targetElement = event.target;
    if (targetElement.id !== "stockName" && targetElement.parentNode.id !== "stockSuggestions") {
        document.getElementById("stockSuggestions").style.display = "none";
    }
});


function getStockInformation() {

    var stockSymbol = document.getElementById("stockName").value;
    var capital = document.getElementById("capital").value;
    var risk = document.getElementById("risk").value;
    var timeFrame = document.getElementById("timeFrame").value;

    var stockInfoDiv = document.getElementById("stockInfo");

    stockInfoDiv.innerHTML = "Loading stock information...";

    var profileURL = `https://financialmodelingprep.com/api/v3/profile/${stockSymbol}?apikey=${apiKey}`;
    fetch(profileURL)
        .then(response => response.json())
        .then(profileData => {
            stockInfoDiv.innerHTML += "<h2>Stock Profile</h2>";
            stockInfoDiv.innerHTML += "<strong>Symbol:</strong> " + profileData[0].symbol + "<br>";
            stockInfoDiv.innerHTML += "<strong>Name:</strong> " + profileData[0].companyName + "<br>";
            stockInfoDiv.innerHTML += "<strong>Exchange:</strong> " + profileData[0].exchange + "<br>";
            stockInfoDiv.innerHTML += "<strong>Industry:</strong> " + profileData[0].industry + "<br>";
            stockInfoDiv.innerHTML += "<strong>Description:</strong> " + profileData[0].description + "<br><br>";
            stockInfoDiv.innerHTML += "<h2>Income Statement</h2>";
        })
        .catch(error => {
            stockInfoDiv.textContent = "\nCouldn't fetch company profile data.";
            console.error(error);
        });

    var incomeStatementURL = `https://financialmodelingprep.com/api/v3/income-statement/${stockSymbol}?apikey=${apiKey}`;
    fetch(incomeStatementURL)
        .then(response => response.json())
        .then(incomeStatementData => {
            if (incomeStatementData.length > 0) {
                // Display relevant income statement data
                stockInfoDiv.innerHTML += "<strong>Revenue:</strong> " + incomeStatementData[0].revenue + "<br>";
                stockInfoDiv.innerHTML += "<strong>Net Income:</strong> " + incomeStatementData[0].netIncome + "<br>";
                // Add other relevant income statement fields as needed
            } else {
                stockInfoDiv.innerHTML += "\nNo income statement data available.<br>";
            }


        })
        .catch(error => {
            stockInfoDiv.textContent = "\nCouldn't fetch income statement.";
            console.error(error);
        });

    var historicalDataURL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${stockSymbol}&outputsize=compact&datatype=csv&apikey=NYB3XNTKJ0VFIJO5`; // Replace with your actual Alpha Vantage API key
    fetch(historicalDataURL)
        .then(response => response.text())
        .then(historicalData => {
            if (historicalData) {
                var backendURL = `http://localhost:5000/stock_info?stock_name=${stockSymbol}&capital=${capital}&risk=${risk}&time_frame=${timeFrame}`
                fetch(backendURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                    body: historicalData,
                })
                    .then(response => response.json())
                    .then(response => {
                        stockInfoDiv.innerHTML += "<h2>GPT response</h2>";
                        stockInfoDiv.innerHTML += "\n" + response.result;
                    })
                    .catch(error => {
                        // Handle errors
                        console.error('Error:', error);
                    });
            }
        })
        .catch(error => {
            stockInfoDiv.textContent = "\nCouldn't fetch historical data.";
            console.error(error);
        });

    // To embed external HTML file into main page, to be potentially saved by the backend in gpr-responses folder

    //    // var responseDiv = document.getElementById("stockresponse");      
    //
    //    // responseDiv.innerHTML = `<pre>Response Data:\nInvest: ${data.Invest}\nProbability: ${data.Probability}</pre>`;
    //
    //    var responseDiv = document.getElementById("stockresponse");
    //    responseDiv.innerHTML = `<pre>Response Data:\nInvest: ${data.Invest}\nProbability: ${data.Probability}</pre>`;
    //
    //    // Load external HTML file
    //    fetch('response.html')
    //        .then(response => response.text())
    //        .then(htmlContent => {
    //            // Append the HTML content to the responseDiv
    //            responseDiv.innerHTML += htmlContent;
    //        })
    //        .catch(error => {
    //            console.error('Error loading HTML file:', error);
    //        });
}
