
const express= require('express');
const connectDB= require('./config/db');
const path = require('path');

const app=express();

// calling connectDB

connectDB();

// initializing middle-ware
app.use(express.json({ extended: false }));

// DEFINING ROUTES
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

if(process.env.NODE_ENV==='production'){

    app.use(express.static('client/build'))
    app.get('*', (req, res)=>res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html')))
}

const PORT = process.env.PORT||5000;

app.listen(PORT, ()=>{
    console.log(`This App is running on port ${PORT}`)
})