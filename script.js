let entered_footings = []; // Array to store footings
let footing_schedule = []; // Array to store custom footings in a footing_schedule

// New function to load default data
function loadInitialData() {
  fetch("default_footing_list.json")
    .then((response) => response.json())
    .then((data) => loadFootingList(data))
    .catch((error) => console.error("Failed to load default footings:", error));

  fetch("default_footing_schedule.json")
    .then((response) => response.json())
    .then((data) => loadFootingSchedule(data))
    .catch((error) =>
      console.error("Failed to load default footing schedule:", error)
    );
}

// Ensure this is called when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadInitialData);

//save and load VVVVVV
function saveData(dataArray, filename) {
  const dataStr = JSON.stringify(dataArray);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

function loadData(filename, callback) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target.result);
      callback(data);
    };
    reader.readAsText(file);
  };
  input.click();
}

function loadFootingList(data) {
  entered_footings = data;
  displayFootings();
}

function loadFootingSchedule(data) {
  footing_schedule = data;
  displayFootingSchedule();
}
//save and load AAAAAA

function addScheduleFooting() {
  const name_schedule = document.getElementById("schedule_footing_name").value; // Changed from name_schedule to name
  const width = parseFloat(
    document.getElementById("schedule_footing_width").value
  ); // Ensure width is a number
  const length = parseFloat(
    document.getElementById("schedule_footing_length").value
  ); // Ensure length is a number

  if (!name_schedule || width <= 0 || length <= 0) {
    alert("Please fill in all fields with valid values.");
    return;
  }

  const area = width * length; // Calculate the area here before using it
  const scheduleFooting = { name_schedule, width, length, area }; // Use name instead of name_schedule
  footing_schedule.push(scheduleFooting);
  displayFootingSchedule();
}

function displayFootingSchedule() {
  const list = document.getElementById("footingSchedule");
  list.innerHTML = ""; // Clear the list before repopulating

  footing_schedule.forEach((footing, index) => {
    const li = document.createElement("li");
    li.innerHTML =
      `<div class="footing-item">${footing.name_schedule}</div>` +
      `<div class="footing-item">${footing.width}</div>` +
      `<div class="footing-item">${footing.length}</div>` +
      `<div class="footing-item">${footing.area.toFixed(1)} </div>` + // Display the calculated area
      `<div class="footing-item"><button onclick="deleteScheduleFooting(${index})">Delete</button></div>`;
    list.appendChild(li);
  });
}

function deleteScheduleFooting(index) {
  footing_schedule.splice(index, 1);
  displayFootingSchedule();
}

let sortOrder = {
  name: "asc",
  size: "asc",
  type: "asc",
  soil_resistance: "asc",
  compression: "asc",
  //for Schedule Footing Types
  name_schedule: "asc",
  width: "asc",
  length: "asc",
  area: "asc",
};

function calculateFootingSize() {
  const footingName = document.getElementById("Footing_Name").value;
  const compressionLbs = parseFloat(
    document.getElementById("Compression_lbs").value
  );
  const soilResistancePsf = parseFloat(
    document.getElementById("soil_resistance_psf").value
  );

  if (compressionLbs <= 0 || soilResistancePsf <= 0) {
    alert("Please enter valid positive numbers.");
    return;
  }

  // Calculate the minimum required footing area
  const requiredArea = compressionLbs / soilResistancePsf;

  // Determine the smallest adequate Schedule footing
  const suitableFooting = findSuitableFooting(requiredArea);

  // Display the result
  const resultDiv = document.getElementById("result");
  if (suitableFooting) {
    resultDiv.innerText = `Minimum required footing area: ${requiredArea.toFixed(
      1
    )} sqft\nSuitable footing: ${
      suitableFooting.name_schedule
    }, Area: ${suitableFooting.area.toFixed(1)} sqft`;
  } else {
    resultDiv.innerText = "No suitable footing found.";
  }
}

// Helper function to find a suitable footing
function findSuitableFooting(requiredArea) {
  let suitableFooting = null;

  for (const footing of footing_schedule) {
    if (footing.area >= requiredArea) {
      if (!suitableFooting || footing.area < suitableFooting.area) {
        suitableFooting = footing;
      }
    }
  }

  return suitableFooting;
}

function addFooting() {
  const Footing_Name = document.getElementById("Footing_Name").value;
  const Compression_lbs = parseFloat(
    document.getElementById("Compression_lbs").value
  );
  const soil_resistance_psf = parseFloat(
    document.getElementById("soil_resistance_psf").value
  );

  if (!Footing_Name || Compression_lbs <= 0 || soil_resistance_psf <= 0) {
    alert("Please fill in all fields with valid values.");
    return;
  }

  const requiredArea = Compression_lbs / soil_resistance_psf;
  const suitableFooting = findSuitableFooting(requiredArea);

  // Check if a suitable footing was found and use its name or a default message
  const footingType = suitableFooting
    ? suitableFooting.name_schedule
    : "No suitable type";

  const footing = {
    name: Footing_Name,
    size: requiredArea,
    type: footingType,
    soil_resistance: soil_resistance_psf,
    compression: Compression_lbs,
  };

  entered_footings.push(footing);
  displayFootings(); // Refresh the list with new data
}

function displayFootings() {
  const footingList = document.getElementById("footingList");
  footingList.innerHTML = "";

  entered_footings.forEach((footing, index) => {
    const li = document.createElement("li");
    li.innerHTML =
      `<div class="footing-item">${footing.name}</div>` +
      `<div class="footing-item">${Number(footing.size).toFixed(1)}</div>` +
      `<div class="footing-item">${footing.type}</div>` +
      `<div class="footing-item">${footing.soil_resistance} </div>` +
      `<div class="footing-item">${footing.compression}</div>` +
      `<div class="footing-item"><button onclick="deleteFooting(${index})">Delete</button></div>`;
    footingList.appendChild(li);
  });
}

function deleteFooting(index) {
  entered_footings.splice(index, 1);
  displayFootings(); // Refresh the list after deletion
}

function clearAllFootings() {
  entered_footings = [];
  displayFootings(); // Clear and update the display
}

//print VVVVVVVVVVVVVVVVVVVVVVVVVVVV

function printFootings() {
  const printWindow = window.open("", "", "height=600,width=800");

  const styles = `
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #fff;
              margin: 20px;
              padding: 0;
          }
          .footingContainer {
              border-top: 1px solid #ddd;
              margin-top: 20px;
          }
          .footingHeadings {
              display: flex;
              background-color: #f8f9fa;
              border-bottom: 1px solid #ddd;
              padding: 10px;
              font-weight: bold;
          }
          .footing-heading {
              flex: 1;
              text-align: center;
          }
          .footingList {
              list-style: none;
              padding: 0;
              margin: 0;
          }
          .footingList li {
              display: flex;
              padding: 10px;
              border-bottom: 1px solid #ddd;
          }
          .footing-item {
              flex: 1;
              text-align: center;
          }
      </style>
  `;

  let content = `
      <html>
      <head>
          <title>Footing List</title>
          ${styles}
      </head>
      <body>
          <h2>Footing List</h2>
          <div class="footingContainer">
              <div class="footingHeadings">
                  <div class="footing-heading">Footing Name</div>
                  <div class="footing-heading">Min Size (sqft)</div>
                  <div class="footing-heading">Type</div>
                  <div class="footing-heading">Soil Resistance (psf)</div>
                  <div class="footing-heading">Compression (lbs)</div>
              </div>
              <ul class="footingList">
  `;

  // Loop through footings and add each to the print content
  entered_footings.forEach((footing) => {
    content += `
          <li>
              <div class="footing-item">${footing.name}</div>
              <div class="footing-item">${footing.size}</div>
              <div class="footing-item">${footing.type}</div>
              <div class="footing-item">${footing.soil_resistance}</div>
              <div class="footing-item">${footing.compression}</div>
          </li>
      `;
  });

  content += `
              </ul>
          </div>
      </body>
      </html>
  `;

  // Write the content to the new window and print
  printWindow.document.write(content);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

//sort VVVVVVVVVVVVVVVVVVVVVVVVVVVV

function sortFootings(attribute) {
  const order = sortOrder[attribute] === "asc" ? 1 : -1;
  entered_footings.sort((a, b) => {
    if (a[attribute] < b[attribute]) return -order;
    if (a[attribute] > b[attribute]) return order;
    return 0;
  });

  sortOrder[attribute] = sortOrder[attribute] === "asc" ? "desc" : "asc";

  displayFootings();
}

let sortOrderForSchedule = {
  //for Schedule Footing Types
  name_schedule: "asc",
  width: "asc",
  length: "asc",
  area: "asc",
};

function sortFootingSchedule(attribute) {
  const order = sortOrderForSchedule[attribute] === "asc" ? 1 : -1;
  footing_schedule.sort((a, b) => {
    if (a[attribute] < b[attribute]) return -order;
    if (a[attribute] > b[attribute]) return order;
    return 0;
  });

  sortOrderForSchedule[attribute] =
    sortOrderForSchedule[attribute] === "asc" ? "desc" : "asc";

  displayFootingSchedule();
}
