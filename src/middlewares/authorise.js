const authorise = (permittedRoles) => {
    return (req, res, next) => {
        user = req.user.user;
        isAllowed = false;
        user.roles.forEach(role => {
            if(permittedRoles.includes(role))
            isAllowed = true;
        });
        if(!isAllowed)
        {
           return res.status(401).json({message : "You are not allowed to access this feature"});
        }
        next();
    }
}

module.exports = authorise;