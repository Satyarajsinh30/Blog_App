const { validateToken } = require("../services/authentication")

function authenticateCookie(cookieName){
    return (req,res,next)=>{
        const tokenValue = req.cookies[cookieName]
        if(!tokenValue){
            return next()
        }

        try {
            const userPayload = validateToken(tokenValue)
            req.user = userPayload
        } catch (error) {}

        return next()
        
    }
}

module.exports={
    authenticateCookie
}