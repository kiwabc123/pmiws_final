const crypto = require('crypto')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const security = {
    password_hash(password) {
        return crypto.createHash('sha1').update(password).digest('hex');
    },
    password_verify(password, password_hash) {
        return security.password_hash(password) === password_hash
    },
    generateAccessToken(data) {
        return jwt.sign({data : data}, process.env.TOKEN_SECRET, { expiresIn: '24h' });
    },

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
      
        if (token == null) return res.sendStatus(401)
      
        jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        //   console.log(err)
      
          if (err) return res.sendStatus(403)
      
          req.user = user
      
          next()
        })
      },
    // authenticatedAdmin(req, res, next) {
    //     try {
    //         if (req.session.userAdmin) {
    //             return next()
    //         }
    //         throw new Error('Admin unautherize.')

    //     } catch (ex) {
    //         res.error(ex, 401)
    //     }
    // },
    // authenticated(req, res, next) {
    //     try {
    //         if (req.session.user) {
    //             return next()
    //         }
    //         throw new Error('User unautherize.')

    //     } catch (ex) {
    //         res.error(ex, 401)
    //     }
    // },
    isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
}
module.exports = security