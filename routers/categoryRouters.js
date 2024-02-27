const { createCategory, getCategories, updateCategory, deleteCategory } = require('../controllers/categoryControllers')

const router = require('express').Router()

router.post('/:bookId',createCategory)
.get('/:bookId',getCategories)
.put('/:id',updateCategory)
.delete('/:id',deleteCategory)


module.exports = router