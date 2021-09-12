const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const db = mongoose.connection;
const methodOverride = require('method-override')
const Campground = require('./models/campgrounds');  
const ejsMate = require('ejs-mate');  // Ejs mate is used for more functionality of ejs partials

// Ejs mate is used for more functionality of ejs partials

const app = express();

app.engine('ejs', ejsMate);   //use ejs mate instead of ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb://localhost:27017/yelp-camp');
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log('Database Connected');
});


app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
});

app.get('/campgrounds/new', async(req,res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async(req,res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id }`);
})

app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
});



app.get('/campgrounds/:id/edit', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
})

app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true, runValidators: true})
    res.redirect(`/campgrounds/${campground._id }`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect(`/campgrounds`)
})

app.listen('8080', () => {
    console.log('Listening to the port 8080');
});