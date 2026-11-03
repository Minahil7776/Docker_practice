
const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const Mongo_URL = "mongodb://admin:qwerty@mongodb:27017/mydatabase?authSource=admin"
const client = new MongoClient(Mongo_URL);

const PORT = 5050;

const dbName = "mydatabase";

app.get("/getUsers", async (req, res) => {
    try {
        const db = client.db(dbName);
        const users = await db.collection("users").find({}).toArray();

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to get users" });
    }
});

app.post("/addUser", async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required"
            });
        }

        const db = client.db(dbName);

        const result = await db.collection("users").insertOne({
            name,
            email
        });

        res.status(201).json({
            message: "User added successfully",
            userId: result.insertedId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to add user" });
    }
});

async function startServer() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    }
}

startServer();
