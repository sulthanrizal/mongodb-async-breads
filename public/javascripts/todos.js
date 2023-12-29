
// variables support
let id = null, title = '', complete = '', page = 1, limit = 10, sortBy = '_id', sortMode = 'desc'
let deadline = '', startdateDeadline = '', enddateDeadline = ''
let complt = false

// functions id support 

function getId(_id) {
    id = _id
}




const resetData = () => {
    title = ''
    startdateDeadline = ''
    enddateDeadline = ''
    complete = ''

    $('#searchTitle').val('')
    $('#startdateDeadline').val('')
    $('#enddateDeadline').val('')
    $('#completeTodo').val('')

    sortBy = '_id'
    sortMode = 'desc'
    let defaultMode = `
    <button class="btn btn-success" onclick="sortDesc('deadline')"><i class="fa-solid fa-sort"></i> sort by deadline</button>
    `
    $('#changeSort').html(defaultMode)
    readData(!complt)
}


const sortAsc = (deadline) => {
    page = 1
    sortBy = deadline
    sortMode = 'asc'
    let ascMode = `
        <button class="btn btn-success" onclick="sortDesc('deadline')"><i class="fa-solid fa-sort-down"></i> sort by deadline</button>
    `
    $('#changeSort').html(ascMode)
    readData(!complt)
}

const sortDesc = (deadline) => {
    page = 1
    sortBy = deadline
    sortMode = 'desc'
    let descMode = `
        <button class="btn btn-success" onclick="sortAsc('deadline')"><i class="fa-solid fa-sort-up"></i> sort by deadline</button>
    `
    $('#changeSort').html(descMode)
    readData(!complt)
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
                    <a type="button" onclick="getData('${item._id}')" data-bs-toggle="modal" data-bs-target="#edit" ><i class="fa-solid fa-pencil"></i></a>
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
        alert('failed to read data todos')
    }
}
readData(complt)


const addData = async () => {
    try {
        title = $('#title').val()
        const oneDay = 24 * 60 * 60 * 1000
        const response = await $.ajax({
            url: `/api/todos`,
            method: "POST",
            dataType: "json",
            data: {
                title,
                executor
            }
        });
        let addList = ''
        addList += `
        <div id="${response[0]._id}" class="todoslist ${response[0].complete == false && new Date(`${response[0].deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : response[0].complete == true ? ' alert alert-success' : ' alert alert-secondary'}" role="alert">
            ${moment(new Date(Date.now() + oneDay)).format('DD-MM-YYYY HH:mm')} ${title}
            <div>
            <a type="button" onclick="getData('${response[0]._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
            <a type="button" onclick="getId('${response[0]._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
            </div>
        </div>
        `
        $('#showTodos').prepend(addList)
        title = ''
        $('#title').val('')
    } catch (err) {
        alert('failed to add data todos')
    }
}


const getData = async (_id) => {
    try {
        getId(_id)
        const response = await $.ajax({
            url: `/api/todos/${_id}`,
            method: "GET",
            dataType: "json",
        });
        $('#editTitle').val(response.title)
        $('#editDeadline').val(moment(response.deadline).format('YYYY-MM-DDThh:mm'))
        $('#editComplete').prop('checked', response.complete)
    } catch (e) {
        console.log(e)
        alert('tidak dapat menampilkan data')
    }
}


const editData = async () => {
    try {
        title = $('#editTitle').val()
        deadline = $('#editDeadline').val()
        complete = $('#editComplete').prop('checked')
        const oneDay = 24 * 60 * 60 * 1000
        const response = await $.ajax({
            url: `/api/todos/${id}`,
            method: "PUT",
            dataType: "json",
            data: {
                title,
                executor,
                deadline,
                complete: Boolean(complete)
            }
        });
        let editList = ''
        editList += `
        ${moment(new Date(deadline)).format('DD-MM-YYYY HH:mm')} ${title}
        <div>
        <a type="button" onclick="getData('${response._id}')" data-bs-toggle="modal" data-bs-target="#edit"><i class="fa-solid fa-pencil"></i></a>
        <a type="button" onclick="getId('${response._id}')" data-bs-toggle="modal" data-bs-target="#delete"><i class="fa-solid fa-trash mx-2"></i></a>
        </div>
        `
        $(`#${response._id}`).attr('class', `todoslist ${response.complete == false && new Date(`${response.deadline}`).getTime() < new Date().getTime() ? ' alert alert-danger' : response.complete == true ? ' alert alert-success' : ' alert alert-secondary'}`).html(editList)
        title = $('#searchTitle').val()
        if ($('#completeTodo').val()) {
            complete = $('#completeTodo').val()
        } else {
            complete = ''
        }

    } catch (e) {
        console.log(e)
        alert('Perubahan data gagal')
    }
}

const deleteData = async () => {
    try {
        const response = await $.ajax({
            url: `/api/todos/${id}`,
            method: "DELETE",
            dataType: "json"
        })
        $(`#${id}`).remove()
    } catch (err) {
        alert('failed to delete data todos')
    }

}


