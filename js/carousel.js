document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://api.noroff.dev/api/v1/auction/listings";
  let currentPage = 0;
  const itemsPerPage = 3;

  // Getting auctions from API:

  async function fetchAuctions() {
    try {
      const response = await fetch(
        `${API_URL}?sort=created&sortOrder=desc&limit=${itemsPerPage}&offset=${
          currentPage * itemsPerPage
        }`
      );
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.error("Error fetching auctions:", error);
      return [];
    }
  }

  // This will create the auction cards:

  function createAuctionCard(auction) {
    return `
    <div class="col-md-4">
    <div class="auction-card card h-100">
        <img src="${auction.media?.[0]?.url || "img/placeholder.jpg"}"
            class="card-img-top"
            alt="${auction.title}">
        <div class="card-body">
            <h5 class="card-title">${auction.title}</h5>
            <p class="card-text text-muted">${auction.description.substring(
              0,
              60
            )}...</p>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-primary">${
                  auction._count?.bids || 0
                } bids</span>
                <small class="text-muted">Ends: ${new Date(
                  auction.endsAt
                ).toLocaleDateString()}
                </small>
                </div>
                <button class="btn btn-primary w-100 bid-button" data-id="${
                  auction.id
                }">
                <i class="fas fa-gravel me-2"></i>Bid Now
                </button>
            </div>
        </div>
    </div>
    `;
  }

  // This update the carousel:

  async function updateCarousel() {
    const auctions = await fetchAuctions();
    const carouselTrack = document.getElementById("carousel-track");

    carouselTrack.innerHTML = auctions.map(createAuctionCard).join("");

    // This deactivates pointers at the end:

    document.querySelector(".prev").disabled = currentPage === 0;
  }

  // Event listners for controlls:

  document.querySelector(".prev").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      updateCarousel();
    }
  });

  document.querySelector(".next").addEventListener("click", () => {
    currentPage++;
    updateCarousel();
  });

  // Initial load:

  updateCarousel();
});
