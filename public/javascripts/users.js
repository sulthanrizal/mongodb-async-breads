

//variable
let id = null, conditional = null, page = 1, query = '', limit = 5, sortBy = '_id', sortMode = 'desc'

// support fungsi

function getId(_id) {
    id = _id
}

let button = document.getElementById('mybutton')
button.onclick = () => {
    conditional ? addData : editData()
}

let addButton = document.getElementById('addButton')
addButton.onclick = () => {
    conditional = true
    const name = document.getElementById('name').value = ""
    const phone = document.getElementById('phone').value = ""
}

const browse = () => {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    let inputData = document.getElementById('inputData').value

    document.getElementById('inputData').addEventListener('submit', (event) => {
        event.preventDefault()
    })
    query = inputData.toString()
    page = 1
    readData()
}

const clear = () => {
    query = document.getElementById('inputData').value
    readData()
}

const readData = async function () {
    try {
        let pagination = ''
        let pageNumber = ''
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
                 <button class="btn btn-success" onclick="getoneData('${item._id}')" type="button"><i class="fa-solid fa-pen"></i></button>
                 <button class="btn btn-danger" onclick="getId('${item._id}')" style="color:white;"><i class="fa-solid fa-trash"></i></button>
                 <a href="/users/${item._id}/todos" class="btn btn-warning"><i class="fa-solid fa-right-to-bracket"></i></a>
                 </td>
                 <%=console.log(${total})%>
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
            pagination += ``
        }
        document.getElementById('users-table-body').innerHTML = html
    } catch (e) {
        console.log(e)
    }



}
readData()

