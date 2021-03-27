const Order = require('../models/order');
const Product = require('../models/product');
const mongoose = require('mongoose');


exports.orders_get_all_orders = (req,res,next)=>{
    Order.find().populate('productId','_id name price').exec().then((result)=>{
        res.status(200).json({
            count:result.length,
            orders:result.map((doc)=>
             {
               return {
                 _id: doc._id,
                 quantity : doc.quantity,
                 productId : doc.productId,
                 request : {
                     type:'GET',
                     url : 'http://localhost:3000/orders/'+doc._id
                 }
                }
            })
        })
    }).catch((err)=>{

    })
}

exports.orders_create_orders = (req,res,next)=>{
    Product.findById(req.body.productId).exec().then((id)=>{
        if(!id){
           return  res.status(404).json({
                message:'Product not found'
            })
        }
        const orders = new Order({
            _id : mongoose.Types.ObjectId(),
            productId : req.body.productId,
            quantity : req.body.quantity
        });
    
        return orders.save()
    })
    .then((result)=>{
        res.status(201).json({
            message : 'sucessfully created Orders',
            orders:{
                id : result._id,
                quantity : result.quantity,
                productId : result.productId
            },
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/'+result._id
            }
        })
    }).catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
}

exports.orders_get_order_byid = (req,res,next)=>{
    const id = req.params.orderId;
    Order.findById(id).select('quantity productId _id').populate('productId','name price').exec().then((result)=>{
        if(!result){
            return res.status(404).json({
                orders:'Orders Not Found'
            })
        }
        res.status(200).json({
            orders:result,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/'+result._id
            }
        })
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
}

exports.orders_delete_order = (req,res,next)=>{
    Order.remove({_id :req.params.orderId}).exec().then((result)=>{
        res.status(200).json({
        message:'Order deleted',
        request:{
            type:'POST',
            url:'http://localhost:3000/orders',
            body:{
                "quantity":"Number",
                "productId":"ObjectId"
            }
        }})
    }).catch((err)=>{
        res.status(500).json({
            error:err
        })
    })
}