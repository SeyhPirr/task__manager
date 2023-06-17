function timeDifference(date) {
  const now = new Date();
  const deadline = new Date(date);
  const timeDifferenceMS = deadline - now;
  const timeDifferenceDay = Math.floor(
    timeDifferenceMS / (24 * 60 * 60 * 1000)
  );
  const timeDifferenceHour = Math.floor(
    (timeDifferenceMS - timeDifferenceDay * (24 * 60 * 60 * 1000)) /
      (60 * 60 * 1000)
  );
  const timeDifferenceMinutes = Math.floor(
    (timeDifferenceMS -
      (timeDifferenceDay * (24 * 60 * 60 * 1000) +
        timeDifferenceHour * (60 * 60 * 1000))) /
      (60 * 1000)
  );
  const diffrence = `${timeDifferenceDay} days ${timeDifferenceHour} hours ${timeDifferenceMinutes} minutes left`;
  console.log(diffrence);
  return diffrence;
}
document.addEventListener("DOMContentLoaded", async () => {
  const taskTitle = document.querySelector("#title");
  const body = document.querySelector("#body");
  const deadline = document.querySelector("#time_left");
  const title = window.location.pathname.split("/")[3];
  console.log(title);
  const response = await fetch("http://localhost:8000/task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  const result = await response.json();
  const timeLeft = timeDifference(result.deadline);
  if (result.title) {
    taskTitle.innerHTML = result.title;
    body.innerHTML = result.body;
    deadline.innerHTML = timeLeft;
  }
});
