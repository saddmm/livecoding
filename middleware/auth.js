module.exports.authUser = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next()
}

module.exports.authAdmin = (req, res, next) => {
    if (!req.session.admin_id) {
        return res.redirect('/admin/login')
    }
    next()
}


module.exports.noAuthUser = (req, res, next) => {
	if(req.session.user_id){
		return res.redirect('/')
	}
	next()
}

module.exports.noAuthAdmin = (req, res, next) => {
	if(req.session.admin_id){
		return res.redirect('/admin')
	}
	next()
}