console.log("Скрипт загружен! Добро пожаловать в GourmetResto");

document.addEventListener("DOMContentLoaded", function () {
  const title = document.querySelector("h1");
  if (title) {
    title.style.cursor = "pointer";
    title.addEventListener("click", function () {
      alert("Добро пожаловать в наш ресторан!");
    });
  }
});
