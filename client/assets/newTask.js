const sendButton = document.querySelector("#send");
console.log(sendButton);
console.log(window.location);
const username = window.location.pathname.split("/")[2];
console.log(username);
const now = new Date("2023-01-17T16:45:00");
console.log(now);
async function send(event) {
  const title = document.querySelector("#title").value;
  const body = document.querySelector("#body").value;
  const dateInput = document.querySelector("#date").value;
  const date = dateInput.replace(" ", "T");

  try {
    if (!title || !date)
      throw new Error("You can`t leave title and date as empty lines.");
    console.log(title, body, date);
    const response = await fetch("http://localhost:8000/newTask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, body, date, username }),
    });
    const result = await response.json();
    console.log(result);
    if (result.date) {
      window.navigation.navigate(
        `http://localhost:8000/tasks/${result.username}/${result.title}`
      );
    }

    return;
  } catch (err) {
    document.querySelector("#error").innerHTML = err.message;
  }
}
sendButton.addEventListener("click", send);
