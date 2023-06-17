const submitButton = document.querySelector("#submit");

async function submit(event) {
  event.preventDefault();
  const inputUsername = document.querySelector("#username").value;
  const username = inputUsername.toLowerCase();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  try {
    if (!username || !email || !password)
      throw new Error("You can`t have empty input lines.");

    const response = await fetch("http://localhost:8000/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    const result = await response.json();
    if (result.err) throw new Error(result.err);

    window.navigation.navigate(`tasks/${result.username}`);
    return;
  } catch (err) {
    document.querySelector("#error_message").innerHTML = err.message;
  }
}
submitButton.addEventListener("click", submit);
