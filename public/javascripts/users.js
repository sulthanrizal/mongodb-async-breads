

//variable
let id = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'

// support fungsi

function getId(_id) {
    id = _id
}

let button = document.getElementById('mybutton')
button.onclick = () => {
    conditional ? addData() : editData()
}

let addButton = document.getElementById('addButton')
addButton.onclick = () => {
    conditional = true
    const name = document.getElementById('name').value = ""
    const phone = document.getElementById('phone').value = ""
}


const sortNameAsc = (name) => {
    sortBy = name
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Phone</th>`
    let sortAsc = `
    <a type="button" onclick="sortNameDesc('name')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortAsc
    document.getElementById(`sort-phone`).innerHTML = random
    readData()
}

const sortNameDesc = (name) => {
    sortBy = name
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortNameAsc('name')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Name</span>
    `
    document.getElementById(`sort-name`).innerHTML = sortDesc
    readData()
}

const sortPhoneAsc = (phone) => {
    sortBy = phone
    sortMode = 'asc'
    let random = `<a type="button" onclick="sortPhoneAsc('name')"><i class="fa-solid fa-sort"></i></a> Name</th>`
    let sortAsc = `
    <a type="button" onclick="sortPhoneDesc('phone')"><i class="fa-solid fa-sort-up"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortAsc
    document.getElementById(`sort-name`).innerHTML = random
    readData()
}

const sortPhoneDesc = (phone) => {
    sortBy = phone
    sortMode = 'desc'
    let sortDesc = `
    <a type="button" onclick="sortPhoneAsc('phone')"><i class="fa-solid fa-sort-down"></i></a>
    <span>Phone</span>
    `
    document.getElementById(`sort-phone`).innerHTML = sortDesc
    readData()
}


const chooselimit = () => {
    limit = document.getElementById('showData').value
    page = 1
    readData()
}

const changePage = (num) => {
    page = num
    readData(page)
}


document.getElementById('form-user').addEventListener('submit', function (event) {
    event.preventDefault()
    addData()
})

document.getElementById('form-user').addEventListener('submit', function (event) {
    event.preventDefault()
    editData()
})



const browse = () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    let inputData = document.getElementById('inputData').value


    query = inputData.toString()
    page = 1
    readData()
}

const reset = () => {
    query = document.getElementById('inputData').value = ""
    readData()
}

const readData = async function () {
    let pagination = ''
    let pageNumber = ''
    try {
        const response = await fetch(`http://localhost:3000/api/users?query=${query}&page=${page}&limit=${limit}&sortBy=${sortBy}&sortMode=${sortMode}`);
        const users = await response.json();
        let html = ''
        const offset = users.offset
        users.data.forEach((item, index) => {
            html += ` <tr>
                 <td>${index + 1 + offset}</td>
                 <td>${item.name}</td>
                 <td>${item.phone}</td>
                 <td>
                 <button class="btn btn-success" onclick="getoneData('${item._id}')" type="button"  data-bs-toggle="modal" data-bs-target="#addData"><i class="fa-solid fa-pen"></i></button>
                 <button class="btn btn-danger" onclick="getId('${item._id}')" data-bs-toggle="modal" data-bs-target="#deleteData" style="color:white;"><i class="fa-solid fa-trash"></i></button>
                 <a href="/users/${item._id}/todos" class="btn btn-warning"><i class="fa-solid fa-right-to-bracket"></i></a>
                 </td>
              </tr>`
        })

        for (let i = 1; i <= users.pages; i++) {
            pageNumber += `<a class="page-link ${page == i ? ' active' : ''} " ${users.pages == 1 ? `style =border-radius:4px;` : ''} ${i == 1 && page == i ? `style="border-top-left-radius:4px; border-bottom-left-radius:5px;"` : ''}  ${i == users.pages && page == i ? `style="border-top-right-radius:4px; border-bottom-right-radius:5px;"` : ''} id="button-pagination" onclick="changePage(${i})">${i}</a>`

        }

        if (document.getElementById('showData').value == 0) {
            pagination += `
        <span class="mx-2 mt-1">Showing ${users.offset + 1} to ${users.total} of ${users.total} entries </span>
        <div class="page">
        <a class="page-link active" id="button-pagination">1</a>
        </div>
        `
        } else {
            pagination += `
        <span class="showPage">Showing ${users.offset + 1} to ${(Number(limit) + Number(users.offset)) >= users.total ? Number(users.total) : Number(limit) + Number(users.offset)} of ${users.total} entries </span>
        <div class="page">
        ${users.page == 1 ? '' : '<a onclick="changePage(page - 1)" style="border-top-left-radius:4px; border-bottom-left-radius:4px;" class="page-link" arial-lable="back"><span arial-hidden = true">&laquo</span></a>'}
        ${pageNumber}
        ${users.page == users.pages ? '' : '<a onclick="changePage(page + 1)" class="page-link" style="border-top-right-radius:4px; border-bottom-right-radius:4px;" arial-lable="next"><span arial-hidden = true">&raquo</span></a>'}
        </div>
        `
        }
        document.getElementById('button-pagination').innerHTML = pagination
        document.getElementById('users-table-body').innerHTML = html
    } catch (e) {
        alert('failed to read data users')
    }
}
readData()

const addData = async () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    try {
        const response = await fetch(`http://localhost:3000/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone })

        })
        const user = await response.json()
        document.getElementById('name').value = ""
        document.getElementById('phone').value = ""
        readData()
    } catch (err) {
        alert('falied to add data users')
    }
}


const getoneData = async (id) => {
    conditional = false
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`)
        const user = await response.json()
        getId(user._id)
        document.getElementById('name').value = user.name
        document.getElementById('phone').value = user.phone
    } catch (err) {
        alert('failed to get one data users')
    }
}

const editData = async () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone })

        })
        const user = await response.json()
        document.getElementById('name').value = ""
        document.getElementById('phone').value = ""


    } catch (err) {
        alert('failed to edit data users')
    }
    readData()
}

const deleteData = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone })
        })
    } catch (err) {
        alert('failed to delete data users')
    }
    readData()
}


const pageTodos = async (id) => {
    const response = await fetch(`http://localhost:3000/users/${id}/todos`)
    const todos = await response.json()
}



