// Get the modal
var modal = document.getElementById("contactModal");

// Get the link that opens the modal
var contactoLink = document.getElementById("contactoLink");

// When the user clicks the link, open the modal
contactoLink.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior
  modal.style.display = "block";
});

// When the user clicks on the close button, close the modal
var closeButton = document.getElementsByClassName("close")[0];
closeButton.addEventListener("click", function () {
  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.addEventListener("click", function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
});

// Get the form
var contactForm = document.getElementById("contactForm");

// Add event listener for form submission
contactForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission

  // Get form data
  var formData = new FormData(contactForm);

  // You can now use formData to send the form data to your server using AJAX or any other method
  // For demonstration purposes, let's just log the form data to the console
  for (var pair of formData.entries()) {
    console.log(pair[0] + ": " + pair[1]);
  }

  // Close the modal after form submission (you can adjust this as needed)
  var modal = document.getElementById("contactModal");
  modal.style.display = "none";
});
