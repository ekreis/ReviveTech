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

// Reference to recommendation path
var recommendationRef = database.ref("user/recommendation");
// Reference to dispense path
var dispenseRef = database.ref("user/dispense");

// Function to update vitamin value in the database
function updateVitamin(vitaminName) {
  var inputField = document.getElementById(vitaminName); // Get the input field element
  if (inputField) {
    var vitaminValue = parseInt(inputField.value) || 0; // Get the integer value from the input field
    console.log("Updating vitamin", vitaminName, "with value", vitaminValue);
    // Update the database with the integer value
    dispenseRef.child(vitaminName).set(vitaminValue);
  }
}

// Listen for changes in the vitamin input field and update the database accordingly
function addCountInputListener(vitaminName) {
  var inputField = document.getElementById(vitaminName); // Get the input field element
  if (inputField) {
    // Listen for changes in the input field value
    inputField.addEventListener("input", function () {
      console.log("Input field changed for", vitaminName);
      updateVitamin(vitaminName); // Call updateVitamin function when the input field value changes
    });
  }
}

// Set the input field values based on the values retrieved from the database
function setInitialCounts(vitaminName, snapshot) {
  var inputField = document.getElementById(vitaminName);
  if (inputField) {
    inputField.value = snapshot.val() || 0;
  }
}

var vitamins = ["caffeine", "creatine", "magnesium", "vitaminB6", "vitaminC", "vitaminD"];

vitamins.forEach(function (vitaminName) {
  var vitaminRef = database.ref("user/dispense/" + vitaminName);
  vitaminRef.on("value", function (snapshot) {
    setInitialCounts(vitaminName, snapshot);
  });
});

// Call the function to display database values when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listeners to input fields
  vitamins.forEach(function (vitaminName) {
    addCountInputListener(vitaminName);
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

// // Function to set LED flashes
// function setLEDFlashes() {
//   var flashCount = parseInt(document.getElementById("flash-count").value); // Convert value to integer
//   var databaseTest = database.ref("test"); // Reference to test path
//   databaseTest.update({
//     flashCount: flashCount,
//   });
// }

// // Function to display the integer and float values from the database
// function displayDatabaseValues() {
//   var readingInt = document.getElementById("reading-int");
//   var readingFloat = document.getElementById("reading-float");

//   // Reference to the database paths containing the integer and float values
//   var intRef = database.ref("test/int");
//   var floatRef = database.ref("test/float");

//   // Listen for changes in the integer value
//   intRef.on("value", function (snapshot) {
//     var intValue = snapshot.val();
//     readingInt.innerText = intValue;
//   });

//   // Listen for changes in the float value
//   floatRef.on("value", function (snapshot) {
//     var floatValue = snapshot.val();
//     readingFloat.innerText = floatValue.toFixed(2); // Display float value with 2 decimal places
//   });
