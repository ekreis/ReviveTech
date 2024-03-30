// Alex Fiori's Genetic Data
const userGenetics = {
    gene1: { name: "SLC23A2", genotype: "GG" },
    gene2: { name: "ACE", genotype: "II" },
    gene3: { name: "ACTN3", genotype: "RR" },
    gene4: { name: "NOS3", genotype: "TT" },
  };
  
  // Defining which genotypes match up to recommendations
  const genesRecommendations = {
    SLC23A2: {
      AA: "Vitamin C",
      AG: "Vitamin C",
      GG: "Vitamin C",
    },
    ACE: {
      II: "Magnesium",
      ID: "Vitamin D",
      DD: "Vitamin D",
    },
    ACTN3: {
      RR: "Vitamin C",
      RX: "Magnesium",
      XX: "Magnesium",
    },
    NOS3: {
      TT: "Vitamin D",
      TG: "Vitamin C",
      GG: "Vitamin C", 
      G: "Vitamin C", 
    },
  };
  
  // Function to recommend supplements based on user's genetic data
  function recommendSupplements(userGenetics, genesRecommendations) {
    for (const key in userGenetics) {
      if (userGenetics.hasOwnProperty(key)) {
        const geneInfo = userGenetics[key];
        const geneName = geneInfo.name;
        const genotype = geneInfo.genotype;
        
        // Recommend Supplements based on Gene and Genotype Combination
        if (genesRecommendations[geneName] && genesRecommendations[geneName][genotype]) {
          const supplement = genesRecommendations[geneName][genotype];
          console.log(`Alex, You have the genotype ${geneName}, ${genotype}. We recommend taking ${supplement} supplement.`);
        } else {
          console.log(`No specific supplement recommended for the genotype ${geneName}, ${genotype}.`);
        }
      }
    }
  }
  
  // Call the function to recommend supplements based on user's genetic data
  recommendSupplements(userGenetics, genesRecommendations);
  
  
  