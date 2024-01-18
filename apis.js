import express from 'express'
import { hashPassword, comparePassword,generateItemUniqueItemId,generateProductUniqueItemId  } from './utils.js';
import db from "./db.js";
import { isAuthenticated, generateToken} from './authentication.js';
import { UUID, where } from 'sequelize';


const router = express.Router();


router.post('/login', async (request, response) => {
    try {
      const username = request.body.username;
      const plainPassword = request.body.password;
  
      const user = await db.users.findOne({ where: { username } });
  
      if (!user) {
        return response.status(400).json({ status: false, message: 'User not found or password incorrect' });
      }
  
      const isSamePassword = await comparePassword(plainPassword, user.password);
  
      if (!isSamePassword) {
        return response.status(400).json({ status: false, message: 'User not found or password incorrect' });
      }
  
      // If username and password are valid, generate a JWT token
      const token = await generateToken(user.id);

  
      // Send the token in the response
      return response.status(200).json({ status: true, message: 'User logged in successfully', token });
    } catch (error) {
      return response.status(500).json({ status: false, message: error.message });
    }
  });

  router.get('/logout', isAuthenticated, async (request, response) => {
    try {
        // client with remove token once status true returned 
        return response.status(200).json({"status":true,"message":" User Logout  Successfully"})
    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }
});

router.post('/signup', async (request, response) => {
    try {

        const username = request.body.username;
        const plainPassword = request.body.password;

        const user = await db.users.findOne({where: {username:username}})
        if (!user) {
            const hashedPassword = await hashPassword(plainPassword);
            const user_data = request.body
            user_data.password = hashedPassword
            console.log("HASH PASsOWRD ",hashedPassword)
            await db.users.create({ first_name: user_data.first_name,
                                    last_name: user_data.last_name,
                                    username:  user_data.username,
                                    role : user_data.role,
                                    password: hashedPassword});
    

            return response.status(201).json({ "status":true, "message": `User Successfully Created,Try Login` });

        } else {


            return response.status(400).json({"status":false, "message": `User with ${username} Already Exist` });

        }
    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }
});

router.get('/user/cart/items', isAuthenticated, async (request, response) => {
    try {
        const user = request.user
        const username = user.username
        const filteredData = await db.cart.findAll({ 'username': username });
        return response.status(200).json({"status":true, "data" : filteredData});
    }

    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }

});

router.post('/user/cart/items', isAuthenticated, async (request, response) => {
    try {
        const user = request.user
        const product_data = request.body
        const product = await db.products.findByPk(product_data.product_id)
        const quantity = parseInt(product_data.quantity)
        console.log("PRODUCT ",product.quantity)
        if (product) {
            if (product.quantity < quantity) {
                if (product.quantity == 0)
                return response.status(400).json({"status":false, "message": "Product out-of-stock" });
                else
                return response.status(400).json({"status":false, "message": `Only ${product.quantity} items available in Stock` });
            }
            const item = await db.cart.findOne({where:{ 'product_id': product.id ,'user_id':user.id}})
            if (item) {
                const data = {
                    "quantity" : item.quantity + quantity,
                    "price" : product.price
                }
                item.set(data)
                await item.save()

            }
            else {
            const order_id = await generateItemUniqueItemId()
            const data = {
                user_id : user.id,
                product_id : product.id,
                order_id: order_id,
                price : product.price,
                quantity : quantity,
            }
            await db.cart.create(data);

            }
            await product.update({quantity: product.quantity - quantity })
            await product.reload()
            console.log("UPDATED stock",product.quantity)

            return response.status(200).json({"status":true, "message": "Product Added to Cart Successfully" });


            await product.reload()
            return response.status(200).json({"status":true, "message": "Product Added to Cart Successfully" });

        } else {
            return response.status(400).json({"status":false, "message": `User Not Logged in` });

        }
    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({ "status":false,"message": error.message });
    }

});

router.delete('/user/cart/items/:order_id', isAuthenticated, async (request, response) => {
    try {
        const user = request.user
        const order_id = request.params.order_id
        const all_items = request.query.all_items
        console.log('All items',all_items)

        
        const order = await db.cart.findOne({where:{ 'order_id': order_id }})
        if (order && order.user_id == user.id) {
            const product_id = order.product_id
            const product = await db.products.findByPk(product_id)
            const item_quantity = order.quantity
            let response_msg = ''
            if  (all_items == 'true' || order.quantity == 1){
                await order.destroy()
                await product.update({quantity: product.quantity + item_quantity })
                response_msg = "All Items Removed from Cart Successfully"
            }
            else{
                await order.update({quantity: order.quantity-1})
                await product.update({quantity: product.quantity + 1 })
                response_msg = "Item Removed from Cart Successfully"
            }
            await product.reload()
            return response.status(200).json({"status":true, "message": response_msg });

        } else {
            return response.status(400).json({"status":false, "message": `Order Not Found` });

        }
    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({ "status":false,"message": error.message });
    }

});


router.get('/products', isAuthenticated, async (request, response) => {
    try {

        const user = request.user
        const products = await db.products.findAll();

        return response.status(200).json({"status":true,"data":products});
    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }
});


router.get('/products/:id', isAuthenticated, async (request, response) => {
    try {
        const user = request.user
        const id = parseInt(request.params.id)
        const products = await db.products.findByPk(id)

        if (products) {
            return response.status(200).json({"status":true,"data": products });
        } else {
            return response.status(404).json({ "status":false,"message": "Product Not Found" });
        }
    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }
});


router.post('/products', isAuthenticated, async (request, response) => {
    try {
        const user = request.user
        if (user.role != 'admin') {
            return response.status(404).json({ "status":false, "message": "User do not have privilage to perform following action!" });

        }
        const product_data = request.body
        const data = {
            name : product_data.name,
            price : parseFloat(product_data.price),
            quantity : parseInt(product_data.quantity),
        
        }
        await db.products.create(data);
        return response.status(201).json({"status":true, "message": "Product Added Successfully!" });

    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({ "status":false,"message": error.message });
    }
});


router.put('/products/:id', isAuthenticated, async (request, response) => {
    try {
        const product_id = parseInt(request.params.id)
        const product = await db.products.findByPk(product_id)
        const user = request.user
        console.log("IM HERE")

        if (user.role != 'admin') {
            return response.status(401).json({"status":false,"message": "User do not have privilage to perform following action!" });
        }
        if (product) {
            const data = request.body;
            // Assuming 'product_id' is a unique identifier in your collection
            await product.update(data);
            return response.status(200).json({"status":true, "message": "Product Updated Successfully" });

        } else {
            return response.status(404).json({"status":false, "message": "Product Not Found" });
        }

    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }
});


router.delete('/products/:id', isAuthenticated, async (request, response) => {
    try {
        const user = request.user
        if (user.role != 'admin') {
            return response.status(401).json({ "status":false,"message": "User do not have privilage to perform following action!" });

        }
        const id = parseInt(request.params.id)
        const product = await db.products.findByPk(id)
        if (product) {
            await product.destroy()
            return response.status(200).json({"status":true, "message": "Product Deleted Successfully!" });
        } else {
            return response.status(404).json({"status":false, "message": "Product Not Found" });
        }

    }
    catch (error) {
        // Handle the exception
        return response.status(500).json({"status":false, "message": error.message });
    }
});

//Other routes here
router.get('*', function (req, res) {
    res.status(404).send('Sorry, this is an invalid URL.');
});

export default router;