document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    console.log("form sendt");
    e.preventDefault();

    // Resets all error messages:

    const inputs = document.querySelectorAll(".form-control");
    inputs.forEach((input) => {
      input.classList.remove("is-invalid");
      input.nextElementSibling.textContent = "";
    });

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let hasErrors = false;

    // Checks for empty space:
    if (!email) {
      showError(document.getElementById("email"), "E-mail is mandatory");
      hasErrors = true;
    }

    if (!password) {
      showError(document.getElementById("password"), "Password is mandatory");
      hasErrors = true;
    }

    // Validating e-mail:
    if (!validateEmailDomain(email)) {
      showError(
        document.getElementById("email"),
        "Use @stud.noroff.no or @noroff.no"
      );
      hasErrors = true;
    }

    // Valider passordlengde
    if (password.length < 8) {
      showError(
        document.getElementById("password"),
        "Passord må være minst 8 tegn"
      );
      hasErrors = true;
    }
    if (hasErrors) return;

    try {
      const response = await fetch(
        "https://api.noroff.dev/api/v1/auction/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        alert("Registrering vellykket! Du kan nå logge inn.");
        window.location.href = "login.html";
      } else {
        const errorMessage =
          data?.errors?.[0]?.message || "Registration failed";
        throw new Error(errorMessage);
      }
    } catch (error) {
      alert(error.message);
    }
  });

// Helping functions for e-mail validating:

function validateEmailDomain(email) {
  const validDomains = ["stud.noroff.no", "noroff.no"];
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return validDomains.includes(domain);
}

function showError(inputElement, message) {
  inputElement.classList.add("is-invalid");
  inputElement.nextElementSibling.textContent = "";
}

// Validating e-mail in real time:
document.getElementById("email").addEventListener("input", (e) => {
  console.log("Email input:", e.target.value);
  if (!validateEmailDomain(e.target.value)) {
    showError(e.target, "Use @stud.noroff.no or @noroff.no");
  } else {
    clearError(e.target);
  }
});

// Validating password in real time:
document.getElementById("password").addEventListener("input", (e) => {
  console.log("Password input:", e.target.value);
  if (e.target.value.length < 8) {
    showError(e.target, "Password must use 8 characters or more");
  } else {
    clearError(e.target);
  }
});
