const router = require('express').Router()
const { check } = require('express-validator')
const service = require('../../services/groups/group')
//  เพิ่มข้อมูล
router.post('/', [
    check('GroupNo').not().isEmpty(),
    check('GroupLeader').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()

        const item = await service.findByGroup(req.body.GroupNo);

        // console.log(item)

        if (item === null) {
                res.json({ message: await service.onInsert(req.body) })
            } else {
                res.json({ message: await service.onUpdateData(req.body) })
            }


        // res.json({ message: item })
    } catch (err) {
        res.error(err)
    }
})

router.get('/', [], async(req, res) => {
    try {
        const items = await service.findAll()
        //console.log(items)
        res.json(items)
    } catch (err) {
        res.error(err)
    }
})
router.get('/byID', [], async(req, res)=>{
    try {
        const items = await service.findOne(req.params.id)
        res.json(items)
    } catch(err){
        res.error(err)
    }
})


router.get('/byGroup', [], async(req, res)=>{
    try {
        const items = await service.findByGroup(req.query.group)
        res.json(items)
    } catch(err){
        res.error(err)
    }
})


router.put('/update', [
    check('stuGroup').not().isEmpty(),
    check('stuMember').not().isEmpty(),
], async (req, res) => {
    try {
        req.validate()
        const updateItem = await service.onUpdateData(req.body)
        res.json(updateItem)
    } catch (err) {
        res.error(err)
    }
})

router.delete('/', async (req, res) => {
    // console.log(req.query)
    try {
        const item = await service.findOne(req.query)
        if (!item) {
            throw new Error('Not found item.')
        } else {
            const deleteItem = await service.onDelete(item)
            // console.log("complete")
            res.json(deleteItem)
        }
    } catch (err) {
        res.error(err)
    }
})

module.exports = router
