// Handling avatar

const handleAvatarUpload = () => {
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");

  avatarInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarInput.avatarPreview.src = e.target.result;
        //API-cal for uploading here
      };
      reader.readAsDataURL(file);
    }
  });
};

// Media preview

const initMediaPreview = () => {
  document.querySelector(".media-upload").addEventListener("change", (e) => {
    const previewContainer = document.getElementById("mediaPreview");
    previewContainer.innerHTML = "";

    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target.result;
        img.classList.add("media-preview-item");
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  });
};

// Handling listings

const initListingForm = () => {
  document
    .getElementById("createListingForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = {
        title: e.target.elements.title.value,
        description: e.target.elements.description.value,
        endsAt: new Date(e.target.elements.deadline.value).toISOString(),
        media: Array.from(e.target.elements.media.files),
      };

      try {
        // API-cal for creating litsings
        console.log("Listing, data:", formData);
        // Showing success message
      } catch (error) {
        console.error("Feil:", error);
      }
    });
};

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  handleAvatarUpload();
  initMediaPreview();
  initListingForm();
});
