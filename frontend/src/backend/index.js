const express = require('express');
const path = require('path');
const { ParquetReader } = require('parquetjs-lite'); // or 'parquetjs'
const fs = require('fs');

const app = express();
const PORT = 5000;

async function readParquetFile(filePath) {
  try {
    // Use ParquetReader.openFile to open the file directly
    const reader = await ParquetReader.openFile(filePath);
    const cursor = reader.getCursor();
    let record = null;
    const data = [];

    // Read records one by one
    while (record = await cursor.next()) {
      data.push(record);
    }

    await reader.close();  // Close the reader when done
    return data;
  } catch (err) {
    console.error("Error reading parquet file:", err);
    throw err;
  }
}

// Express route for API
app.get('/api/stock-data', async (req, res) => {
  const filePath = path.join(__dirname, '../data/AATM.parquet');
  try {
    const data = await readParquetFile(filePath);
    res.json(data);
  } catch (err) {
    res.status(500).send('Error reading Parquet file');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
