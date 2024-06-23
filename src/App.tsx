import React, { useEffect, useState } from 'react';
import { fetchData, aggregateData } from './data/dataAnalysis';
import { Table } from '@mantine/core';

const App: React.FC = () => {
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [cropData, setCropData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      const data = await fetchData('/agriculture_data.json');
      const { yearlyAggregation, cropAggregationArray } = aggregateData(data);
      setYearlyData(yearlyAggregation);
      setCropData(cropAggregationArray);
    };
    fetchDataAsync();
  }, []);

  return (
    <div>
      <h1>Agriculture Analytics</h1>
      <h2>Yearly Aggregation</h2>
      <Table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Crop with Maximum Production</th>
            <th>Crop with Minimum Production</th>
          </tr>
        </thead>
        <tbody>
          {yearlyData.map((row, index) => (
            <tr key={index}>
              <td>{row.Year}</td>
              <td>{row.maxCrop}</td>
              <td>{row.minCrop}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Crop Aggregation</h2>
      <Table>
        <thead>
          <tr>
            <th>Crop</th>
            <th>Average Yield (1950-2020)</th>
            <th>Average Cultivation Area (1950-2020)</th>
          </tr>
        </thead>
        <tbody>
          {cropData.map((row, index) => (
            <tr key={index}>
              <td>{row.Crop}</td>
              <td>{row.avgYield}</td>
              <td>{row.avgArea}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default App;
