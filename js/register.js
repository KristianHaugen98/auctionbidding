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

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    let hasErrors = false;

    // Checks for empty space:
    if (!name) {
      showError(document.getElementById("name"), "Please give yourself a name");
      hasErrors = true;
    }

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
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        "X-Noroff-API-Key": "790ebff1-28aa-41f4-a642-abffd4660a3d",
        body: JSON.stringify({ name, email, password }),
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;

      if (response.ok) {
        // Saves name in localStorage:
        localStorage.setItem("username", name);
        alert("Registration ok, you can log in!");
        window.location.href("login.html");
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

//Validating name in real time:
document.getElementById("name").addEventListener("input", (e) => {
  console.log("Name input:", e.target.value);
  const name = e.target.value.trim();
  if (!name || !/^[a-zA-Z0-9_]+$/.test(name)) {
    showError(
      e.target,
      "Username må inneholde kun bokstaver, tall eller understrek"
    );
  } else {
    clearError(e.target);
  }
});

// Validating e-mail in real time:
document.getElementById("email").addEventListener("input", (e) => {
  console.log("Email input:", e.target.value);
  const email = e.target.value.trim(); // Fikset: Bruk value
  if (!validateEmailDomain(email)) {
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
