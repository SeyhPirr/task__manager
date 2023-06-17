const submitButton = document.querySelector("#submit");

async function submit(event) {
  event.preventDefault();
  const inputUsername = document.querySelector("#username").value;
  const username = inputUsername.toLowerCase();
  const password = document.querySelector("#password").value;
  try {
    if (!username || !password)
      throw new Error("You can`t have empty input lines.");

    const response = await fetch("http://localhost:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const result = await response.json();
    console.log(result.err);
    if (result.err) throw new Error(result.err);

    window.navigation.navigate(`tasks/${result.username}`);
    return;
  } catch (err) {
    console.log(err.message);
    document.querySelector("#error_message").innerHTML = err.message;
  }
}
submitButton.addEventListener("click", submit);
