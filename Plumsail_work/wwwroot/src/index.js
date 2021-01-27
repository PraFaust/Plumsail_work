﻿
// список заголовков таблицы
let BDFields = new Set();
let users;

async function GetAllUsers() {
    console.log(`...`)

    const response = await fetch("/api/usersearch", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (response.ok === true) {
        users = await response.json();
        BDFieldsCreate(users);
        console.log("GetAllUsers() success...");
    }
}
// Получение одного пользователя
async function GetUser(id) {
    const response = await fetch("/api/usersearch/" + id, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        const form = document.forms["userForm"];
        form.elements["id"].value = user.id;
        form.elements["name"].value = user.name;
        form.elements["age"].value = user.age;
    }
}
// Добавление пользователя
async function CreateUser(userName, userAge) {

    const response = await fetch("api/usersearch", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tbody").append(rowAdd(user));
    }
}
// Изменение пользователя
async function EditUser(userId, userName, userAge) {
    const response = await fetch("api/usersearch", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: parseInt(userId, 10),
            name: userName,
            age: parseInt(userAge, 10)
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        reset();
        document.querySelector("tr[data-rowid='" + user.id + "']").replaceWith(rowAdd(user));
    }
}
// Удаление пользователя
async function DeleteUser(id) {
    const response = await fetch("/api/usersearch/" + id, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector("tr[data-rowid='" + user.id + "']").remove();
    }
}

// сброс формы
function reset() {
    const form = document.forms["userForm"];
    form.reset();
}

// поиск по фмльтру
async function search() {
    var filter = new Object();
    const form = document.forms["userForm"];
    for (field of BDFields) {
        filter[field] = form.elements[field].value;
    }

    ClearTable();
    await GetAllUsers();
    CreateTable(filter);
}

async function update() {
    reset();
    await GetAllUsers();
    CreateTable();
}

function BDFieldsCreate(users) {
    users.forEach(user => {
        for (field in user) {
            BDFields.add(field);
        }
    });
    console.log(`BDFields: `);
    console.table(BDFields);

}

function headAdd(field) {
    
    let th = document.createElement("th");
    th.append(field);

    return th;
}

// table row create
function rowAdd(user) {

    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user.id);
    let data = new Object();
    for (field in user) {
        data[field] = user[field];
        let fieldTd = document.createElement("td");
        fieldTd.append(data[field]);
        tr.append(fieldTd);
    }

    const linksTd = document.createElement("td");

    const editLink = document.createElement("a");
    editLink.setAttribute("data-id", user.id);
    editLink.setAttribute("style", "cursor:pointer;padding:15px;");
    editLink.append("Изменить");
    editLink.addEventListener("click", e => {

        e.preventDefault();
        GetUser(user.id);
    });
    linksTd.append(editLink);

    const removeLink = document.createElement("a");
    removeLink.setAttribute("data-id", user.id);
    removeLink.setAttribute("style", "cursor:pointer;padding:15px;");
    removeLink.append("Удалить");
    removeLink.addEventListener("click", e => {

        e.preventDefault();
        DeleteUser(user.id);
    });

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    tBody.append(tr);
    // создаем ссылку на существующий элемент который будем заменять
    var tr2 = document.querySelector("tr[data-rowid='" + user.id + "']");
    var parentTr = tr2.parentNode;
    // заменяем существующий элемент sp2 на созданный нами sp1
    parentTr.replaceChild(tr, tr2);
}

function ClearTable() {
   /* var body = document.getElementById("tBody");
    body.children.remove();*/
    var table = document.getElementById("tBody");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
}

function CreateTable(filter) {
    // Create Head
    var tHead = document.querySelector("thead");
    const tr = document.createElement("tr");
    //tr.setAttribute("id", "headContent");
    BDFields.forEach(field => {
        tr.append(headAdd(field));
    });
    tr.append(headAdd("actions"));
    tHead.append(tr);
    // создаем ссылку на существующий элемент который будем заменять
    var tr2 = document.querySelector("tr");
    var parentTr = tr2.parentNode;
    // заменяем существующий элемент sp2 на созданный нами sp1
    parentTr.replaceChild(tr, tr2);

    console.log(`CreateTable()...`);
    // Create Body
    users.forEach(user => {
        if (filter) {
            console.log(`...filter...`);
            console.dir(filter);
            var keys = Object.keys(user);
            console.log(keys);
            for (let i = 0; i < keys.length; i++) {
                console.log(`keys[i] = ${keys[i]}`);
                console.log(`user.keys[i] = ${user[keys[i]]}`);
                console.log(`filter.keys[i] = ${filter[keys[i]]}`);
                if (user[keys[i]] === filter[keys[i]]) {
                    console.log(`...filter match...`);
                    rowAdd(user);
                }
            }

        } else {
            console.log(`...no filter`);
            rowAdd(user);
        }
    });
}

function formCreate() {
    let counterFields = 0;
    let divRow;
    let userForm = document.querySelector("form");
    for (val of BDFields) {
        if (counterFields % 2 === 0) {
            divRow = document.createElement('div');
            divRow.className = 'row';
            let divCol = document.createElement('div');
            divCol.className = 'col'

            let div = document.createElement('div');
            div.className = 'form-group';
            let label = document.createElement('label');
            label.innerHTML = val + ':';
            label.for = val;
            let input = document.createElement('input');
            input.className = 'form-control';
            input.name = val

            div.appendChild(label);
            div.appendChild(input);
            divCol.appendChild(div)
            divRow.appendChild(divCol);
        } else {
            let divCol = document.createElement('div');
            divCol.className = 'col'

            let div = document.createElement('div');
            div.className = 'form-group';
            let label = document.createElement('label');
            label.innerHTML = val + ':';
            label.for = val;
            let input = document.createElement('input');
            input.className = 'form-control';
            input.name = val

            div.appendChild(label);
            div.appendChild(input);
            divCol.appendChild(div)
            divRow.appendChild(divCol);
        }
        counterFields += 1;

        userForm.appendChild(divRow);      
    }


}

// альтернатива событию load
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        console.log("Ready...");

        await GetAllUsers();
        formCreate();
        CreateTable();
    }
}




