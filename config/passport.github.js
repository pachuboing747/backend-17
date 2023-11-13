const GithubStrategy = require ("passport-github2")

const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager.js')
const userManager = ManagerFactory.getManagerInstance('users')
const cartManager = ManagerFactory.getManagerInstance('carts')


const { CLIENT_ID, CLIENT_SECRET, STRATEGY_NAME} = require ("./config.js")

const githubAccess = {
    clientID : CLIENT_ID,
    clientSecret : CLIENT_SECRET,
    callBackURL: "http://localhost:8080/githubSessions"
};


const githubUsers = async (profile,done) => {

    console.log(profile)
    const {name, email} = profile._json;
    const _user = await userManager.getByEmail(email);

    if(!_user){
        console.log("usuario no encontardo")

        const cart = await cartManager.addCart()

        const newUser = {
            firstname : name.split(" ")[0],
            lastname : name.split(" ")[1],
            email: email,
            password: "",
            gender: "None",
            cart: cart
        }

        const result = await userManager.create(newUser)
        return done(null,result)
    }
    console.log("El usuario ya existe", _user?.role)
    return done(null,_user)
}

const githubController = async(
    accessToken,
    refreshToken,
    profile,
    done
)=>{
    try{ 
        return await githubUsers(profile,done);
    }catch(error){
        done(error)
    }
}

module.exports = {
    GithubStrategy,
    githubAccess,
    githubController,
    strategyName: STRATEGY_NAME,
}