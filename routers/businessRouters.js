const { demo } = require('../controllers/demoControllers')

const router = require('express').Router()

router.post('/',demo)
.get('/:id',demo)
.get('/',demo)
.put('/:id',demo)
.delete('/:id',demo)
.get('/info',demo)
.put('/member-confirm',demo)
.put('/member-owner-change',demo)
.put('/member-remove',demo)
.put('/member-role-change',demo)
.put('/member-verify',demo)


module.exports = router