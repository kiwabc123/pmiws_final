const connection = require('../../configs/database')
const modelStudent = connection.model('student', {
    stuGroup: String,
    stuID: String,
    stuYear: String,
    created_At : Date
})
module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newManage = new modelStudent({
                stuGroup: value.stuGroup,
                stuID: value.stuID,
                stuYear: value.stuYear,
                created_At: new Date(),
            })
            // save to database (return as Promise)
            newManage.save().then(res => resolve({ status: 'inserted' })).catch(err => reject({ status: 'cannot inserted' }))
        })
    },
    // find(value) {
    //     return new Promise((resolve, reject) => {
    //         const limitPage = 20
    //         const startPage = ((value.page || 1) - 1) * limitPage
    //         const items = { result: [], rows: 0, limit: limitPage }
    //         var query = {};
    //         if (value.search_key && value.search_text) {
    //             query[value.search_key] = { '$regex': value.search_text, '$options': 'i' }
    //         }
    //         modelStudent.find(query).skip(startPage).sort({ 'no_updated': -1 }).limit(limitPage).then(result => {
    //             items.result = result
    //             modelStudent.find(query).countDocuments().then(count => {
    //                 items.rows = count
    //                 resolve(items)
    //             }).catch(err => reject(err))
    //             //resolve(res)
    //         }).catch(err => reject(err))
    //     })
    // },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            query['_id'] = value._id
            modelStudent.find(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findByGroup(value) {
        return new Promise((resolve, reject) => {
            modelStudent.findOne({stuGroup: value}).sort({"stuGroup":1}).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findByStudent(value) {
        return new Promise((resolve, reject) => {
            modelStudent.findOne({stuID: value.stuID}).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findAll(value) {
        return new Promise((resolve, reject) => {
            modelStudent.find().sort({"stuGroup":1}).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findGroupLength() {
        return new Promise((resolve, reject) => {
            modelStudent.aggregate([
                // Group and count the total of each occurrence for each word
                { $group: { 
                  _id: "$stuGroup" , 
                  count: { "$sum": 1 }
                }},
              
                // Remove the id field from the response, rename it to the word
                { $project: { "_id": 0, "group": "$_id", "count": 1 } },
              
                // Sort the results with highest occurrences first
                { $sort: { "count": 1 } }
              ]).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findYearLength() {
        return new Promise((resolve, reject) => {
            modelStudent.aggregate([
                // Group and count the total of each occurrence for each word
                { $group: { 
                  _id: "$stuYear" , 
                  count: { "$sum": 1 }
                }},
              
                // Remove the id field from the response, rename it to the word
                { $project: { "_id": 0, "year": "$_id", "count": 1 } },
              
                // Sort the results with highest occurrences first
                { $sort: { "count": 1 } }
              ]).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    onUpdateData(value) {
        // console.log(value)
        return new Promise((resolve, reject) => {
            var conditions = { _id: value._id }
                , update = {
                    stuGroup: value.stuGroup,
                    stuID: value.stuID,
                    stuYear: value.stuYear,
                },
                options = { multi: true };
            modelStudent.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    onUpdateStudent(value) {
        // console.log(value)
        return new Promise((resolve, reject) => {
            var conditions = { stuID: value.stuID }
                , update = {
                    stuYear: value.stuYear,
                },
                options = { multi: true };
            modelStudent.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onDelete(value) {
        return new Promise((resolve, reject) => {
            modelStudent.deleteOne({
                _id: value[0]._id
            }).then(result => {
                // console.log(result)
                resolve(result)
            }).catch(err => reject(err))
        })
    }

}
