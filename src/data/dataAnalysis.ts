// src/data/dataAnalysis.ts

// Define types for the data
export interface CropData {
    Year: number;
    Crop: string;
    Production: number;
    Area: number;
  }
  
  export interface YearlyAggregation {
    Year: number;
    maxCrop: string;
    minCrop: string;
  }
  
  export interface CropAggregation {
    Crop: string;
    avgYield: number;
    avgArea: number;
  }
  
  // Function to fetch JSON data
  export const fetchData = async (url: string): Promise<CropData[]> => {
    const response = await fetch(url);
    const data = await response.json();
    return data as CropData[];
  };
  
  // Function to aggregate data
  export const aggregateData = (data: CropData[]) => {
    const yearlyAggregation: YearlyAggregation[] = [];
    const cropAggregation: { [key: string]: CropAggregation } = {};
  
    const yearGroups = data.reduce((acc, curr) => {
      if (!acc[curr.Year]) {
        acc[curr.Year] = [];
      }
      acc[curr.Year].push(curr);
      return acc;
    }, {} as { [key: number]: CropData[] });
  
    for (const year in yearGroups) {
      const crops = yearGroups[year];
      let maxCrop = crops[0];
      let minCrop = crops[0];
      for (const crop of crops) {
        if (crop.Production > maxCrop.Production) {
          maxCrop = crop;
        }
        if (crop.Production < minCrop.Production) {
          minCrop = crop;
        }
        if (!cropAggregation[crop.Crop]) {
          cropAggregation[crop.Crop] = { Crop: crop.Crop, avgYield: 0, avgArea: 0 };
        }
        cropAggregation[crop.Crop].avgYield += crop.Production;
        cropAggregation[crop.Crop].avgArea += crop.Area;
      }
      yearlyAggregation.push({ Year: Number(year), maxCrop: maxCrop.Crop, minCrop: minCrop.Crop });
    }
  
    const cropAggregationArray: CropAggregation[] = [];
    for (const crop in cropAggregation) {
      cropAggregation[crop].avgYield /= 71; // Number of years from 1950 to 2020
      cropAggregation[crop].avgArea /= 71;
      cropAggregationArray.push({
        Crop: crop,
        avgYield: parseFloat(cropAggregation[crop].avgYield.toFixed(3)),
        avgArea: parseFloat(cropAggregation[crop].avgArea.toFixed(3)),
      });
    }
  
    return { yearlyAggregation, cropAggregationArray };
  };
  
  // Add this line to make it a module
  export {};
  