const connection = require('../../configs/database')
var mongoose = require('mongoose')
const { modelSupplier } = require('../supplier/supplier')
const { modelImage } = require('../image/image')
const { spawn } = require('child_process')
const fs = require("fs")

// const modelSupplier = connection.model('Supplier', {

//     name:String,
//     contact:Object,
// })
var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });

};

const modelProduct = connection.model('Product', {


    detail: String,
    price: Object,
    category: String,
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: modelSupplier },
    images: Array,
})
module.exports = {
    onInsert(value, images, supplier) {
        return new Promise((resolve, reject) => {
            // insert images
          
            // console.log(images)
            const newManage = new modelProduct({


                detail: value.detail,
                price: value.price,
                category: value.category,
                supplier: supplier,
                images: images,

            })
            // save to database (return as Promise)
            newManage.save().then(res => resolve({ status: res }))
                // resolve({ status: "ok" })
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
    search(value) {
        return new Promise((resolve, reject) => {

            try {
                value.mv(__dirname + '/upload/' + value.name);
                // resolve(value.name)



                var dataToSend;
                var obj;

                const python = spawn('python', ['../backend/python_script/imagesearch.py', value.name])
                python.stdout.on('data', function (data) {

                    dataToSend = data.toString()
                    console.log(dataToSend)
                    // console.log(typeof ataToSend)
                    // Preserve newlines, etc. - use valid JSON
                    dataToSend = dataToSend.replace(/\\n/g, "\\n")
                        .replace(/\\'/g, "\\'")
                        .replace(/\\"/g, '\\"')
                        .replace(/\\&/g, "\\&")
                        .replace(/\\r/g, "\\r")
                        .replace(/\\t/g, "\\t")
                        .replace(/\\b/g, "\\b")
                        .replace(/\\f/g, "\\f");
                    // Remove non-printable and other non-valid JSON characters
                    dataToSend = dataToSend.replace(/[\u0000-\u0019]+/g, "");
                    // replace single quotes with double quotes 
                    dataToSend = dataToSend.replace(/'/g, '"');
                   
                        if(dataToSend.indexOf("/")!==1){
                        obj = JSON.parse(dataToSend);
                        console.log("data",obj.length ,obj)
                        }
                   
              
            });

              
                python.on('exit', (code) => {
                    console.log(`child process exited with code ${code}`, obj);
                    resolve(obj)
                });


            }
            catch (err) {
                 reject(err)
            }
        })
    },
    findproduct(value) {
        return new Promise((resolve, reject) => {
            // console.log(value)
            modelProduct.find({ images: { $in: value } }).then(result => {
                resolve(result)
            }).catch(err => reject(err))
        })
    },
    findOne(value) {
        return new Promise((resolve, reject) => {
            var query = {};
            // console.log(query)
            query['_id'] = value
            modelProduct.find(query).then(result => {
                resolve(result)
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

    findByCategory(value) {
        return new Promise((resolve, reject) => {
            modelProduct.findOne({ category: value.category }).then(result => {

                resolve(result)
            }).catch(err => reject(err))
        })
    },

    findAll(value) {
        return new Promise((resolve, reject) => {
            modelProduct.find().sort({ "_id": 1 }).then(result => {
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
                    detail: value.detail,
                    price: value.price,
                    category: value.category,
                    supplier: value.supplier,
                    image_id: value.image_id,
                },
                options = { multi: true };
            modelProduct.updateOne(conditions, update, options).then(result => {
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
            modelProduct.deleteOne({
                _id: value[0]._id
            }).then(result => {
                // console.log(result)
                resolve(result)
            }).catch(err => reject(err))
        })
    }

}
