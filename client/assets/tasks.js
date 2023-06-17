document.addEventListener("DOMContentLoaded", async () => {
  const title = document.querySelector("#title");
  const username = window.location.pathname.split("/")[2];
  title.innerHTML = username + " tasks";
  const response = await fetch("http://localhost:8000/allTasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const result = await response.json();

  console.log(result);
  if (result[0])
    result.forEach((element) => {
      document.querySelector(
        "#task_list"
      ).innerHTML += `<li><a href="/tasks/${username}/${element.title}">${element.title}</a></li>`;
    });
  const newTask = document.querySelector("#new_task");
  console.log(newTask);
  newTask.innerHTML += `<h1><a href="/tasks/${username}/new">NEW TASK</a></h1>`;
});
