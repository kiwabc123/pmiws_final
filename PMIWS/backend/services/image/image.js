const connection = require('../../configs/database')
const fs = require('fs');
const request = require('request');
const modelImage = connection.model('Image', {

    imageID: String,
    imageURL: String,
})

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });

};

module.exports = {
    onInsert(value) {
        return new Promise((resolve, reject) => {
            const newManage = new modelImage({

                imageURL: value,
            })

            // save to database (return as Promise)
            newManage.save()
                // .then(res => console.log(res))
                .then(res => download(res.imageURL, './dataset/' + res._id.toString() + '.jpeg', function () {
                    resolve(res._id)
                }



                ))


                .catch(err => reject({ status: 'cannot inserted' }))

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
    //             //resolve(res)0
    //         }).catch(err => reject(err))
    //     })
    // },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            query['_id'] = value
            modelImage.find(query).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findMany(value) {
        return new Promise((resolve, reject) => {
            // console.log(value)
            modelImage.find({ _id: { $in: value } }, { _id: 0 }, { imageURL: 1 }).then(result => {
                const images = []
                for (var i = 0; i < result.length; i++) {
                    // console.log(result[i].imageURL)
                    images.push(result[i].imageURL)

                }
                resolve(images)
            }).catch(err => reject(err))
        })
    },

    // findByGroup(value) {
    //     return new Promise((resolve, reject) => {
    //         modelStudent.findOne({ stuGroup: value }).sort({ "stuGroup": 1 }).then(result => {
    //             resolve(result)
    //         }).catch(err => reject(err))
    //     })
    // },

    findByStudent(value) {
        return new Promise((resolve, reject) => {
            modelImage.findOne({ imageURL: value.imageURL }).then(result => {

                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findAll(value) {
        return new Promise((resolve, reject) => {
            modelImage.find().sort({ "_id": 1 }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    // findGroupLength() {
    //     return new Promise((resolve, reject) => {
    //         modelStudent.aggregate([
    //             // Group and count the total of each occurrence for each word
    //             {
    //                 $group: {
    //                     _id: "$stuGroup",
    //                     count: { "$sum": 1 }
    //                 }
    //             },

    //             // Remove the id field from the response, rename it to the word
    //             { $project: { "_id": 0, "group": "$_id", "count": 1 } },

    //             // Sort the results with highest occurrences first
    //             { $sort: { "count": 1 } }
    //         ]).then(result => {
    //             resolve(result)
    //         }).catch(err => reject(err))
    //     })
    // },

    // findYearLength() {
    //     return new Promise((resolve, reject) => {
    //         modelStudent.aggregate([
    //             // Group and count the total of each occurrence for each word
    //             {
    //                 $group: {
    //                     _id: "$stuYear",
    //                     count: { "$sum": 1 }
    //                 }
    //             },

    //             // Remove the id field from the response, rename it to the word
    //             { $project: { "_id": 0, "year": "$_id", "count": 1 } },

    //             // Sort the results with highest occurrences first
    //             { $sort: { "count": 1 } }
    //         ]).then(result => {
    //             resolve(result)
    //         }).catch(err => reject(err))
    //     })
    // },

    onUpdateData(value) {
        // console.log(value)
        return new Promise((resolve, reject) => {
            var conditions = { _id: value._id }
                , update = {
                    imageURL: value.imageURL
                },
                options = { multi: true };
            modelImage.updateOne(conditions, update, options).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },

    // onUpdateStudent(value) {
    //     // console.log(value)
    //     return new Promise((resolve, reject) => {
    //         var conditions = { imageURL: value.imageURL }
    //             , update = {
    //                 stuYear: value.stuYear,
    //             },
    //             options = { multi: true };
    //         modelStudent.updateOne(conditions, update, options).then(result => {
    //             resolve(result)
    //         }).catch(err => reject(err))
    //     })
    // },
    onDelete(value) {
        return new Promise((resolve, reject) => {
            modelImage.deleteOne({
                _id: value[0]._id
            }).then(result => {
                // console.log(result)
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    onReset(value) {
        return new Promise((resolve, reject) => {
            if (value) {
                modelImage.deleteMany({})
                    .then(result => {
                        resolve(result)
                    }).catch(err => reject(err))
            }
        })
    }

}
