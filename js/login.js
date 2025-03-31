document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("errorMessage");

  //Resets errormessage:

  document
    .querySelectorAll(".is-invalid")
    .forEach((el) => el.classList.remove("is-invalid"));
  errorMessage.textContent = "";

  // Validating rulse:

  const validDomains = ["noroff.no", "stud.noroff.no"];
  const emailRegex = new RegExp(`^[^@]+@(${validDomains.join("|")})$`);
});
