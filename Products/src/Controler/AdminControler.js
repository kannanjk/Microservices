const productModel = require("../Model/ProductModel.js")


const AddProduct = async (req, res) => {
    try {
        const product = new productModel(req.body)
        const a = await product.save()
        res.render('admin/add-products', { admin: true })
        let image = req.files.image
        image.mv('./public/product-image/' + a._id + '.jpg', (err) => {
            if (!err) {
                return 
            } else {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const GetAllProducts = async (req, res) => {
    const products = await productModel.find().lean().exec()
    res.render('admin/view-products', { products, admin: true })
}

const deleteProduct = async (req, res) => {
    const { id } = req.params
    productModel.findByIdAndDelete(id)
    res.redirect('/admi/getAllProducts')
}

const getSingleProduct = async (req, res) => {
    const { id } = req.params
    const product = await productModel.findById(id).lean().exec()
    res.render('admin/edit-products', { product, admin: true })
}

const UpdateProduct = async (req, res) => {
    const { id } = req.params
    const product = await productModel.findByIdAndUpdate(id, req.body, {
        new: true,
    })
    res.redirect('/admi/getAllProducts')
}


module.exports = {
    AddProduct, GetAllProducts, deleteProduct, getSingleProduct, UpdateProduct,
  
}