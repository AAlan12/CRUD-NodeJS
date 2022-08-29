const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const PORT = process.env.PORT || 3000;

//config hbs
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.get('/', (req,res) => {
    res.render('index',{NavActiveCad:true});
})
app.get('/users', (req,res) => {
    res.render('users',{NavActiveUsers:true});
})
app.get('/edit', (req,res) => {
    res.render('edit');
})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})