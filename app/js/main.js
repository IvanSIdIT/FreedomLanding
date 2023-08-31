let options = {
  root: null,
  rootMargin: "5px",
  threshold: 0.5,
};

let callback = function (entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      console.log("find", entry);
      entry.target.classList.add("active");
    }
  });
};

let observer = new IntersectionObserver(callback, options);

let targets = document.querySelectorAll(".anim");

targets.forEach((target) => {
  observer.observe(target);
});

//Modal window toggle

let modalWindow = document.getElementsByClassName("modal");

function openModal() {
  modalWindow[0].classList.add("active");
}

function closeModal() {
  modalWindow[0].classList.remove("active");
}
