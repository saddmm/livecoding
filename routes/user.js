const express = require('express')
const {authUser} = require('../middleware/auth')
const User = require('../models/user')
const Tool = require('../models/tool')
const Rental = require('../models/peminjaman')

const router = express.Router()



router.get('/', authUser, async (req, res) => {
    const user = await User.findById(req.session.user_id)
    const tools = await Tool.find().sort({available: 'desc'})
    res.render('user/alat-lab', {title:'Alat & Laboratorium', tools, user})
})

router.get('/alat', authUser, async (req, res) => {
    const user = await User.findById(req.session.user_id)
    const tools = await Tool.find({tag: 'Alat'}).sort({available: 'desc'})
    res.render('user/alat-lab', {title:'Alat', tools, user})
})

router.get('/laboratorium', authUser, async (req, res) => {
    const user = await User.findById(req.session.user_id)
    const tools = await Tool.find({tag: 'Laboratorium'}).sort({available: 'desc'})
    res.render('user/alat-lab', {title:'Laboratorium', tools, user})
})

router.get('/aktifitas', authUser, async (req, res) => {
    const user = await User.findById(req.session.user_id)
    const pinjams = await Rental.find({user: req.session.user_id, status: 'Pinjam'}).sort({waktuPinjam: 'desc'}).populate('tool').populate('user')
    const riwayats = await Rental.find({user: req.session.user_id, status: 'Kembali'}).sort({waktuKembali: 'desc'}).populate('tool').populate('user')

    res.render('user/aktifitas', {title:'Aktifitas', user, pinjams, riwayats})
})

router.post('/pinjam', async (req, res) => {
    try{
        const {tanggal, waktu} = req.body
        const pinjam = new Rental(req.body.rental)
    
        const date = new Date(`${tanggal}T${waktu}`).toLocaleString()
        pinjam.waktuPinjam = date
        
        await pinjam.save()
        req.flash('success_msg', 'Berhasil Pinjam')
        res.redirect('/')
    } catch{
        req.flash('error_msg', 'Ada Kesalahan')
        res.redirect('/')
    }
})

router.put('/kembali/:id', async (req, res) => {
    try{
        const {id} = req.params
        const {tanggal, waktu, kerusakan} = req.body
        const pinjam = await Rental.findByIdAndUpdate(id, {...kerusakan})
        
        const date = new Date(`${tanggal}T${waktu}`).toLocaleString()
        pinjam.waktuKembali = date
        pinjam.status = 'Kembali'
    
        await pinjam.save()
        req.flash('succes_msg', 'Berhasil Di Kembalikan')
        res.redirect('/aktifitas')
    } catch {
        req.flash('error_msg', 'Ada Kesalahan')
        res.redirect('/aktifitas')
    }
})

module.exports = router