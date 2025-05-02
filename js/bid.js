// Getting HTML-elements:
const listingTitle = document.getElementById("listingTitle");
const listingDescription = document.getElementById("listingDescription");
const listingCurrentBid = document.getElementById("listingCurrentBid");
const bidForm = document.getElementById("bidForm");
const bidAmount = document.getElementById("bidAmount");

// API base URL:
const API_BASE_URL = "https://api.noroff.dev/api/v1/auction/listings";

// Gets listing ID from URL:
const urlParams = new URLSearchParams(window.location.search);
const listingId = urlParams.get("id");

// Checks if listing ID is there:
if (!listingId) {
  listingTitle.textContent = "Error: No listing ID provided";
  console.log("No listing ID found in URL");
  bidForm.style.display = "none"; // Hides bid form if no ID.
}

// Token have to be stored in localStorage from login:
const token = localStorage.getItem("token");

// Function to get listing-details:
async function fetchListingDetails() {
  try {
    const response = await fetch(
      `${API_BASE_URL}/listings/${listingId}?_bids=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();

    if (response.ok) {
      listingTitle.textContent = data.title || "No title";
      listingDescription.textContent =
        data.description || "No description available";
      const highestBid =
        data.bids && data.bids.length > 0
          ? Math.max(...data.bids.map((bid) => bid.amount))
          : 0;
      listingCurrentBid.textContent = `Current highest bid: ${
        highestBid > 0 ? highestBid + " NOK" : "None"
      }`;
    } else {
      listingCurrentBid.textContent = "Error loading listing";
      console.log("API error", data.errors);
    }
  } catch (error) {
    listingTitle.textContent = "Error loading listing";
    console.log("Fetch listing error", error);
  }
}

// Function for submitting bids:
async function placeBid(event) {
  event.preventDefault(); // Hindrer siden i å reloade

  const bidAmount = parseInt(bidAmountInput.value);

  if (isNaN(bidAmount) || bidAmount <= 0) {
    showError(bidAmountInput, "Please enter a valid bid amount");
    return;
  }

  if (!token) {
    alert("You must be logged in to place a bid");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/listings/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Bid placed successfully!");
      bidForm.reset();
      fetchListingDetails();
    } else {
      alert(`Error: ${data.errors?.[0]?.message || "Could not place bid"}`);
    }
  } catch (error) {
    console.error("Error placing bid:", error);
    alert("An error occurred. Please try again.");
  }
}

// Error handling for error messages:
function showError(inputElement, message) {
  inputElement.classList.add("is-invalid");
  inputElement.nextElementSibling.textContent = message;
}

function clearError(inputElement) {
  inputElement.classList.remove("is-invalid");
  inputElement.nextElementSibling.textContent = "";
}

// Run the functions:
if (listingId) {
  fetchListingDetails();
  bidForm.addEventListener("Submit", placeBid);
}

// Real-time validation for bid amounts:
bidAmountInput.addEventListener("input", () => {
  const bidAmount = parseInt(bidAmountInput.value);
  if (isNaN(bidAmount) || bidAmount <= 0) {
    showError(bidAmountInput, "Please enter a valid bid amount");
  }
});
