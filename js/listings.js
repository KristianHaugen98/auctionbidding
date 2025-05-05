// API base URL:
const API_BASE_URL = "https://api.noroff.dev/api/v1/auction";

// Getting containers for auctioncards:
const auctionsContainer = document.getElementById("auctionsContainer");

// Getting JWT-token from localStorage (To verify authorized users):
const token = localStorage.getItem("token");

// Function to get auctions from API:
async function fetchAuctions() {
  try {
    const response = await fetch(`${API_BASE_URL}/listings?_bids=true`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // Adding token if exists
      },
    });
    console.log("API respnse status:", response.status); // Log status

    const data = await response.json();
    console.log("Auctions retrieved:", data); //Log Data

    if (response.ok) {
      displayAuctions(data);
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
      <div class="card shadow-sm h-100">
        <img src="${image}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover; />
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <p class="card-text">${description.substring(0, 100)}${
      description.length > 100 ? "..." : ""
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
// Run auction fetch when the page loads:
fetchAuctions();
