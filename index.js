// const express= require('express');
// const fs= require('fs');
// const path= require('path');
// const app = express();
// const port = 3000;

// app.use(express.urlencoded({extended: true}))
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });
// app.post('/send', (req, res) => {
//     const message= req.body.message;
//     fs.appendFileSync('message.txt' , message + '\n')
//     res.send('Message saved successfully!');
// });

// app.get('/messages', (req, res) => {
//     try {
//         const data = fs.readFileSync('message.txt', 'utf8');
//         res.send(`<pre>${data}</pre>`);
//     } catch (err) {
//         res.send('No messages found or error reading file.');
//     }
// });

// app.listen(port,()=>{
//     console.log(`Server is running on http://localhost:${port}`);
// })





const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const port = 3000;

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ Connection error:', err));

// Schema
const messageSchema = new mongoose.Schema({
  message: String,
  createdAt: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

app.use(express.urlencoded({ extended: true }));

// Home Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Save message to MongoDB
app.post('/send', async (req, res) => {
  const { message } = req.body;
  try {
    const newMessage = new Message({ message });
    await newMessage.save();
    res.send('✅ Message saved to MongoDB!');
  } catch (err) {
    res.send('❌ Error saving message.');
  }
});

// View messages from MongoDB
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    const formatted = messages.map(m => `• ${m.message}`).join('\n');
    res.send(`<pre>${formatted}</pre>`);
  } catch (err) {
    res.send('❌ Error fetching messages.');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
