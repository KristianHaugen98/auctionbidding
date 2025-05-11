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

  if (!emailRegex.test(email)) {
    document.getElementById("email").classList.add("is-invalid");
    return;
  }

  if (password.length < 1) {
    document.getElementById("password").classList.add("is-invalid");
    return;
  }
  // API-cal:
  try {
    const response = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
        "X-Noroff-API-Key": "790ebff1-28aa-41f4-a642-abffd4660a3d",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!response.ok) {
      errorMessage.textContent = "Wrong email or password";
      return;
    }

    const data = await response.json();
    console.log("Login ok:", data);

    // Lagre token og username
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("username", data.data.name);

    // Naviger til profilsiden
    window.location.href = "/profilepage.html";
  } catch (error) {
    errorMessage.textContent = "Something went wrong, try again";
    console.error("Error with API call:", error);
  }
});
