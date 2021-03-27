const express = require('express');
const routes = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const ProductsController = require('../controllers/product');

const storage  = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./uploads/');
    },
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})

const fileFilter = (req,file,cb)=>{
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null,true);
  }
  else{
      cb(new Error('invalid file type'),false);
  }
}
const upload  = multer({storage:storage,limits: 
    {
     fileSize:1024 * 1024 * 5
    },
    fileFilter:fileFilter
});



routes.get('/',auth,ProductsController.products_get_all_products);

routes.get('/:productId',ProductsController.products_get_product_byid);

routes.post('/',upload.single('productImage'),ProductsController.products_create_product)

routes.patch('/:productId',ProductsController.products_update_product)

routes.delete('/:productId',ProductsController.products_delete_product)

module.exports = routes;