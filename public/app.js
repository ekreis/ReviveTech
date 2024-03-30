// Initialize Firebase (same as in your HTML file)
var firebaseConfig = {
  apiKey: "YOUR_API_KEY",
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
  var checkbox = document.getElementById(vitaminName); // Get the checkbox element
  var vitaminValue = checkbox.checked; // Get the checkbox state
  // Update the database with the checkbox state
  dispenseRef.child(vitaminName).set(vitaminValue);
}

// Listen for changes in the vitamin checkbox state and update the database accordingly
function addCheckboxListener(vitaminName) {
  var checkbox = document.getElementById(vitaminName); // Get the checkbox element
  // Listen for changes in the checkbox state
  checkbox.addEventListener("change", function () {
    updateVitamin(vitaminName); // Call updateVitamin function when the checkbox state changes
  });
}

// Reference to the database paths containing the checkbox states
var caffeineRef = database.ref("user/dispense/caffeine");
var creatineRef = database.ref("user/dispense/creatine");
var magnesiumRef = database.ref("user/dispense/magnesium");
var vitaminB6Ref = database.ref("user/dispense/vitaminB6");
var vitaminCRef = database.ref("user/dispense/vitaminC");
var vitaminDRef = database.ref("user/dispense/vitaminD");

// Set the checkbox states based on the values retrieved from the database
caffeineRef.on("value", function (snapshot) {
  document.getElementById("caffeine").checked = snapshot.val();
});

creatineRef.on("value", function (snapshot) {
  document.getElementById("creatine").checked = snapshot.val();
});

magnesiumRef.on("value", function (snapshot) {
  document.getElementById("magnesium").checked = snapshot.val();
});

vitaminB6Ref.on("value", function (snapshot) {
  document.getElementById("vitaminB6").checked = snapshot.val();
});

vitaminCRef.on("value", function (snapshot) {
  document.getElementById("vitaminC").checked = snapshot.val();
});

vitaminDRef.on("value", function (snapshot) {
  document.getElementById("vitaminD").checked = snapshot.val();
});

// Call the function to display database values when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  displayDatabaseValues();
});

// Attach event listeners to checkboxes
document.addEventListener("DOMContentLoaded", function () {
  addCheckboxListener("caffeine");
  addCheckboxListener("creatine");
  addCheckboxListener("magnesium");
  addCheckboxListener("vitaminB6");
  addCheckboxListener("vitaminC");
  addCheckboxListener("vitaminD");
});

document.addEventListener("DOMContentLoaded", function () {
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
