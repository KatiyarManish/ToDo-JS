// get elements

const inputBox = document.querySelector(".input");
const submitBtn = document.querySelector(".addButton");
const mainContainer = document.querySelector(".main-container");

const clearallBtn = document.querySelector(".clearbtn");
const alert = document.querySelector(".alert");

// Edit Items varaibles===========================
let editId = "";
let editElement;
let editFlag = false;

// event listeners=====================================
submitBtn.addEventListener("click", addItem);
clearallBtn.addEventListener("click", clearItems);

// functions============================================
function addItem(e) {
  e.preventDefault();
  const value = inputBox.value;
  const id = new Date().getTime().toString();
  if (value !== "" && editFlag === false) {
    // create element
    const element = document.createElement("div");
    // add class
    element.classList.add("container");
    // add id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `
    <div class="itemtext">${value}</div>
    <div class="btn-container">
      <button type="button" class="editbtn">EDIT</button>
      <button type="button" class="deletebtn">DELETE</button>
    </div>
    `;
    // edit and delete event listeners
    const editBtn = element.querySelector(".editbtn");
    const deleteBtn = element.querySelector(".deletebtn");
    editBtn.addEventListener("click", editItem);
    deleteBtn.addEventListener("click", deleteItem);
    // end

    mainContainer.appendChild(element);
    displayAlert("item added in the list", "success");
    mainContainer.classList.add("show-main-container");
    // add to local storage
    addToLocalStorage(id, value);
    // set form back to default
    setToDefault();
  } else if (value !== "" && editFlag === true) {
    editElement.innerHTML = value;
    displayAlert("value updated", "success");
    editToLocalStorage(editId, value);
    setToDefault();
  } else {
    displayAlert("Please enter value", "danger");
  }
}

// Alert Function

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);
  // remove alert
  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 1000);
}

// local storage -add

function addToLocalStorage(id, value) {
  const localDB = { id: id, value: value };
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items.push(localDB);
  localStorage.setItem("list", JSON.stringify(items));
}

// local storage -remove
function removeFromLocalStorage(id) {
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}
// local storage -edit
function editToLocalStorage(id, value) {
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });

  localStorage.setItem("list", JSON.stringify(items));
}

// set form back to default

function setToDefault() {
  inputBox.value = "";
  editFlag = false;
  editId = "";
  submitBtn.innerHTML = `<i class="fas fa-plus"></i>`;
}

// ClearItems

function clearItems() {
  const items = document.querySelectorAll(".container");
  if (items.length > 0) {
    items.forEach(function (item) {
      mainContainer.removeChild(item);
    });
  }
  mainContainer.classList.remove("show-main-container");
  setToDefault();
  localStorage.removeItem("list");
}

// edii Item

function editItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  inputBox.value = editElement.innerHTML;
  editId = element.dataset.id;
  editFlag = true;
  submitBtn.textContent = "Edit";
}

// Delete item

function deleteItem(e) {
  const element = e.currentTarget.parentElement.parentElement;
  id = element.dataset.id;
  mainContainer.removeChild(element);
  if (mainContainer.children.length === 1) {
    mainContainer.classList.remove("show-main-container");
  }
  displayAlert("item deleted", "success");
  removeFromLocalStorage(id);
  setToDefault();
}

// get items

window.addEventListener("DOMContentLoaded", getItems);

function getItems() {
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  if (items.length > 0) {
    items.forEach(function (item) {
      // create element
      const element = document.createElement("div");
      // add class
      element.classList.add("container");
      // add id
      const attr = document.createAttribute("data-id");
      attr.value = item.id;
      element.setAttributeNode(attr);
      element.innerHTML = `
    <div class="itemtext">${item.value}</div>
    <div class="btn-container">
      <button type="button" class="editbtn">EDIT</button>
      <button type="button" class="deletebtn">DELETE</button>
    </div>
    `;
      // edit and delete event listeners
      const editBtn = element.querySelector(".editbtn");
      const deleteBtn = element.querySelector(".deletebtn");
      editBtn.addEventListener("click", editItem);
      deleteBtn.addEventListener("click", deleteItem);
      // end

      mainContainer.appendChild(element);
    });
    mainContainer.classList.add("show-main-container");
  }
}
