// API base URL
const API_BASE_URL = "https://v2.api.noroff.dev";

// Hent og vis lagret profilbilde
const loadProfile = async () => {
  const avatarPreview = document.getElementById("avatarPreview");
  const token = localStorage.getItem("jwtToken");
  const username = localStorage.getItem("username");

  if (!token || !username) {
    console.warn("Kan ikke hente profilbilde: Logg inn først.");
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/auction/profiles/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": "790ebff1-28aa-41f4-a642-abffd4660a3d",
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Feil ved henting:",
        response.status,
        await response.text()
      );
      return;
    }

    const data = await response.json();
    if (data.data.avatar) {
      avatarPreview.src = data.data.avatar;
      console.log("Profilbilde hentet:", data.data.avatar);
    }
  } catch (error) {
    console.error("Feil ved henting av profil:", error);
  }
};

// Last opp nytt profilbilde
const handleAvatarUpload = () => {
  const avatarInput = document.getElementById("avatarInput");
  const avatarPreview = document.getElementById("avatarPreview");

  if (!avatarInput || !avatarPreview) {
    console.error("Avatar input eller preview finnes ikke.");
    return;
  }

  avatarInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vis bildet lokalt
      const reader = new FileReader();
      reader.onload = (e) => {
        avatarPreview.src = e.target.result;
      };
      reader.readAsDataURL(file);

      // Last opp til server
      const token = localStorage.getItem("jwtToken");
      const username = localStorage.getItem("username");
      if (!token || !username) {
        console.warn("Kan ikke lagre bilde: Logg inn først.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(
          `${API_BASE_URL}/auction/profiles/${username}/media`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "X-Noroff-API-Key": "790ebff1-28aa-41f4-a642-abffd4660a3d",
            },
            body: formData,
          }
        );

        if (!response.ok) {
          console.error(
            "Feil ved opplasting:",
            response.status,
            await response.text()
          );
          return;
        }

        const data = await response.json();
        console.log("Avatar uploaded successfully:", data.data.avatar);
        avatarPreview.src = data.data.avatar || e.target.result;
      } catch (error) {
        console.error("Error uploading avatar:", error);
      }
    }
  });
};

// Media preview for listing form
const initMediaPreview = () => {
  const mediaUpload = document.querySelector(".media-upload");
  const previewContainer = document.getElementById("mediaPreview");

  if (!mediaUpload || !previewContainer) {
    console.warn("Media upload eller preview container finnes ikke.");
    return;
  }

  mediaUpload.addEventListener("change", (e) => {
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
  const listingForm = document.getElementById("createListingForm");
  if (!listingForm) {
    console.error("Listing form finnes ikke.");
    return;
  }

  listingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
      title: e.target.elements.title.value,
      description: e.target.elements.description.value,
      endsAt: new Date(e.target.elements.deadline.value).toISOString(),
      media: [], // Tomt for nå
    };

    try {
      console.log("Listing data:", formData);
      // Legg til API-kall senere
    } catch (error) {
      console.error("Feil ved listing:", error);
    }
  });
};

// Start
document.addEventListener("DOMContentLoaded", () => {
  loadProfile();
  handleAvatarUpload();
  initMediaPreview();
  initListingForm();
});
