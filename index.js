const express= require('express');
const fs= require('fs');
const path= require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/send', (req, res) => {
    const message= req.body.message;
    fs.appendFileSync('message.txt' , message + '\n')
    res.send('Message saved successfully!');
});

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})