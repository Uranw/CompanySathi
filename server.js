const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (use your MongoDB connection string from .env)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define the Contact schema
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    message: String
});

// Create a model for Contact
const Contact = mongoose.model('Contact', contactSchema);

// Route to handle form submission
app.post('/submit', async (req, res) => {
    const { name, email, phone, message } = req.body;

    const newContact = new Contact({ name, email, phone, message });

    try {
        await newContact.save();
        res.status(201).json({ message: 'Form submitted successfully' });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ message: 'Error submitting form', error });
    }
});

// Route to fetch all contacts (for admin panel)
app.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Error fetching contacts', error });
    }
});

// Route to delete a contact by ID
app.delete('/contacts/:id', async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Error deleting contact', error });
    }
});

// Route to update a contact by ID
app.put('/contacts/:id', async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ message: 'Contact not found' });
        }
        res.json(updatedContact);
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ message: 'Error updating contact', error });
    }
});

// Serve static files (like index.html and admin.html)
app.use(express.static(__dirname));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
