const Category = require ("../models/Category")

exports.getCategories = async(req,res)=>{
    try {
        const categories = await Category.find({ book: req.params.bookId })
        res.status(200).json({
            success: true,
            status: 200,
            data: categories
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.createCategory = async(req,res)=>{
    try {
        const newCategory = new Category({
            name: req.body.name,
            user: req.user.id,
            book: req.params.bookId
        })

        const category = await newCategory.save()

        res.status(200).json({
            success: true,
            status: 200,
            data: category,
            message: 'Category created.'
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.updateCategory = async(req,res)=>{
    try {
        const category = await Category.findByIdAndUpdate(req.params.bookId, {
            $set: {
                name : req.body.name,
            }
        },
            { new: true }
        )

        return res.status(200).json({
            success: true,
            status: 200,
            data: category,
            message: 'Category updated.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}

exports.deleteCategory = async(req,res)=>{
    try {
        await Category.findByIdAndDelete(req.params.bookId)
        return res.status(200).json({
            success: true,
            status: 200,
            data: {},
            message : 'Category deleted.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            status: 500,
            message: error.message
        })
    }
}