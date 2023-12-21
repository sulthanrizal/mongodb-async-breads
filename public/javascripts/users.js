//variable
let id = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'

// support fungsi

function getId(_id) {
    id = _id
}

const readData = async function () {
    try {
        let pagination = ''
        let pageNumber = ''
        const response = await fetch("http://localhost:3000/api/users");
        const users = await response.json();
        let html = ''
        users.data.forEach((item, index) => {
            html += ` <tr>
                 <td>${index + 1}</td>
                 <td>${item.name}</td>
                 <td>${item.phone}</td>
                 <td>
                 <button class="btn btn-success" type="button"><i class="fa-solid fa-pen"></i></button>
                 <button class="btn btn-danger" style="color:white;"><i class="fa-solid fa-trash"></i></button>
                 <a href="" class="btn btn-warning" style="color:white;"><i class="fa-solid fa-right-to-bracket"></i></a>
                 </td>
              </tr>`
        })
        document.getElementById('users-table-body').innerHTML = html
    } catch (e) {
        console.log(e)
    }



}
readData()

const browse = () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    let inputData = document.getElementById('inputData').value
    query = inputData.toString()
    page = 1
    readData()
}