// Function to fetch user's genetic data from Firebase
function fetchUserGenetics() {
  // Fetch user's genetic data from Firebase database
  return firebase
    .database()
    .ref(`/user/genes`)
    .once("value")
    .then((snapshot) => {
      return snapshot.val(); // Returns user's genetic data object
    });
}

// Function to fetch user's goals from Firebase
function fetchUserGoals() {
  // Fetch user's goals from Firebase database
  return firebase
    .database()
    .ref(`/user/goals`)
    .once("value")
    .then((snapshot) => {
      return snapshot.val(); // Returns user's goals object
    });
}

// Function to update recommendation in Firebase
function updateRecommendation(supplement) {
  // Update recommendation in Firebase database
  firebase
    .database()
    .ref(`/user/recommendation/${supplement}`)
    .transaction((currentCount) => {
      // Increment the current count by 1
      return (currentCount || 0) + 1;
    });
}

// Function to recommend supplements based on user's genetic data and goals
async function recommendSupplements() {
  try {
    // Set all recommendation counts to zero
    firebase.database().ref(`/user/recommendation`).set({
      caffeine: 0,
      creatine: 0,
      magnesium: 0,
      vitaminB6: 0,
      vitaminC: 0,
      vitaminD: 0,
    });

    // Fetch user's genetic data
    const userGenetics = await fetchUserGenetics();

    // Fetch user's goals
    const userGoals = await fetchUserGoals();

    // Defining which genotypes match up to recommendations
    const genesRecommendations = {
      SLC23A2: {
        AA: "vitaminC",
        AG: "vitaminC",
        GG: "vitaminC",
      },
      ACE: {
        II: "magnesium",
        ID: "vitaminD",
        DD: "vitaminD",
      },
      ACTN3: {
        RR: "vitaminC",
        RX: "magnesium",
        XX: "magnesium",
      },
      NOS3: {
        TT: "vitaminD",
        TG: "vitaminC",
        GG: "vitaminC",
        G: "vitaminC",
      },
    };

    // Defining which goals match up to recommendations
    const goalsRecommendations = {
      endurance: {
        true: "caffeine",
      },
      energy: {
        true: "caffeine",
      },
      immunity: {
        true: "vitaminC",
      },
      muscle: {
        true: "creatine",
      },
      recovery: {
        true: "magnesium",
      },
      weight: {
        true: "vitaminB6",
      },
    };

    // Check if user's genetic data is available
    if (userGenetics && userGoals) {
      // Loop through each gene in the user's genetic data
      for (const gene in userGenetics) {
        if (userGenetics.hasOwnProperty(gene)) {
          const genotype = userGenetics[gene];

          // Fetch the corresponding supplement recommendation for the gene and genotype
          const recommendation = genesRecommendations[gene][genotype];

          // Update recommendation if it's not null
          if (recommendation) {
            updateRecommendation(recommendation);
            console.log(
              `Increased recommendation for ${recommendation} based on your genetic data.`
            );
          } else {
            console.log(
              `No specific recommendation for gene ${gene} with genotype ${genotype}.`
            );
          }
        }
      } 
      // Loop through each goal in the user's goal data
      for (const goal in userGoals) {
        if (userGoals.hasOwnProperty(goal)) {
          const goalStatus = userGoals[goal];

          // Fetch the corresponding supplement recommendation for the goal
          const recommendation = goalsRecommendations[goal][goalStatus];

          // Update recommendation if it's not null
          if (recommendation) {
            updateRecommendation(recommendation);
            console.log(
              `Increased recommendation for ${recommendation} based on your goals.`
            );
          } else {
            console.log(
              `No specific recommendation for goal ${goal} with status ${goalStatus}.`
            );
          }
        }
      }
    } else {
      console.log("User's genetic data or goals not found.");
    }
  } catch (error) {
    console.error("Error recommending supplements:", error);
  }
}
