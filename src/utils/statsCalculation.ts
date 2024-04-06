import { DataFrameJson } from "@/types/interfaces";

export function calculateStats(dataFrameJson: DataFrameJson) {
  const categoryStats: { [key: string]: { sum: number; avg: number; std: number; var: number } } = {};

  // Start from the third element in each row for numerical values
  dataFrameJson.columns.slice(3).forEach((category, categoryIndex) => {
    let sum = 0;
    let squaredSum = 0;
    let count = 0;

    dataFrameJson.data.forEach((row) => {
      const value = row[categoryIndex + 3] as number;
      sum += value;
      squaredSum += value * value;
      count++;
    });

    const avg = sum / count;
    const variance = squaredSum / count - avg * avg;
    const stdDev = Math.sqrt(variance);

    categoryStats[category] = {
      sum: sum,
      avg: avg,
      std: stdDev,
      var: variance,
    };
  });

  return categoryStats;
}
