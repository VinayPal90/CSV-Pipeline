import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';

// .env file load karna
dotenv.config();

const filePath = process.env.CSV_FILE_PATH;

if (!filePath) {
    console.error("Error: CSV_FILE_PATH not found in .env");
    process.exit(1);
}

const processCSV = () => {
    const results = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => {
            // Yahan processing logic (e.g., cleaning data)
            results.push(data);
            console.log('Row:', data);
        })
        .on('end', () => {
            console.log(`Successfully processed ${results.length} rows.`);
            // Yahan aap database save logic call kar sakte hain
        })
        .on('error', (err) => {
            console.error('Pipeline Error:', err.message);
        });
};

processCSV();