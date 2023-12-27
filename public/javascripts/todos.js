
// variables support
let id = null, title = '', complete = '', page = 1, limit = 10, sortBy = '_id', sortMode = 'desc'
let deadline = '', startdateDeadline = '', enddateDeadline = ''
let complt = false

// functions id support 

function getId(id) {
    id = _id
}



const readData = async (semua) => {
    try {
        const response = await $.ajax({
            url: `/api/todos`,
            method: "GET",
            dataType: "json",
            data: {
                executor,
                sortBy,
                sortMode,
                deadline,
                title,
                startdateDeadline,
                enddateDeadline,
                complete,
                page,
                limit
            }
        })
        let htmlList = ''
        response.data.forEach((item, index) => {
            htmlList += ` 
                <div id="${item._id}" class="todoslist ${item.complete == false && new Date(`${item.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : item.complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
                 ${moment(item.deadline).format('DD-MM-YYYY HH:mm')} ${item.title}
                 <div>
                    <a type="button" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
                    <a type="button" onclick="getId('${item._id}')"  data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
                 </div>    
                </div>
                `
        })

        if (semua == false) {
            $('#showTodos').append(htmlList)
        } else if (semua == true) {
            $('#showTodos').html(htmlList)
        }

    } catch (err) {
        console.log(err)
    }
}
readData(complt)


