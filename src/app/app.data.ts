import { PeriodicTable } from './app.model';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

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

// Add data from CSV file.
export async function loadData(http: HttpClient, userWeight: number = 0.5): Promise<PeriodicTable> {
  return new Promise((resolve, reject) => {
    http.get('assets/past_output.csv', {responseType: 'text'})
      .subscribe(
        data => {
          return resolve(processCsv(data, userWeight));
        },
        error => {
          return resolve(null);
        }
      );
  });
}
