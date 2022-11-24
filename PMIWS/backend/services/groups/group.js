const connection = require('../../configs/database')
const modelGroup = connection.model('group', {
    GroupNo: String,
    GroupLeader: String,
    created_At : Date
})
module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newManage = new modelGroup({
                GroupNo: value.GroupNo,
                GroupLeader: value.GroupLeader,
                created_At: new Date(),
            })
            // save to database (return as Promise)
            newManage.save().then(res => resolve({ status: 'inserted' })).catch(err => reject({ status: 'cannot inserted' }))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            query['_id'] = value._id
            modelGroup.find(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    // findByFullName(value) {
    //     return new Promise((resolve, reject) => {
    //         modelGroup.findOne({stuFullName: value}).then(result => {
    //             resolve(result)
    //         }).catch(err => reject(err))
    //     })
    // },

    findByGroup(value) {
        return new Promise((resolve, reject) => {
            modelGroup.findOne({GroupNo: value}).sort({"GroupNo":1}).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findAll(value) {
        return new Promise((resolve, reject) => {
            modelGroup.find().sort({"GroupNo":1}).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onUpdateData(value) {
        // console.log(value)
        return new Promise((resolve, reject) => {
            var conditions = { _id: value._id }
                , update = {
                    GroupNo: value.GroupNo,
                    GroupLeader: value.GroupLeader,
                },
                options = { multi: true };
            modelGroup.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onDelete(value) {
        return new Promise((resolve, reject) => {
            modelGroup.deleteOne({
                _id: value._id
            }).then(result => {
                // console.log(result)
                resolve(result)
            }).catch(err => reject(err))
        })
    }

}
