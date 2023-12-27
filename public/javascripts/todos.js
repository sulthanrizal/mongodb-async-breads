//variables support
let id = null, title = '', complete = '', page = 1, limit = 10, sortBy = '_id', sortMode = 'desc'
let deadline = '', startdateDeadline = '', enddateDeadline = ''
let complt = false

// functions id support 

function getId(id) {
    id = _id
}



const readData = async () => {
    const readData = async function () {
        let pagination = ''
        let pageNumber = ''
        try {
            const response = await $.ajax({
                url: `http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`,
                method: "GET",
                data: { id: menuId },
                dataType: "json"
            })
            const users = await response.json();

        } catch (err) {
            res.status(500).json({ err })
        }
    }
    readData()
}


