const { name } = require('ejs')
var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')


module.exports = function (db) {

  const User = db.collection('users')
  router.get('/', async (req, res, next) => {
    try {
      const { page = 1, sortBy = '_id', sortMode = 'desc', limit = '5', query = '' } = req.query
      const offset = (page - 1) * limit
      const params = {}
      const sort = {}
      sort[sortBy] = sortMode
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

  // router.post('/', async (req, res, next) => {

  // })




  return router;

}
