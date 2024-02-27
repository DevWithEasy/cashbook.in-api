const { createBusiness, getBusiness, updateBusiness, deleteBusiness, getInfo, memberConfirm, memberRoleChange, memberRemove, memberOwnerChange, memberVerify } = require('../controllers/businessControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/',authenticated,createBusiness)
.get('/:id',authenticated,)
.get('/',authenticated,getBusiness)
.put('/:id',authenticated,updateBusiness)
.delete('/:id',authenticated,deleteBusiness)
.get('/info/:id',authenticated,getInfo)
.post('/member-confirm',authenticated,memberConfirm)
.post('/member-owner-change',authenticated,memberOwnerChange)
.post('/member-remove',authenticated,memberRemove)
.post('/member-role-change',authenticated,memberRoleChange)
.post('/member-verify',authenticated,memberVerify)


module.exports = router