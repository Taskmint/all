


    let db;
    let userPoints = 0;
    let adNetwork = ""; // Auto-detect ad network

    function openDB() {
        let request = indexedDB.open("SpinRewardDB", 1);

        request.onupgradeneeded = function(event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("userData")) {
                db.createObjectStore("userData", { keyPath: "id" });
            }
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            loadUserPoints();
        };

        request.onerror = function(event) {
            console.log("IndexedDB error:", event.target.error);
        };
    }

    function loadUserPoints() {
        let transaction = db.transaction(["userData"], "readonly");
        let store = transaction.objectStore("userData");
        let request = store.get("userPoints");

        request.onsuccess = function() {
            if (request.result) {
                userPoints = request.result.points;
                document.getElementById("userPoints").innerText = userPoints;
            }
        };
    }

    function saveUserPoints() {
        let transaction = db.transaction(["userData"], "readwrite");
        let store = transaction.objectStore("userData");
        store.put({ id: "userPoints", points: userPoints });
    }

    document.getElementById("rewardButton").addEventListener("click", function() {
        document.getElementById("status").innerText = "Spinning...";

        setTimeout(() => {
            document.getElementById("status").innerText = "Spin Completed!";
            
            setTimeout(() => {
                showRewardedAd();
            }, 2000);

        }, 2000);
    });

    function detectAdNetwork() {
        if (typeof google !== "undefined" && google.adsense) {
            adNetwork = "AdSense";
        } else if (typeof PBJS !== "undefined") {
            adNetwork = "PropellerAds";
        } else if (typeof unityAds !== "undefined") {
            adNetwork = "UnityAds";
        }
    }

    function showRewardedAd() {
        detectAdNetwork();

        if (adNetwork === "AdSense") {
            document.getElementById("status").innerText = "Loading Google AdSense Ad...";
            google.adsense.rewarded.onAdComplete = function() {
                giveReward();
            };
            google.adsense.rewarded.requestAd();
        } 
        else if (adNetwork === "PropellerAds") {
            document.getElementById("status").innerText = "Loading PropellerAds Ad...";
            PBJS.que.push(function() {
                PBJS.loadRewardedAd({
                    onAdLoaded: function() {
                        document.getElementById("status").innerText = "Ad Loaded. Watching now...";
                        PBJS.showRewardedAd({
                            onComplete: function() {
                                giveReward();
                            },
                            onError: function() {
                                document.getElementById("status").innerText = "Ad failed to load. Try again later.";
                            }
                        });
                    },
                    onError: function() {
                        document.getElementById("status").innerText = "No ads available. Come back later.";
                    }
                });
            });
        } 
        else if (adNetwork === "UnityAds") {
            document.getElementById("status").innerText = "Loading Unity Ads...";
            unityAds.showRewardedAd({
                onComplete: function() {
                    giveReward();
                },
                onError: function() {
                    document.getElementById("status").innerText = "Ad failed to load.";
                }
            });
        } 
        else {
            document.getElementById("status").innerText = "No ads available right now. Try again later.";
        }
    }

    function giveReward() {
        userPoints += 10;
        document.getElementById("userPoints").innerText = userPoints;
        saveUserPoints();
        document.getElementById("status").innerText = "You earned 10 points!";
    }

    openDB();



