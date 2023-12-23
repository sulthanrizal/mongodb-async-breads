const { name } = require('ejs')
var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')


module.exports = function (db) {

  const User = db.collection('users')
  router.get('/', async (req, res, next) => {
    try {
      const { page = 1, limit = '5', query, sortBy = '_id', sortMode = 'desc' } = req.query
      const params = {}
      const sort = {}
      sort[sortBy] = sortMode
      const offset = (page - 1) * limit

      if (query) {
        params['$or'] = [{ "name": new RegExp(query, 'i') }, { "phone": new RegExp(query, 'i') }]

      }

      const total = await User.count(params)
      const pages = Math.ceil(total / limit)

      const users = await User.find(params).sort(sort).limit(Number(limit)).skip(Number(offset)).toArray()
      res.json({ data: users, total, pages, page: (Number(page)), limit: (Number(limit)), offset });

    } catch (err) {
      res.status(500).json({ err })
    }

  });


  router.post('/', async (req, res, next) => {
    try {
      const { name, phone } = req.body
      const user = await User.insertOne({ name: name, phone: phone })
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  })

  router.get('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOne({ _id: new ObjectId(id) })
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  })

  router.put('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const { name, phone } = req.body
      const user = await User.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { name: name, phone: phone } }, { returnDocument: 'after' })
      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  })



  router.delete('/:id', async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findOneAndDelete({ _id: new ObjectId(id) })

      res.status(201).json(user)
    } catch (err) {
      res.status(500).json({ err })
    }
  })





  return router;

}
