const router = require('express').Router()
// const { authenticated, authenticatedAdmin } = require('../configs/security')

const admin = require('./accounts/admin')
const student = require('./accounts/student')
const groups = require('./groups/group')
const image = require('./image/image')
const product = require('./product/product')
const supplier =require('./supplier/supplier')
router.use('/admin', admin)
router.use('/students', student)
router.use('/groups', groups)
router.use('/image',image)
router.use('/product',product)
router.use('/supplier',supplier)

module.exports = router;