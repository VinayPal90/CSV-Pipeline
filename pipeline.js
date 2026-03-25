import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const filePath = process.env.CSV_FILE_PATH;
const mongoURI = process.env.MONGO_URI;

if (!filePath || !mongoURI) {
    console.error("❌ Error: CSV_FILE_PATH or MONGO_URI missing in .env");
    process.exit(1);
}

// MongoDB Connection
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const User = mongoose.model('User', new mongoose.Schema({
    id: String,
    name: String,
    email: String,
    role: String
}));


const processCSV = async () => {
    let rowCount = 0;
    console.log("🚀 Starting Pipeline...\n");

    const stream = fs.createReadStream(filePath).pipe(csv());

    for await (const row of stream) {
        try {
            // Pehle Console mein Data dikhayega
            console.log(`Row: { id: '${row.id}', name: '${row.name}', email: '${row.email}', role: '${row.role}' }`);
            
            // Phir Database mein save karega
            await User.create(row);
            console.log(`💾 Saved to DB: ${row.name}\n`);
            
            rowCount++;
        } catch (err) {
            console.error(`❌ Failed to save: ${row.name}`, err.message);
        }
    }

    console.log(`-----------------------------------------`);
    console.log(`✅ Success: Pipeline Finished.`);
    console.log(`📊 Total ${rowCount} rows processed and saved to Atlas.`);
    console.log(`-----------------------------------------`);
    
    // Process khatam hone par connection close (Optional)
    // mongoose.connection.close();
};

processCSV();