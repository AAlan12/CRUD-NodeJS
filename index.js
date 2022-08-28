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
    res.render('index');
})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})