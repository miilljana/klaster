console.log("Client-side code running");
const button = document.getElementById("saveForm");
button.addEventListener("click", function (e) {
  e.preventDefault();
  const songTitleValue = document.getElementById("Field5").value;
  const artistValue = document.getElementById("Field6").value;
  const additionalFilters = document.querySelector(
    'input[name="Field111"]:checked'
  ).value;
  fetch("http://localhost:8080/read", {
    method: "POST",
    body: JSON.stringify({ songTitleValue, artistValue, additionalFilters }),
  })
    .then(function (response) {
      if (response.ok) {
        console.log({ response });
        return;
      }
      throw new Error("Request failed.");
    })
    .catch(function (error) {
      console.log({ error });
    });
});
