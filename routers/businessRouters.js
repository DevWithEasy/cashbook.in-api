const { createBusiness, getBusiness, updateBusiness, deleteBusiness, getInfo, memberConfirm, memberRoleChange, memberRemove, memberOwnerChange, memberVerify } = require('../controllers/businessControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/',authenticated,createBusiness)
.get('/:id',authenticated,)
.get('/',authenticated,getBusiness)
.put('/:id',authenticated,updateBusiness)
.delete('/:id',authenticated,deleteBusiness)
.get('/info',authenticated,getInfo)
.put('/member-confirm',authenticated,memberConfirm)
.put('/member-owner-change',authenticated,memberOwnerChange)
.put('/member-remove',authenticated,memberRemove)
.put('/member-role-change',authenticated,memberRoleChange)
.put('/member-verify',authenticated,memberVerify)


module.exports = router