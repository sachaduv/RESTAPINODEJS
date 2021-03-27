const Product = require('../models/product');
const mongoose = require('mongoose');


exports.products_get_all_products = (req,res,next)=>{
    Product.find().exec().then((result)=>{
        console.log(result);
        res.status(200).json({

            count:result.length,
            products:result.map((doc)=>{
                return {
                    type:'GET',
                    name : doc.name,
                    price: doc.price,
                    productImage:doc.productImage,
                    url:'http://localhost:3000/products/'+doc._id
                }
            })
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
    
}

exports.products_get_product_byid = (req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage').exec().then((result)=>{
        console.log(result);
        if(result){
            res.status(200).json({
                product:result,
                request : {
                    type:'GET',
                    url:'http://localhost:3000/products '
                }
             })
        }else{
            res.status(404).json({
                error : 'Entry not found'
            })
        }
        
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:{
                message:err
            }
        })
    })
}

exports.products_create_product = (req,res,next)=>{
    console.log(req.file);
    const product = new Product({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        price:req.body.price,
        productImage:req.file.path
    })
    product.save().then((result)=>{
        console.log(result);
        res.status(201).json({
            message:'successfully created the post request',
            product:{
                id : result._id,
                name : result.name,
                price : result.price,
                productImage : result.productImage,
                request  :{
                    type : 'GET',
                    url : 'http://localhost:3000/products/'+result._id
                }              
            }
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
}

exports.products_update_product = (req,res,next)=>{
    const id = req.params.productId;
    const updateOpts = {
    }
    for(const ops of req.body){
        updateOpts[ops.propName] = ops.value
    }
    Product.updateOne({_id:id},{$set:updateOpts}).exec().then((result)=>{
        res.status(200).json({
            message : 'product updated successfully',
            request : {
                type:'GET',
                url : 'http://localhost:3000/products/'+id
            }
        })
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
    
}

exports.products_delete_product = (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id:id}).exec().then((result)=>{
        console.log(result);
        res.status(200).json({
            message : 'Product deleted',
            request : {
                type : 'POST',
                url:'http://localhost:3000/products/',
                data:{
                    name:"String",
                    price:"Number"
                }
            }
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
}