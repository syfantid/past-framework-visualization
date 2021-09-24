import { PeriodicTable } from './app.model';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';


export function combineSubset(template, freqs, efcs, userWeight) {
  for (const idx in template) {
    if (! template.hasOwnProperty(idx)) {
      continue;
    }
    template[idx].efficacy = efcs[template[idx].technique];
    template[idx].frequency = freqs[template[idx].technique];
  }

  let data = [];

  // Calculate weighted scores.
  for (const idx in template) {
    if (! template.hasOwnProperty(idx)) {
      continue;
    }
    const row = template[idx];
    data[idx] = template[idx];
    data[idx].weightedScore = calculateWeightedSum(
      row.efficacy, row.frequency, userWeight
    );
  }

  // Normalize weighted scores to determinate the score.
  data = normalizeScores(data);

  // Group by category.
  const categoryData: any = {'Primary Task Support': [], Dialogue: [], 'Social Support': [], 'System Credibility': [], Other: []};
  for (const row of data) {
    if (! categoryData.hasOwnProperty(row.category)) {
      categoryData[row.category] = [];
    }
    categoryData[row.category].push(row);
  }

  // Sort categories.
  for (const cat in categoryData) {
    categoryData[cat] = categoryData[cat].sort((a, b) => {return a.finalScore > b.finalScore ? -1 : a.finalScore < b.finalScore ? 1 : 0});
  }



  // Create table.
  const table = new PeriodicTable();
  for (const cat in categoryData) {
    const categoryColumn = table.addColumn(cat);
    for (const row of categoryData[cat]) {
      categoryColumn.add(row.slug, row.name, row.finalScore);
    }
  }

  return table;
}


/**
 * Filter subset
 * @param input
 * @param cohort
 * @param minSample
 * @param minDuration
 */
export function filterSubset(input: any, cohort: string[], minSample: number, minDuration: number): any {
  const output = [];
  for (const idx in input) {
    if (! input.hasOwnProperty(idx)) {
      continue;
    }

    if (minSample !== null && minSample > 0) {
      if (input[idx].sample_size < minSample) {
        continue;
      }
    }

    if (minDuration !== null && minDuration > 0) {
      if (input[idx].duration < minDuration) {
        continue;
      }
    }

    if (cohort.length > 0) {
      const intersection = cohort.filter(value => input[idx].cohort.includes(value));
      if (intersection.length === 0) {
        continue;
      }
    }

    output.push(input[idx]);
  }

  return output;
}


export function calculateFrequency(input: any): any {
  const techCounts: {} = {};

  for (const idx in input) {
    if (! input.hasOwnProperty(idx)) {
      continue;
    }
    for (const catNr of input[idx].techniques) {
      if (! techCounts.hasOwnProperty(catNr)) {
        techCounts[catNr] = 0;
      }
      techCounts[catNr]++;
    }
  }

  for (const idx in techCounts) {
    if (! techCounts.hasOwnProperty(idx)) {
      continue;
    }
    techCounts[idx] = techCounts[idx] / input.length;
  }

  return techCounts;
}


export function calculateEfficacy(input: any): any {
  const techCounts: {} = {};
  const techSum: {} = {};

  for (const idx in input) {
    if (! input.hasOwnProperty(idx)) {
      continue;
    }
    for (const catNr of input[idx].techniques) {
      if (! techCounts.hasOwnProperty(catNr)) {
        techCounts[catNr] = 0;
      }
      if (! techSum.hasOwnProperty(catNr)) {
        techSum[catNr] = 0;
      }
      techSum[catNr] += parseFloat(input[idx].techniques_weighted_result);
      techCounts[catNr]++;
    }
  }

  for (const idx in techCounts) {
    if (! techCounts.hasOwnProperty(idx)) {
      continue;
    }
    techSum[idx] = techSum[idx] / techCounts[idx];
  }

  return techSum;
}


/**
 * Calculate weighted sum.
 *
 * @param efficacy
 * @param frequency
 * @param weight
 */
function calculateWeightedSum(efficacy: number, frequency: number, weight: number): number {
  const weight1 = weight;
  const weight2 = 1 - weight;
  return weight1 * efficacy + weight2 * frequency;
}

/**
 * Normalize Value.
 *
 * @param val
 * @param max
 * @param min
 */
function normalizeValue(val: number, max: number, min: number): number {
  return (val - min) / (max - min);
}

/**
 * Normalize scores
 *
 * @param data
 */
function normalizeScores(data: any): any {
  // Determinate the min and max of the table.
  let min = 1;
  let max = 0;
  for (const row of data) {
    if (row.weightedScore > max) {
      max = row.weightedScore;
    }
    if (row.weightedScore < min) {
      min = row.weightedScore;
    }
  }

  // Normalize for every item in the data.
  for (const row of data) {
    row.normalizedScore = normalizeValue(row.weightedScore, max, min);
    if (row.normalizedScore >= 0.8) {
      row.finalScore = 5;
    } else if (row.normalizedScore >= 0.6) {
      row.finalScore = 4;
    } else if (row.normalizedScore >= 0.4) {
      row.finalScore = 3;
    } else if (row.normalizedScore >= 0.2) {
      row.finalScore = 2;
    } else {
      row.finalScore = 1;
    }
  }

  return data;
}

/**
 * Processing CSV file.
 *
 * @param rawData
 * @param userWeight
 */
function processCsv(rawData: string, userWeight: number): PeriodicTable {
  const parsed = Papa.parse(rawData, {header: true});
  if (!parsed.data) {
    return null;
  }

  let data = [];

  // Calculate weighted scores.
  for (const idx in parsed.data) {
    if (! parsed.data.hasOwnProperty(idx)) {
      continue;
    }
    const row = parsed.data[idx];
    if (! row.hasOwnProperty('efficacy')) {
      continue;
    }
    data[idx] = parsed.data[idx];
    data[idx].weightedScore = calculateWeightedSum(
      Number.parseFloat(row.efficacy), Number.parseFloat(row.frequency), userWeight
    );
  }

  // Normalize weighted scores to determinate the score.
  data = normalizeScores(data);

  // Group by category.
  const categoryData: any = {'Primary Task Support': [], Dialogue: [], 'Social Support': [], 'System Credibility': [], Other: []};
  for (const row of data) {
    if (! categoryData.hasOwnProperty(row.category)) {
      categoryData[row.category] = [];
    }
    categoryData[row.category].push(row);
  }

  // Sort categories.
  for (const cat in categoryData) {
    categoryData[cat] = categoryData[cat].sort((a, b) => {return a.finalScore > b.finalScore ? -1 : a.finalScore < b.finalScore ? 1 : 0});
  }



  // Create table.
  const table = new PeriodicTable();
  for (const cat in categoryData) {
    const categoryColumn = table.addColumn(cat);
    for (const row of categoryData[cat]) {
      categoryColumn.add(row.slug, row.name, row.finalScore);
    }
  }

  return table;
}

/**
 * Processing CSV file.
 *
 * @param rawData
 * @param userWeight
 */
function processInputCsv(rawData: string, userWeight: number): PeriodicTable {
  const parsed = Papa.parse(rawData, {header: true});
  if (!parsed.data) {
    return null;
  }

  let data = [];

  // Calculate weighted scores.
  for (const idx in parsed.data) {
    if (! parsed.data.hasOwnProperty(idx)) {
      continue;
    }
    const row = parsed.data[idx];
    if (! row.hasOwnProperty('efficacy')) {
      continue;
    }
    data[idx] = parsed.data[idx];
    data[idx].weightedScore = calculateWeightedSum(
      Number.parseFloat(row.efficacy), Number.parseFloat(row.frequency), userWeight
    );
  }

  // Normalize weighted scores to determinate the score.
  data = normalizeScores(data);

  // Group by category.
  const categoryData: any = {'Primary Task Support': [], Dialogue: [], 'Social Support': [], 'System Credibility': [], Other: []};
  for (const row of data) {
    if (! categoryData.hasOwnProperty(row.category)) {
      categoryData[row.category] = [];
    }
    categoryData[row.category].push(row);
  }

  // Sort categories.
  for (const cat in categoryData) {
    categoryData[cat] = categoryData[cat].sort((a, b) => {return a.finalScore > b.finalScore ? -1 : a.finalScore < b.finalScore ? 1 : 0});
  }



  // Create table.
  const table = new PeriodicTable();
  for (const cat in categoryData) {
    const categoryColumn = table.addColumn(cat);
    for (const row of categoryData[cat]) {
      categoryColumn.add(row.slug, row.name, row.finalScore);
    }
  }

  return table;
}

/**
 * Processing Simple CSV file.
 *
 * @param rawData
 */
function processSimpleCsv(rawData: string): any {
  const parsed = Papa.parse(rawData, {header: true});
  if (!parsed.data) {
    return null;
  }
  delete parsed.data[parsed.data.length - 1];
  const data = parsed.data;

  for (const idx in data) {
    if (! data.hasOwnProperty(idx)) {
      continue;
    }
    const row = data[idx];
    if (row.hasOwnProperty('cohort')) {
      if (row.cohort) {
        row.cohort = row.cohort.split('|');
      } else {
        row.cohort = [];
      }
    }
    if (row.hasOwnProperty('techniques')) {
      if (row.techniques) {
        row.techniques = row.techniques.split('|');
      } else {
        row.techniques = [];
      }
    }
  }

  return parsed.data;
}


// Load the calculations input file.
export async function loadInputFile(http: HttpClient): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get('assets/calculations_input.csv', {responseType: 'text'})
      .subscribe(
        data => {
          return resolve(processSimpleCsv(data));
        },
        error => {
          return resolve(null);
        }
      );
  });
}


// Load the mapping input file.
export async function loadMappingFile(http: HttpClient): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get('assets/mappings_technique_names.csv', {responseType: 'text'})
      .subscribe(
        data => {
          return resolve(processSimpleCsv(data));
        },
        error => {
          return resolve(null);
        }
      );
  });
}
