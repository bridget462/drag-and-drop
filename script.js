const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false; // to only load local storage once

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = []; // store saved lists

// Drag Functionality
let draggedItem;
let dragging = false;
// TODO make these private variable using closure
let currentColumn;
let previousColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = [`backlog`, `progress`, `complete`, `onHold`];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// filter arrays to remove null
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);

  // adding close btn https://www.w3schools.com/howto/howto_js_close_list_items.asp
  const closeBtn = document.createElement("i");
  // closeBtn.textContent = "x";
  closeBtn.classList.add("close");
  closeBtn.classList.add("far");
  closeBtn.classList.add("fa-times-circle");
  closeBtn.contentEditable = false;
  closeBtn.setAttribute("onclick", `deleteItem(${index}, ${column})`);
  listEl.appendChild(closeBtn);

  // Append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (updatedOnLoad === false) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = ""; // remove template strings
  backlogListArray.forEach((backLogItem, index) => {
    createItemEl(backlogList, 0, backLogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = ""; // remove template strings
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = ""; // remove template strings
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = ""; // remove template strings
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function deleteItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    selectedColumnEl[id].textContent = "";
    delete selectedArray[id];
    updateDOM();
  }
}

// update item value or delete if empty
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    console.log(selectedArray);
    updateDOM();
  }
}

// add item to the column list, and reset the text box for next time
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

// show add item input box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// hide item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}

// allows arrays to reflect drag and rop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map(
    (item) => item.textContent
  );
  progressListArray = Array.from(progressList.children).map(
    (item) => item.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (item) => item.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map(
    (item) => item.textContent
  );

  updateDOM();
}

// when Item starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// column allows for Item to drop https://www.w3schools.com/html/html5_draganddrop.asp
function allowDrop(e) {
  e.preventDefault();
}

// when item enters to column area
function dragEnter(column) {
  currentColumn = column;
  listColumns[column].classList.add("over");
  // to only highlight selected column
  if (previousColumn !== undefined && currentColumn !== previousColumn) {
    listColumns[previousColumn].classList.remove("over");
  }
  previousColumn = currentColumn;
}

// dropping item in the column
function drop(e) {
  e.preventDefault();
  // remove background color padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // add item to the column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();
