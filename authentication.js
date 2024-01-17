import db from "./db.js";
import jwt from  'jsonwebtoken';

const isAuthenticated = async (request,response,next) => {
    try{

    if(request.session.token){
        console.log("TOKEN ",request.session.token)
    const decoded_data = jwt.verify(request.session.token,'SECERT')
    const id = decoded_data.id;
    console.log("DECODED DATA ",decoded_data)
    const user = await db.users.findByPk(id)
    console.log("USER" ,user)
    if (user){
        request.user = user
        next()
    }
    else{
        return response.status(400).json({"error": `User not Found!`});

    }
    }
    else{
        return response.status(400).json({"error": `Token is Missing!`});

    }
}
catch (error) {
    // Handle the exception
    return response.status(404).json({ "error": error.message });
}
    
};


const generateToken = (user_id) => {
    const token = jwt.sign({id:user_id},"SECERT",{ expiresIn: '1h' });
    return token;
}

export {isAuthenticated,generateToken};