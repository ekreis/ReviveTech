// Initialize Firebase (same as in your HTML file)
var firebaseConfig = {
  apiKey: "AIzaSyDpGzEUTmhS5mQCfGyW985R11lZMnYdMrI",
  authDomain: "revivetech-2024.firebaseapp.com",
  databaseURL: "https://revivetech-2024-default-rtdb.firebaseio.com",
  projectId: "revivetech-2024",
  storageBucket: "revivetech-2024.appspot.com",
  messagingSenderId: "841490301889",
  appId: "1:841490301889:web:e56286976be71dfaaba540",
  measurementId: "G-6H3BB3MDC7",
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
var storage = firebase.storage(); // Initialize Firebase Storage

// Reference to recommendation path
var recommendationRef = database.ref("user/recommendation");
// Reference to dispense path
var dispenseRef = database.ref("user/dispense");

// Function to update supplement value in the database
function updateSupplement(supplementName) {
  var inputField = document.getElementById(supplementName); // Get the input field element
  if (inputField) {
    var supplementValue = parseInt(inputField.value) || 0; // Get the integer value from the input field
    console.log(
      "Updating supplement",
      supplementName,
      "with value",
      supplementValue
    );
    // Update the database with the integer value
    dispenseRef.child(supplementName).set(supplementValue);
  }
}

// Listen for changes in the supplement input field and update the database accordingly
function addCountInputListener(supplementName) {
  var inputField = document.getElementById(supplementName); // Get the input field element
  if (inputField) {
    // Listen for changes in the input field value
    inputField.addEventListener("input", function () {
      console.log("Input field changed for", supplementName);
      updateSupplement(supplementName); // Call updatesupplement function when the input field value changes
    });
  }
}

// Set the input field values based on the values retrieved from the database
function setInitialCounts(supplementName, snapshot) {
  var inputField = document.getElementById(supplementName);
  if (inputField) {
    inputField.value = snapshot.val() || 0;
  }
}

var supplements = [
  "caffeine",
  "creatine",
  "magnesium",
  "vitaminB6",
  "vitaminC",
  "vitaminD",
];

supplements.forEach(function (supplementName) {
  var supplementRef = database.ref("user/dispense/" + supplementName);
  supplementRef.on("value", function (snapshot) {
    setInitialCounts(supplementName, snapshot);
  });
});

// Call the function to display database values when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listeners to input fields
  supplements.forEach(function (supplementName) {
    addCountInputListener(supplementName);
  });

  // Hamburger menu
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  hamburger.addEventListener("click", mobileMenu);

  function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  }

  // Close hamburger menu when a link is clicked
  const navLink = document.querySelectorAll(".nav-link");

  navLink.forEach((n) => n.addEventListener("click", closeMenu));

  function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  }
});

// Reset function
function resetValues() {
  // Get the recommendation data
  recommendationRef.once("value", function (snapshot) {
    var recommendationData = snapshot.val();

    // Set the dispense data equal to recommendation data
    dispenseRef
      .set(recommendationData)
      .then(() => {
        console.log("Reset successful");
      })
      .catch((error) => {
        console.error("Error resetting values:", error);
      });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Check if the current page is index.html
  if (window.location.pathname === "/index.html") {
    var resetBtn = document.querySelector(".reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        resetValues();
      });
    } else {
      console.error("Reset button not found in the DOM.");
    }
  }
});

// Assuming you have initialized Firebase and obtained a reference to your database
document.addEventListener('DOMContentLoaded', function() {
  // Get a reference to the database node containing the image URL
  var imageRef = firebase.database().ref('/user/profile/photo');

  // Get a reference to the img element
  var imgElement = document.getElementById('profile-image');

  // Attach a listener to the database reference to fetch the image URL
  imageRef.on('value', function(snapshot) {
      // Get the URL from the snapshot
      var imageUrl = snapshot.val();

      // Set the src attribute of the img element to the fetched URL
      imgElement.src = imageUrl;
  });
});
