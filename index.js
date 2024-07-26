const express = require('express')
const path = require('path')
const engine = require('ejs-mate')
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const User = require('./models/user')
const moment = require('moment')
const { noAuthUser } = require('./middleware/auth')
const { title } = require('process')


const app = express()

// Koneksi database
mongoose.connect('mongodb://127.0.0.1/peminjaman')
	.then((result) => {
		console.log('connected to mongodb')
	}).catch((err) => {
		console.log(err)
	});

app.engine('ejs', engine)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '/views'))


// Middleware
app.use(express.static(path.join(__dirname, '/public')))
app.use(express.urlencoded({ extended: true}))
app.use(methodOverride('_method'))
app.use(session({
	secret: 'secret-key',
	resave: false,
	saveUninitialized: false,
}))
app.use(flash())
app.use((req, res, next) => {
	res.locals.success_msg = req.flash('success_msg')
	res.locals.error_msg = req.flash('error_msg')
	res.locals.error = req.flash('error')
	next()
})

app.locals.moment = moment

// Routes

app.use('/', require('./routes/user'))
app.use('/admin', require('./routes/admin'))


app.get('/login', noAuthUser , (req, res) => {
    res.render('auth/login', {title: 'Login'})
})

app.post('/login', async (req, res) => {
	const { nim, password } = req.body
	try{
		const user = await User.findByCredentials(nim, password)
		req.session.user_id = user._id
		res.redirect('/')
	}catch{
		req.flash('error_msg', 'Username Dan Password Salah')
		res.redirect('/login')
	}
})


app.get('/register', noAuthUser , (req, res) => {
    res.render('auth/register', {title: 'Register'})
})


app.post('/register', async (req, res) => {
	try{
		const password = req.body.user.password
		const password1 = req.body.password
		const existingUser = await User.findOne({ nim : req.body.user.nim })
		if (existingUser){
			req.flash('error_msg', 'NIM Sudah Terdaftar')
			res.redirect('/register')
		}else if (password !== password1){
			req.flash('error_msg', 'Password Tidak Sama')
			res.redirect('/register')
		}else{
			const user = new User(req.body.user)
			await user.save()
			req.flash('success_msg', 'Registrasi Berhasil')
			res.redirect('/login')
		}
	}catch (err){
		req.flash('error_msg', 'Ada Kesalahan')
		res.redirect('/register')
	}
})

app.post('/logout', (req, res) => {
	req.session.user_id = null
	req.flash('success_msg', 'Anda Logout')
	res.redirect('/login')
})

// app.get('/akunadmin', async (req, res) => {
// 	const admin = await Admin({
// 		username: 'aslab',
// 		password: '123456'
// 	})
// 	await admin.save()
// 	console.log('Berhasil')
// })

app.all('*', (req, res, next) => {
	next( res.send('Page Not Found 404'))
})

app.listen('3000', (req, res) => {
    console.log('Listen in http://127.0.0.1:3000')
})