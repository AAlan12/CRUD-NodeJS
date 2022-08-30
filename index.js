const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const session = require('express-session');
const PORT = process.env.PORT || 3000;

//config hbs
app.engine('hbs', hbs.engine({
    extname: 'hbs',
    defaultLayout: 'main'
}));
app.set('view engine', 'hbs');

app.use(express.urlencoded({extended: false}));

//import users model
const User = require('./models/User');

//cong session
app.use(session({
    secret: 'secret7',
    resave: false,
    saveUninitialized: true
}))

app.get('/', (req,res) => {
    if(req.session.errors){
        let arrayErrors = req.session.errors;
        req.session.errors = "";
        return res.render('index',{NavActiveCad:true, error:arrayErrors})
    }

    if(req.session.success){   
        req.session.success = false;    
        return res.render('index',{NavActiveCad:true, MsgSuccess:true})
    }

    res.render('index',{NavActiveCad:true});
})
app.get('/users', (req,res) => {
    res.render('users',{NavActiveUsers:true});
})
app.get('/edit', (req,res) => {
    res.render('edit');
})
app.post('/reg', (req,res) => {
    let name = req.body.name;
    let email = req.body.email;

    const mistakes = [];

    name = name.trim();
    email = email.trim();

    name = name.replace(/[^A-zÀ-ú\s]/gi,'');
    name = name.trim();

    if(name == '' || typeof name == undefined || name == null){
        mistakes.push({message: "Field cannot be empty"});
    }

    if(!/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]+$/.test(name)){
        mistakes.push({message: "Invalid name"});
    }

    if(email == '' || typeof email == undefined || email == null){
        mistakes.push({message: "Field cannot be empty"});
    }

    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        mistakes.push({message: "Invalid email"});
    }

    if(mistakes.length > 0){
        console.log(mistakes);
        req.session.errors = mistakes;
        req.session.success = false;
        return res.redirect('/');
    }
    console.log('Validation performed successfully');
    req.session.success = true;
    return res.redirect('/');

})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})