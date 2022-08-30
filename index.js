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
    User.findAll().then((values) => {
        if(values.length > 0){
            res.render('users',{NavActiveUsers:true, table: true, users: values.map(values => values.toJSON())});
        }else{
            res.render('users',{NavActiveUsers:true, table: false});
        }
    }).catch((err) => {
        console.log(`There is an error: ${err}`);
    })
    // 
})
app.post('/edit', (req,res) => {
    let id = req.body.id;
    User.findByPk(id).then((data) => {
        return res.render('edit', {error: false, id: data.id, name: data.name, email: data.email})
    }).catch((err) => {
        console.log(err);
        return res.render('edit', {error: true, problem:"can't change registry"});
    })
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

    User.create({
        name: name,
        email: email.toLowerCase()
    }).then(() => {
        console.log('Registered successfully');
        req.session.success = true;
        return res.redirect('/');
    }).catch((err) => {
        console.log(`There is an error ${err}`);
    })
    
})

app.post('/update', (req,res) => {

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
        return res.status(400).send({status: 400, error: mistakes});
    }
    User.update({
        name: name,
        email: email.toLowerCase()
    },{
        where: {
            id: req.body.id
        }
    }).then((result) => {
        console.log(result);
        return res.redirect('/users');
    }).catch((err) => {
        console.log(err);
    })
})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`);
})