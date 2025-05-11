// API base URL:
const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";

// Getting containers for auctioncards:
const auctionsContainer = document.getElementById("auctionsContainer");

// Gets searchform:
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const clearButton = document.getElementById("clearSearch");

// Getting JWT-token from localStorage (To verify authorized users):
const token = localStorage.getItem("token");

// Saves all auctions globaly for searching:
let allAuctions = [];

// Function to get auctions from API:
async function fetchAuctions() {
  try {
    const response = await fetch(`${API_BASE_URL}/listings?_bids=true`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Adding token if exists
      },
    });
    console.log("API response status:", response.status); // Log status

    const data = await response.json();
    console.log("Auctions retrieved:", data); //Log Data

    if (response.ok) {
      allAuctions = data; // Stores auctions globaly
      displayAuctions(data); // Shows all auctions
    } else {
      auctionsContainer.innerHTML = `<p class="text-center text-danger">Error: ${
        data.errors?.[0]?.message || "Could not load auctions"
      }</p>`;
    }
  } catch (error) {
    console.error("Error getting auctions:", error);
    auctionsContainer.innerHTML = `<p class="text-center text-danger">Error: Could not load auctions. Please try again later.</p>`;
  }
}

// After making function that gets auctions from API, we need to now show it on website:
function displayAuctions(auctions) {
  auctionsContainer.innerHTML = ""; //Empty comtainer

  if (auctions.length === 0) {
    auctionsContainer.innerHTML = `<p class="text-center">No auctions found.</p>`;
    return;
  }

  auctions.forEach((auction) => {
    // Handling missing data:
    const title = auction.title || "No title";
    const description = auction.description || "No description available";
    const image = auction.media?.[0] || "/img/placeholder.jpg"; // An image if no images is shown.
    const highestBid =
      auction.bids && auction.bids.length > 0
        ? Math.max(...auction.bids.map((bid) => bid.amount))
        : 0;
    const bidText = highestBid > 0 ? `${highestBid} NOK` : "No bids yet";
    const endsAt = new Date(auction.endsAt).toDateString(); // Converts date.

    // Making HTML-cards:
    const card = ` 
    <div class="col-md-4">
      <div class="card shadow p-3 h-100">
        <img src="${image}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover;" />
        <div class="card-body">
            <h4 class="card-title">${title.substring(0, 15)}${
      title.length > 15 ? "..." : ""
    }</h4>
            <p class="card-text">${description.substring(0, 40)}${
      description.length > 40 ? "..." : ""
    }</p>
            <p class="card-text"><strong>Seller:</strong> ${
              auction.seller?.name || "Unknown"
            }</p>
            <p class="card-text"><strong>Highest Bid:</strong> ${bidText}</p>
            <p class="card-text"><strong>Ends:</strong> ${endsAt}</p>
            <a href="bid.html?id=${
              auction.id
            }" class="btn btn-primary w-100">Place Bid</a>
            </div>
        </div>
    </div>
    `;
    auctionsContainer.insertAdjacentHTML("beforeend", card);
  });
}

// Searchfunction, listen to input in the search field:
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const filteredAuctions = allAuctions.filter((auction) =>
      auction.title.toLowerCase().includes(searchTerm)
    );
    displayAuctions(filteredAuctions);
  });
} else {
  console.log("Searchfield with id='search' was not found.");
}

// Clearbutton (empty searchbar and show all auctions):
if (clearButton) {
  clearButton.addEventListener("click", () => {
    searchInput.value = ""; // Empty searchbar
    displayAuctions(allAuctions); // Shows all auctions
  });
} else {
  console.error("Clear-button with id='clearSearch' was not found.");
}

// Shows "Loading" when auctions is searched for:
auctionsContainer.innerHTML = `<p class="text-center">Loading auctions...</p>`;
// Run auction fetching whe page loads:
fetchAuctions();
