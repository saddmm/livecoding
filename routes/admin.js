const express = require('express')
const Admin = require('../models/admin')
const Tool = require('../models/tool')
const {authAdmin, noAuthAdmin} = require('../middleware/auth')
const upload = require('../configs/multer')
const Rental = require('../models/peminjaman')
const fs = require('fs')

const router = express.Router()

// Menampilkan Lab / Alat
router.get('/', authAdmin, async (req,res) => {
	const tools = await Tool.find()
    res.render('admin/alat-barang', {title : 'Alat & Laboratorium', tools})
})

router.get('/alat', authAdmin, async (req, res) => {
    const tools = await Tool.find({tag: 'Alat'})
    res.render('admin/alat-barang', {title: 'Alat', tools})
})

router.get('/laboratorium', authAdmin, async (req, res) => {
    const tools = await Tool.find({tag: 'Laboratorium'})
    res.render('admin/alat-barang', {title: 'Laboratorium', tools})
})

// Tambah Lab / Alat
router.post('/alat-lab', upload.single('image'), async(req, res) => {
	try{
		const {path, filename} = req.file
		
		let images = {}
		images.url = path
		images.filename = filename
	
		const tool = new Tool(req.body.tool)
		tool.image = images
	
		await tool.save()
		req.flash('success_msg', 'Berhasil Ditambahkan')
		res.redirect('/admin')
	}catch{
		req.flash('error_msg', 'Gagal Upload')
		res.redirect('/admin')
	}
})

// Update Lab / Alat
router.put('/:id/update', upload.single('image'), async (req, res) => {
	try{
		const { id } = req.params
		const tool = await Tool.findByIdAndUpdate(id, {...req.body.tool})
		
		if (req.file){
	
			fs.unlinkSync(tool.image.url)
	
			let images = {}
			images.url = req.file.path
			images.filename = req.file.filename
	
			tool.image = images
		}
		
		if (!req.body.tool.available){
			tool.available = false
		}
	
		await tool.save()
	
		req.flash('success_msg', 'Update Sukses')
		res.redirect('/admin')
	}catch{
		req.flash('error_msg', 'Ada Kesalahan')
		res.status(302).redirect('/admin')
	}
})

// Delete Lab / Alat
router.delete('/:id/delete', async(req, res) => {
	try{
		const {id} = req.params
		const tool = await Tool.findById(id)
	
		if (tool.image) {
			fs.unlinkSync(tool.image.url)
		}
	
		await Tool.findByIdAndDelete(id)
		req.flash('success_msg', 'Berhasil Dihapus!')
		res.redirect('/admin')
	}catch{
		req.flash('error_msg', 'Gagal Hapus!!')
		res.redirect('/admin')
	}
})

router.get('/peminjaman', authAdmin, async (req, res) => {
	const rentals = await Rental.find({status: 'Pinjam'}).sort({waktuPinjam: 'desc'}).populate('user').populate('tool')
    res.render('admin/peminjaman', {title : 'Peminjaman', rentals})
})

router.delete('/peminjaman/:id/delete', async(req, res) => {
	const {id} = req.params
	await Rental.findByIdAndDelete(id)
	req.flash('success_msg', 'Berhasil Dihapus')
	res.redirect('/admin/peminjaman')
})

router.get('/riwayat', authAdmin, async(req, res) => {
	const riwayats = await Rental.find().sort({waktuKembali: 'desc'}).populate('user').populate('tool')
	res.render('admin/riwayat', {title: 'Riwayat', riwayats})
})

router.delete('/riwayat/:id/delete', async(req, res) => {
	const {id} = req.params
	await Rental.findByIdAndDelete(id)
	req.flash('success_msg', 'Berhasil Dihapus')
	res.redirect('/admin/riwayat')
})

router.get('/login', noAuthAdmin, (req, res) => {
    res.render('admin/login', {title: 'Login Admin'})
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
	try{
		const admin = await Admin.findByCredentials(username, password)
		req.session.admin_id = admin._id
		res.redirect('/admin')
	}catch{
		req.flash('error_msg', 'Username Dan Password Salah')
		res.redirect('/admin/login')
	}

})


router.post('/logout', (req, res) => {
	req.session.admin_id = null
	req.flash('success_msg', 'Anda Logout')
	res.redirect('/admin/login')
})

router.get('/akunadmin', async (req, res) => {
	try{
		const admin = new Admin({
			username: 'aslab1',
			password: 12345
		})
	
		await admin.save()
		res.send('Berhasil')
	} catch(err){
		res.send(err)
	}
})

module.exports = router