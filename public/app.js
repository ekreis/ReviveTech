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

  if (hamburger && navMenu) {
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
  }

  // Check if the current page is profile.html
  if (window.location.pathname === "/profile.html") {
    // Get a reference to the database node containing the image URL
    var imageRef = firebase.database().ref('/user/profile/photo');

    // Get a reference to the img element
    var imgElement = document.getElementById('profile-image');

    // Attach a listener to the database reference to fetch the image URL
    imageRef.on('value', function(snapshot) {
      // Get the URL from the snapshot
      var imageUrl = snapshot.val();

      // Set the src attribute of the img element to the fetched URL
      if (imgElement) {
        imgElement.src = imageUrl;
      }
    });
  }

    // Check if the current page is index.html
    if (window.location.pathname === "/index.html") {
      var resetBtn = document.querySelector(".reset-btn");
      if (resetBtn) {
        resetBtn.addEventListener("click", function () {
          resetValues();
        });
      } else {
        console.warn("Reset button not found in the DOM.");
      }
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

// Assuming you have initialized Firebase and obtained a reference to your database
document.addEventListener('DOMContentLoaded', function() {
  // Get a reference to the img element
  var imgElement = document.getElementById('profile-image');

  // Get a reference to the camera button
  var cameraBtn = document.querySelector('.camera-btn');

  // Add click event listener to the camera button
  if (cameraBtn) {
    cameraBtn.addEventListener('click', function() {
      console.log('Camera button clicked');
      
      // Create an input element of type file
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*'; // Allow only image files
      
      // Listen for change event when a file is selected
      input.addEventListener('change', function(event) {
        var file = event.target.files[0]; // Get the selected file
        
        // Create a storage reference with a unique name
        var storageRef = storage.ref().child('profile_photos/' + file.name);
        
        // Upload the file to Firebase Storage
        storageRef.put(file)
          .then(function(snapshot) {
            console.log('File uploaded successfully');
            
            // Get the download URL of the uploaded file
            storageRef.getDownloadURL()
              .then(function(url) {
                console.log('File URL:', url);
                
                // Update the image source and database with the new URL
                if (imgElement) {
                  imgElement.src = url;
                }
                database.ref('/user/profile/photo').set(url)
                  .then(function() {
                    console.log('Photo URL updated in the database');
                  })
                  .catch(function(error) {
                    console.error('Error updating photo URL:', error);
                  });
              })
              .catch(function(error) {
                console.error('Error getting download URL:', error);
              });
          })
          .catch(function(error) {
            console.error('Error uploading file:', error);
          });
      });
      
      // Trigger click event on the input element to open file selection dialog
      input.click();
    });
  }
});