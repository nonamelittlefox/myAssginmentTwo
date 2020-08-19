const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const epxhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://aLazyFox:112113viet@assignmenttwo.hq8ya.mongodb.net/test";

// get routers from routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRouter = require('./routes/product');
const productDetailRouter = require('./routes/productDetail');
const productInsertRouter = require('./routes/insert');
const productUpdateRouter = require('./routes/update');
const loginRouter = require('./routes/login');


const app = express();
const PORT = 8888;

// view engine setup
app.engine('hbs', epxhbs({ defaultLayout: 'main_Layout', extname: '.hbs' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// connect database
connectDB();

// Insert Product
app.post('/doInsertProduct', async(req, res) => {
    let inputName = req.body.txtName;
    let inputPrice;
    if (inputPrice < 20) {
        res.send('Price must greater than 20.00$');
    } else {
        inputPrice = req.body.txtPrice;
    }
    let inputDescription = req.body.txtDescription;
    let inputImage = req.body.image;
    let inputGenre = req.body.txtGenre;
    let inputColor = req.body.txtColor;
    let newProduct = {
        name: inputName,
        price: inputPrice,
        description: inputDescription,
        genre: inputGenre,
        color: inputColor,
        image: inputImage,
        tab: inputName + ',' + inputPrice + ',' + inputDescription + ',' + inputGenre + ',' + inputColor + ',' + inputImage
    };

    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    await dbo.collection('Products').insertOne(newProduct);
    res.redirect('/productDetail');
    // res.end("OK!!!");
});

// Delete Product
app.get('/delete', async(req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongoDB').ObjectID;
    let client = await MongoClient.connect(url);
    console.log(id);
    let dbo = client.db('ProductDB');
    await dbo.collection("Products").deleteOne({ _id: ObjectID(id) });
    res.redirect('/productDetail');
});

// Search Product
app.get('/doSearch', async(req, res) => {
    let tab = req.query.name;
    console.log(tab);
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    let find = await dbo.collection("Products").find({
        tab: new RegExp(tab, 'i')
    }).toArray();
    console.log(find);
    res.render('product/productDetail', { model: find });
});

// Update Product 
app.get('/update', async(req, res) => {
    let id = req.query.id;
    var ObjectID = require('mongoDB').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    let product = await dbo.collection("Products").find({ _id: ObjectID(id.toString()) }).toArray();
    res.render('product/productUpdate', { model: product });
});

app.post('/doUpdateProduct', async(req, res) => {
    let id = req.body.txtID;
    let iName = req.body.txtName;
    let iPrice = req.body.txtPrice;
    let inputDescription = req.body.txtDescription;
    console.log(inputDescription);
    let inputImage = req.body.image;
    let inputGenre = req.body.txtGenre;
    let inputColor = req.body.txtColor;
    var ObjectID = require('mongodb').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db("ProductDB");
    //let product = await dbo.collection("Products").find({ _id: ObjectID(id.toString()) }).toArray();
    // console.log(product);
    // let result = await dbo.collection('Products').updateOne({ "_id": ObjectID(inputID.toString()) }, { $set: { Name: inputName.toString(), Price: inputPrice.toString() } });
    let result = await dbo.collection('Products').updateOne({ "_id": ObjectID(id) }, {
        $set: {
            name: iName,
            price: iPrice,
            description: inputDescription,
            image: inputImage,
            genre: inputGenre,
            color: inputColor
        }
    });
    res.redirect('productDetail');
});

// login 
app.post('/postLogin', async(req, res) => {
    let email = req.query.email;
    let password = req.query.password;
    var ObjectID = require('mongoDB').ObjectID;
    let client = await MongoClient.connect(url);
    let dbo = client.db('ProductDB');
    let account = await dbo.collection("ManagerAccount").find({ email: email, password: password }).toArray();

    if (!account) {
        res.render('authentication/login', {
            errors: [
                '<< Account Does Not Exist >>'
            ],
            values: req.body
        })
        return;
    }
    res.redirect('/');
});

// using routers
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter); // >>>
app.use('/productDetail', productDetailRouter);
app.use('/productInsert', productInsertRouter);
app.use('/productUpdate', productUpdateRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

app.listen(process.env.PORT || 3000, () => console.log(`<< Server running at:http://localhost:${PORT} >>`));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;