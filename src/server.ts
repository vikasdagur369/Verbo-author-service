import express from "express";
const app = express()
import dotenv from 'dotenv'
import { sql } from "./utils/db.js";
import blogRoutes from './routes/blog.js'
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

const port = process.env.PORT

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.Cloud_Api_Key,
    api_secret: process.env.Cloud_Api_Secret
});

async function initDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS blogs(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        blogcontent TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `
        await sql`
        CREATE TABLE IF NOT EXISTS comment(
        id SERIAL PRIMARY KEY,
        comment VARCHAR(255) NOT NULL,
        userid VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        blogid VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `
        await sql`
        CREATE TABLE IF NOT EXISTS savedblogs(
        id SERIAL PRIMARY KEY,
        userid VARCHAR(255) NOT NULL,
        blogid TEXT NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        console.log("databse initialized successfully!")

    } catch (error) {
        console.log("Error initDb:", error)
    }
}

app.use('/api/v1', blogRoutes)

await initDB()

app.listen(port, () => console.log(`server is running on http://localhost:${port}`))