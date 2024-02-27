const { createBusiness, getBusiness, updateBusiness, deleteBusiness, getInfo, memberConfirm, memberRoleChange, memberRemove, memberOwnerChange, memberVerify } = require('../controllers/businessControllers')

const router = require('express').Router()

router.post('/',createBusiness)
.get('/:id',)
.get('/',getBusiness)
.put('/:id',updateBusiness)
.delete('/:id',deleteBusiness)
.get('/info',getInfo)
.put('/member-confirm',memberConfirm)
.put('/member-owner-change',memberOwnerChange)
.put('/member-remove',memberRemove)
.put('/member-role-change',memberRoleChange)
.put('/member-verify',memberVerify)


module.exports = router