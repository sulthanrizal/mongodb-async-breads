
var express = require('express');
var router = express.Router();
const { ObjectId } = require('mongodb')


module.exports = function (db) {
    const Todo = db.collection('todos')
    const User = db.collection('users')

    router.get('/', async (req, res, next) => {
        try {
            const { page = 1, limit = 10, title, startdateDeadline, enddateDeadline, complete, sortMode = 'desc', sortBy = '_id', executor } = req.query
            const params = {}
            const sort = {}
            sort[sortBy] = sortMode
            const offset = (page - 1) * limit

            if (title) {
                params['title'] = new RegExp(title, 'i')
            }

            if (startdateDeadline && enddateDeadline) {
                params['deadline'] = {
                    $gte: new Date(startdateDeadline),
                    $lte: new Date(enddateDeadline)
                }
            } else if (startdateDeadline) {
                params['deadline'] = { $gte: new Date(startdateDeadline) }
            } else if (enddateDeadline) {
                params['deadline'] = { $lte: new Date(enddateDeadline) }
            }

            if (complete) {
                params['complete'] = JSON.parse(complete)
            }

            if (executor) {
                params['executor'] = new ObjectId(executor)
            }


            const total = await Todo.count(params)

            const pages = Math.ceil(total / limit)

            const todo = await Todo.find(params).sort(sort).limit(Number(limit)).skip(Number(offset)).toArray();
            res.status(201).json({ data: todo, total, pages, page: Number(page), limit })
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.post('/', async (req, res, next) => {
        try {
            const { title, executor } = req.body
            const oneDay = 31 * 60 * 60 * 1000
            const user = await User.findOne({ _id: new ObjectId(executor) })
            const todo = await Todo.insertOne({ title: title, complete: false, deadline: new Date(Date.now() + oneDay), executor: user._id })
            const data = await Todo.find({ _id: new ObjectId(todo.insertedId) }).toArray()
            res.status(201).json(data)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.get('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOne({ _id: new ObjectId(id) })
            res.status(201).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.put('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const { title, deadline, complete } = req.body
            const todo = await Todo.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { title: title, deadline: new Date(deadline), complete: JSON.parse(complete) } }, { returnDocument: 'after' })
            res.status(201).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    router.delete('/:id', async (req, res, next) => {
        try {
            const id = req.params.id
            const todo = await Todo.findOneAndDelete({ _id: new ObjectId(id) })
            res.status(201).json(todo)
        } catch (err) {
            res.status(500).json({ err })
        }
    })

    return router;

}
