

//variable
let id = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'

// support fungsi

function getId(_id) {
    id = _id
}

let button = document.getElementById('mybutton')
button.onclick = () => {
    condition ? addData() : editData()
}

let addButton = document.getElementById('addButton')
addButton.onclick = () => {
    condition = true
    const name = document.getElementById('name').value = ""
    const phone = document.getElementById('phone').value = ""
}



document.getElementById('formData').addEventListener('submit', function (event) {
    event.preventDefault()
    editData()
})
document.getElementById('formData').addEventListener('submit', function (event) {
    event.preventDefault()
    addData()
})
document.getElementById('formData').addEventListener('submit', function (event) {
    event.preventDefault()
    browse()
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


        for (let i = 0; i <= users.pages; i++) {
            pageNumber += `<a class="page-link ${page == i ? 'active' : ''}" id="button-pagination" onclick="changePage(${i})">${i}</a>`
        }
        if (document.getElementById('showData').value == 0) {
            pagination += `
            <span class="mx-2 mt-1">Showing ${users.offset + 1} to ${users.total} enteries</span>
            <div class="page">
            <a class="page-link active" id="button-pagination">1</a>
            </div>`
        } else {
            // pagination += `
            // <span class="mx-2 mt-1">Showing ${users.offset + 1} to ${(Number(limit) + Number(users.offset))}   </span>
            // `
        }
        document.getElementById('users-table-body').innerHTML = html
    } catch (e) {
        res
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
        console.log(err)
    }
}


const getoneData = async (id) => {
    condition = "false"
    try {
        const response = await fetch(`http://localhost:3000/api/users/${id}`)
        const user = await response.json()
        getId(user._id)
        document.getElementById('name').value = user.name
        document.getElementById('phone').value = user.phone
    } catch (err) {
        console.log(err)
    }
}

const editData = async () => {
    condition = "false"
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
        readData()
    } catch (err) {
        console.log(err)
    }
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
        console.log(err)
    }
    readData()
}


