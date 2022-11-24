const connection = require('../../configs/database')
const { password_hash, isEmpty } = require('../../configs/security')
const modelAdmin = connection.model('admin', {
    username: String,
    password: String,
})
module.exports = {
    onRegister(value) {
        return new Promise((resolve, reject) => {
            const newAccount = new modelAdmin({
                username: value.username,
                password: value.password,
            })
            newAccount.save().then(res => resolve(res)).catch(err => reject({ status: 'cannot registered' }))
        })
    },
    onLogin(req) {
        const value = req.body
        return new Promise((resolve, reject) => {
            modelAdmin.find({ username: value.username, password: value.password }).exec(function (error, res) {
                if (error) {
                    reject(error)
                } else {
                    if (isEmpty(res)) {
                        resolve({ message: 'Authen fail' })
                    } else {
                        resolve(res[0])
                    }
                }
            })
        })
    },
    onUpdate(value) {
        return new Promise((resolve, reject) => {
            var conditions = { _id: value._id }
                , update = {
                    username: value.username,
                    password: value.password,
                },
                options = { multi: true };
            modelAdmin.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findAll(value) {
        return new Promise((resolve, reject) => {
            modelAdmin.find().then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            query['_id'] = value._id
            modelAdmin.findOne(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

}
