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

// Function to increase supplement amount
function increaseSupplement(supplementName) {
  var inputField = document.getElementById(supplementName); // Get the input field element
  if (inputField) {
    var supplementValue = parseInt(inputField.value) || 0; // Get the current value
    inputField.value = supplementValue + 1; // Increment the value
    updateSupplement(supplementName); // Update the database
  }
}

// Function to decrease supplement amount
function decreaseSupplement(supplementName) {
  var inputField = document.getElementById(supplementName); // Get the input field element
  if (inputField) {
    var supplementValue = parseInt(inputField.value) || 0; // Get the current value
    if (supplementValue > 0) {
      inputField.value = supplementValue - 1; // Decrement the value if greater than 0
      updateSupplement(supplementName); // Update the database
    }
  }
}

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
    var imageRef = firebase.database().ref("/user/profile/photo");

    // Get a reference to the img element
    var imgElement = document.getElementById("profile-image");

    // Attach a listener to the database reference to fetch the image URL
    imageRef.on("value", function (snapshot) {
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
      console.log("Reset button found in the DOM."); // Add this line for debugging
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
  console.log("Reset button clicked"); // Add this line for debugging
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
document.addEventListener("DOMContentLoaded", function () {
  // Get a reference to the img element
  var imgElement = document.getElementById("profile-image");

  // Get a reference to the database node containing the image URL
  var imageRef = firebase.database().ref("/user/profile/photo");

  // Attach a listener to the database reference to fetch the image URL
  imageRef.on("value", function (snapshot) {
    // Get the URL from the snapshot
    var imageUrl = snapshot.val();

    // Set the src attribute of the img element to the fetched URL or default image if URL is not available
    if (imgElement) {
      imgElement.src = imageUrl || "default_profile.png";
    }
  });

  // Get a reference to the camera button
  var cameraBtn = document.querySelector(".camera-btn");

  // Add click event listener to the camera button
  if (cameraBtn) {
    cameraBtn.addEventListener("click", function () {
      console.log("Camera button clicked");

      // Create an input element of type file
      var input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*"; // Allow only image files

      // Listen for change event when a file is selected
      input.addEventListener("change", function (event) {
        var file = event.target.files[0]; // Get the selected file

        // Create a storage reference with a unique name
        var storageRef = storage.ref().child("profile_photos/" + file.name);

        // Upload the file to Firebase Storage
        storageRef
          .put(file)
          .then(function (snapshot) {
            console.log("File uploaded successfully");

            // Get the download URL of the uploaded file
            storageRef
              .getDownloadURL()
              .then(function (url) {
                console.log("File URL:", url);

                // Update the image source and database with the new URL
                if (imgElement) {
                  imgElement.src = url;
                }
                database
                  .ref("/user/profile/photo")
                  .set(url)
                  .then(function () {
                    console.log("Photo URL updated in the database");
                  })
                  .catch(function (error) {
                    console.error("Error updating photo URL:", error);
                  });
              })
              .catch(function (error) {
                console.error("Error getting download URL:", error);
              });
          })
          .catch(function (error) {
            console.error("Error uploading file:", error);
          });
      });

      // Trigger click event on the input element to open file selection dialog
      input.click();
    });
  }
  // Get a reference to the name-header element
  var nameHeader = document.getElementById("name-header");
  var ageText = document.getElementById("age");
  var sexText = document.getElementById("sex");

  // Get a reference to the database node containing the user's name
  var nameRef = firebase.database().ref("/user/profile/name");
  var ageRef = firebase.database().ref("/user/profile/age");
  var sexRef = firebase.database().ref("/user/profile/sex");

  // Attach a listener to the database reference to fetch the user's name
  nameRef.on("value", function (snapshot) {
    // Get the name from the snapshot
    var userName = snapshot.val();

    // Set the text content of the name-header element to the user's name
    if (nameHeader) {
      nameHeader.textContent = userName || "About You"; // Display "Unknown" if name is not available
    }
  });

  // Attach a listener to the database reference to fetch the user's age
  ageRef.on("value", function (snapshot) {
    // Get the age from the snapshot
    var age = snapshot.val();

    // Set the text content of the age element to the user's age
    if (ageText) {
      ageText.textContent = age || "Unknown"; // Display "Unknown" if name is not available
    }
  });

  // Attach a listener to the database reference to fetch the user's sex
  sexRef.on("value", function (snapshot) {
    // Get the sex from the snapshot
    var sex = snapshot.val();

    // Set the text content of the sex element to the user's sex
    if (sexText) {
      sexText.textContent = sex || "Unknown"; // Display "Unknown" if name is not available
    }
  });
});

// Function to update goal value in the database
function updateGoal(goalName) {
  var checkbox = document.getElementById(goalName); // Get the checkbox element
  if (checkbox) {
    var goalValue = checkbox.checked; // Get the checkbox state
    // Update the database with the checkbox state
    database.ref("user/goals/" + goalName).set(goalValue);
    recommendSupplements();
  }
}

// Listen for changes in the goal checkbox state and update the database accordingly
function addGoalCheckboxListener(goalName) {
  var checkbox = document.getElementById(goalName); // Get the checkbox element
  if (checkbox) {
    // Listen for changes in the checkbox state
    checkbox.addEventListener("change", function () {
      updateGoal(goalName); // Call updateGoal function when the checkbox state changes
    });
  }
}

// Set the checkbox states based on the values retrieved from the database
function setGoalCheckboxState(goalName, snapshot) {
  var checkbox = document.getElementById(goalName);
  if (checkbox) {
    checkbox.checked = snapshot.val();
  }
}

var goals = ["endurance", "energy", "immunity", "muscle", "recovery", "weight"];

goals.forEach(function (goalName) {
  var goalRef = database.ref("user/goals/" + goalName);
  goalRef.on("value", function (snapshot) {
    setGoalCheckboxState(goalName, snapshot);
  });
});

// Call the function to display database values when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Attach event listeners to checkboxes
  goals.forEach(function (goalName) {
    addGoalCheckboxListener(goalName);
  });
});

// Function to recommend supplement based on gene and allele
function recommendSupplement(gene, allele) {
  // Define the allele-to-supplement mappings with descriptions
  const supplementMappings = {
    SLC23A2: {
      AA: {
        supplement: "Vitamin C",
        description:
          "The SLC23A2 gene encodes a Vitamin C transporter, and around 28% of the population carries a variant that reduces the absorption and tissue accumulation of Vitamin C. This variant may lead to increased risk of Vitamin C deficiency if dietary intake is not sufficient, therefore Vitamin C is highly recommended individuals of all genotypes.",
      },
      AG: {
        supplement: "Vitamin C",
        description:
          "The SLC23A2 gene encodes a Vitamin C transporter, and around 28% of the population carries a variant that reduces the absorption and tissue accumulation of Vitamin C. This variant may lead to increased risk of Vitamin C deficiency if dietary intake is not sufficient, therefore Vitamin C is highly recommended individuals of all genotypes.",
      },
      GG: {
        supplement: "Vitamin C",
        description:
          "The SLC23A2 gene encodes a Vitamin C transporter, and around 28% of the population carries a variant that reduces the absorption and tissue accumulation of Vitamin C. This variant may lead to increased risk of Vitamin C deficiency if dietary intake is not sufficient, therefore Vitamin C is highly recommended individuals of all genotypes.",
      },
    },
    ACE: {
      II: {
        supplement: "Magnesium",
        description:
          "The ACE Gene tells users what level of salt sensitivity they have. Endurance athletes commonly have to replenish sodium, but with the II allele, individuals will have to counteract sensitivities with more potassium. In the process, users will have to increase intake of magnesium, which encourages the active transport of potassium ions across cell membranes.",
      },
      ID: { supplement: "Vitamin D", description: "Description for ID allele" },
      DD: { supplement: "Vitamin D", description: "Description for DD allele" },
    },
    ACTN3: {
      RR: {
        supplement: "Vitamin D",
        description:
          "The ACTN3 gene, or alpha-actinin-3, plays a crucial role in muscle function and is associated with fast-twitch muscle fibers. These muscle fibers are responsible for rapid but powerful contractions.  This gene is considered essential for activities requiring strength, speed, and power, such as sprinting and weightlifting.  Individuals with the RR allele will have faster-twitch muscle fibers that allow for quick movements when needed.",
      },
      RX: { supplement: "Magnesium", description: "Description for RX allele" },
      XX: { supplement: "Magnesium", description: "Description for XX allele" },
    },
    NOS3: {
      TT: {
        supplement: "Vitamin D",
        description:
          "The NOS3 gene, also known as endothelial nitric oxide synthase (eNOS), plays a crucial role in blood vessel dilation and overall cardiovascular function. One of the common variations of the NOS3 gene is the TT allele, which is associated with increased production of nitric oxide in the body. The TT allele of the NOS3 gene helps improve performance by supporting optimal blood flow and oxygen delivery to muscles.  As a result, this delays the onset of fatigue and improves overall exercise capacity.",
      },
      TG: { supplement: "Vitamin C", description: "Description for TG allele" },
      GG: { supplement: "Vitamin C", description: "Description for GG allele" },
      G: { supplement: "Vitamin C", description: "Description for G allele" },
    },
  };

  // Check if the gene exists in the supplement mappings
  if (supplementMappings[gene]) {
    // Check if the allele exists for the gene
    if (supplementMappings[gene][allele]) {
      // Return an object containing the recommended supplement and description
      return supplementMappings[gene][allele];
    } else {
      return {
        supplement: "No recommendation",
        description: "No description available for this allele.",
      };
    }
  } else {
    return {
      supplement: "No recommendation",
      description: "No description available for this gene.",
    };
  }
}

// Function to select gene and update UI
function selectGene(gene) {
  // Update selected gene in the database
  const selectedGeneRef = firebase.database().ref(`/user/genes/${gene}`);
  selectedGeneRef.once("value", (snapshot) => {
    const allele = snapshot.val(); // Get the allele for the selected gene
    const geneName = gene;
    const recommendedSupplement = recommendSupplement(gene, allele); // Function to recommend supplement

    // Update gene information
    document.getElementById(
      "selected-gene"
    ).textContent = `${geneName} - ${allele} Allele`;
    document.getElementById("allele-description").textContent =
      recommendedSupplement.description; // Update description

    // Display recommended supplement
    const recommendation = document.querySelector(".recommendation");
    recommendation.innerHTML = `<h3>${recommendedSupplement.supplement}</h3>`;
  });
}

// Function to handle click event on gene buttons
function handleGeneButtonClick(geneButton) {
  // Remove 'active' class from all gene buttons
  document.querySelectorAll(".gene-buttons button").forEach((button) => {
    button.classList.remove("active");
  });

  // Add 'active' class to the clicked gene button
  geneButton.classList.add("active");

  // Get the gene name from the button's data attribute or text content
  const geneName = geneButton.dataset.gene || geneButton.textContent.trim();

  // Call the function to select the gene and update UI
  selectGene(geneName);
}

// Attach click event listeners to gene buttons
document.querySelectorAll(".gene-buttons button").forEach((button) => {
  button.addEventListener("click", function () {
    handleGeneButtonClick(this);
  });
});

// Function to dispense supplements
document.addEventListener("DOMContentLoaded", function () {
  function dispenseSupplements() {
    // Code to trigger the dispensing of supplements
    console.log("Dispensing supplements...");
    database
      .ref("/dispense")
      .set(true)
      .then(() => {
        console.log("Dispense set to true in the database");
      })
      .catch((error) => {
        console.error("Error setting dispense value:", error);
      });
  }

  var dispenseBtn = document.querySelector(".dispense-btn");
  if (dispenseBtn) {
    dispenseBtn.addEventListener("click", function () {
      dispenseSupplements();
    });
  } else {
    console.warn("Dispense button not found in the DOM.");
  }
});
