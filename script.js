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

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
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

  // Progress Column
  progressList.textContent = ""; // remove template strings
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 0, progressItem, index);
  });

  // Complete Column
  completeList.textContent = ""; // remove template strings
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 0, completeItem, index);
  });

  // On Hold Column
  onHoldList.textContent = ""; // remove template strings
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 0, onHoldItem, index);
  });

  // Run getSavedColumns only once, Update Local Storage
}

// when Item starts dragging
function drag(e) {
  draggedItem = e.target;
  console.log(draggedItem);
}

// column allows for Item to drop https://www.w3schools.com/html/html5_draganddrop.asp
function allowDrop(e) {
  e.preventDefault();
}

// when item enters to column area
function dragEnter(column) {
  console.log(listColumns[column]);
}

// dropping item in the column
function drop(e) {
  e.preventDefault();
}

// On Load
updateDOM();
