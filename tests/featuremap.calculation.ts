import { test as calculation } from "@playwright/test";
import { calculateYamlCoverage } from "feature-map";

calculation("Feature Map", async () => {
  let runCalculationCoverage = process.env.CALCULATE_COVERAGE;
  if (runCalculationCoverage) {
    console.log("Calculating coverage");
    calculateYamlCoverage("./featureMap.yml");
  } else {
    console.log("Skipping coverage calculation");
  }
});
