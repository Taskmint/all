let startTime = parseInt(localStorage.getItem("startTime")) || Date.now(); // Get stored start time or set a new one
    let elapsedTime = parseInt(localStorage.getItem("elapsedTime")) || 0; // Get stored elapsed time
    const maxTime = 3600; // 1 hour in seconds
    const maxPoints = 1.00;
    let isNotified = false;
    let interval;
    let isTracking = false; // Track whether timer is running
    
    // Function to calculate elapsed time
    function updateTimeAndPoints() {
        if (!isTracking) return; // Stop updating if tracking is paused
    
        let currentTime = Date.now();
        elapsedTime = Math.floor((currentTime - startTime) / 1000); // Convert to seconds
        localStorage.setItem("elapsedTime", elapsedTime); // Save elapsed time
    
        let earnedPoints = (elapsedTime / maxTime) * maxPoints; // Calculate points
    
        // Update UI
        document.getElementById("timeTracker").innerText = `⏳ Time Spent: ${elapsedTime}s`;
        document.getElementById("pointsTracker").innerText = `💰 Points: $${earnedPoints.toFixed(2)}`;
    
        // Notify user when they reach 1 hour
        if (elapsedTime >= maxTime && !isNotified) {
            isNotified = true;
            showNotification();
            resetProgress();
        }
    }
    
    // Function to reset progress after 1 hour
    function resetProgress() {
        localStorage.removeItem("startTime");
        localStorage.removeItem("elapsedTime");
        startTime = Date.now();
        elapsedTime = 0;
    }
    
    // Function to show browser notification
    function showNotification() {
        if (Notification.permission === "granted") {
            new Notification("🎉 Congrats!", {
                body: "You've earned $1 for staying active for 1 hour!",
                icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            });
        } else {
            alert("🎉 Congrats! You've earned $1 for staying active for 1 hour!");
        }
    }
    
    // Start tracking time only when the user is on the page
    function startTracking() {
        if (!interval) {
            interval = setInterval(updateTimeAndPoints, 1000);
        }
        isTracking = true; // Set tracking to true
    }
    
    // Stop tracking when the user leaves
    function stopTracking() {
        clearInterval(interval);
        interval = null;
        isTracking = false; // Set tracking to false
    }
    
    // Detect if the user is active or not (tab change or minimize)
    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "visible") {
            startTime = Date.now() - elapsedTime * 1000; // Adjust start time to resume correctly
            startTracking();
        } else {
            stopTracking();
        }
    });
    
    // Request notification permission
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    
    // Store start time if not already set
    if (!localStorage.getItem("startTime")) {
        localStorage.setItem("startTime", startTime);
    }
    
    // Start tracking when the page loads
    startTracking();