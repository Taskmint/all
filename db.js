let db;
let userPoints = 0;

function openDB(callback) {
    let request = indexedDB.open("SpinRewardDB", 1);

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("userData")) {
            db.createObjectStore("userData", { keyPath: "id" });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("Database opened successfully.");

        loadUserPoints((points) => {
            userPoints = points;
            updateDisplay(userPoints);
            if (callback) callback();
        });
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.error);
    };
}

function loadUserPoints(callback) {
    if (!db) {
        console.error("Database not initialized yet.");
        return;
    }

    let transaction = db.transaction(["userData"], "readonly");
    let store = transaction.objectStore("userData");
    let request = store.get("userPoints");

    request.onsuccess = function () {
        if (request.result) {
            userPoints = Number(request.result.points) || 0;
        } else {
            userPoints = 0;
            saveUserPoints(userPoints);
        }
        console.log("Loaded user points:", userPoints);
        callback(userPoints);
    };

    request.onerror = function () {
        console.error("Error retrieving user points.");
        callback(0);
    };
}

function saveUserPoints(newPoints) {
    if (!db) {
        console.error("Database not initialized yet.");
        return;
    }

    userPoints = Number(newPoints);
    if (isNaN(userPoints)) {
        console.error("Invalid points value, not saving.");
        return;
    }

    let transaction = db.transaction(["userData"], "readwrite");
    let store = transaction.objectStore("userData");

    let request = store.put({ id: "userPoints", points: userPoints });

    request.onsuccess = function () {
        updateDisplay(userPoints);
        console.log("User points saved:", userPoints);
    };

    request.onerror = function () {
        console.error("Error saving user points.");
    };
}

function addPoints(amount) {
    userPoints += amount;
    saveUserPoints(userPoints);
}

function startGameIntervals() {
    console.log("addPoints exists?", typeof addPoints === "function"); // Debugging line
    addPoints(10);
}

function updateDisplay(points) {
    document.getElementById("displayPoints").innerText = points ?? 0;
}

// Open database on page load
openDB();

// Start game (example usage)
setTimeout(startGameIntervals, 3600000); // 1 hour = 3600000 milliseconds



