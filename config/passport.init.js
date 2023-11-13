const passport = require('passport')
const ManagerFactory = require('../dao/managers/manager.Mongo/factory.manager.js')
const userManager = ManagerFactory.getManagerInstance('users')

const {LocalStrategy,signup,login} = require ("./passport.js")
const {  
  GithubStrategy,
  githubAccess,
  githubController,
  strategyName
} = require("./passport.github.js")



const init = () => {
 
  passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, signup));
  passport.use('local-login', new LocalStrategy({ usernameField: 'email' }, login));
   
  passport.use(strategyName,
    new GithubStrategy(githubAccess,githubController)
  ) 

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userManager.getById(id);
    done(null, user);
  })
    
};

module.exports = init 