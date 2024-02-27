const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryControllers')
const authenticated = require('../middleware/authenticated')

const router = require('express').Router()

router.post('/:bookId',authenticated,createCategory)
.get('/:bookId',authenticated,getCategories)
.put('/:id',authenticated,updateCategory)
.delete('/:id',authenticated,deleteCategory)


module.exports = router