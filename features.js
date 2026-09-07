/* ============================================================
   SKILLTUBE
   COMPLETE FRONTEND JAVASCRIPT
   ============================================================ */


/* ============================================================
   1. APPLICATION DATA
   ============================================================ */

const videos = [
    {
        id: 1,
        title: "Stop Memorizing Python. Start Thinking Like a Programmer.",
        creator: "CodeMaster",
        skill: "Python",
        views: 245000,
        age: "2 days ago",
        duration: "18:42",
        description:
            "Learn how to build programming logic instead of simply memorizing Python syntax.",
        category: "Programming",
        challenge:
            "Explain in your own words why logic building is more important than memorizing syntax.",
        videoUrl: ""
    },

    {
        id: 2,
        title: "Sliding Window Explained Through Real Problems",
        creator: "AlgoMaster",
        skill: "DSA",
        views: 180000,
        age: "5 days ago",
        duration: "24:15",
        description:
            "Understand the sliding window pattern through practical coding problems.",
        category: "DSA",
        challenge:
            "When is the sliding window technique useful?",
        videoUrl: ""
    },

    {
        id: 3,
        title: "How AI Engineers Actually Build AI Applications",
        creator: "AI Labs",
        skill: "AI",
        views: 520000,
        age: "1 week ago",
        duration: "31:20",
        description:
            "A practical introduction to how modern AI engineers build real-world AI applications.",
        category: "Artificial Intelligence",
        challenge:
            "Describe the major components of a modern AI application.",
        videoUrl: ""
    },

    {
        id: 4,
        title: "SQL Queries You Should Know Before Your First Job",
        creator: "Data Academy",
        skill: "SQL",
        views: 95000,
        age: "3 days ago",
        duration: "15:30",
        description:
            "Master the SQL queries commonly used in data analyst and software engineering interviews.",
        category: "Database",
        challenge:
            "Explain the difference between WHERE and HAVING.",
        videoUrl: ""
    },

    {
        id: 5,
        title: "Build a Full Website From Scratch",
        creator: "WebDev Pro",
        skill: "Web Development",
        views: 310000,
        age: "4 days ago",
        duration: "42:18",
        description:
            "Build a complete website from HTML to JavaScript.",
        category: "Web Development",
        challenge:
            "Explain the roles of HTML, CSS and JavaScript in a website.",
        videoUrl: ""
    },

    {
        id: 6,
        title: "Machine Learning Explained Without Mathematics",
        creator: "ML Simplified",
        skill: "AI",
        views: 400000,
        age: "2 weeks ago",
        duration: "27:45",
        description:
            "Understand the fundamental concepts of machine learning in simple language.",
        category: "Machine Learning",
        challenge:
            "Explain what machine learning means in your own words.",
        videoUrl: ""
    }
];


/* ============================================================
   2. APPLICATION STATE
   ============================================================ */

let currentVideo = null;

let currentUser = {
    name: "Saketh",
    streak: 7,
    learningTime: 1122
};

let watchHistory = loadData("watchHistory", []);

let watchLater = loadData("watchLater", []);

let learningVideos = loadData("learningVideos", []);

let likedVideos = loadData("likedVideos", []);

let dislikedVideos = loadData("dislikedVideos", []);

let subscriptions = loadData("subscriptions", []);

let comments = loadData("comments", {});

let notes = loadData("notes", {});

let completedChallenges =
    loadData("completedChallenges", []);

let videoProgress =
    loadData("videoProgress", {});

let customVideos =
    loadData("customVideos", []);

let skillProgress =
    loadData(
        "skillProgress",
        {
            Python: 65,
            DSA: 45,
            AI: 32,
            SQL: 55,
            "Web Development": 20
        }
    );


/* ============================================================
   3. LOCAL STORAGE HELPERS
   ============================================================ */

function loadData(key, defaultValue) {

    try {

        const stored =
            localStorage.getItem(
                "skilltube_" + key
            );

        if (stored === null) {

            return defaultValue;

        }

        return JSON.parse(stored);

    } catch (error) {

        console.error(
            "Could not load:",
            key,
            error
        );

        return defaultValue;

    }
}


function saveData(key, value) {

    localStorage.setItem(
        "skilltube_" + key,
        JSON.stringify(value)
    );

}


/* ============================================================
   4. INITIALIZATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);


function initializeApp() {

    renderVideos();

    updateDailyProgress();

    updateLearningList();

    updateWatchLater();

    updateHistory();

    updateStreak();

    setupVideoProgressTracking();

    setupKeyboardShortcuts();

    loadSavedNotes();

    updateProfileStats();

    showHome();

}


/* ============================================================
   5. PAGE MANAGEMENT
   ============================================================ */

const pageIds = [
    "mainContent",
    "watchPage",
    "learningPage",
    "historyPage",
    "watchLaterPage",
    "notificationPage",
    "profilePage",
    "createPage"
];


function hideAllPages() {

    pageIds.forEach(function(id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.hidden = true;

        }

    });

}


function showHome() {

    hideAllPages();

    const main =
        document.getElementById(
            "mainContent"
        );

    if (main) {

        main.hidden = false;

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function showPage(id) {

    hideAllPages();

    const page =
        document.getElementById(id);

    if (page) {

        page.hidden = false;

    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   6. VIDEO RENDERING
   ============================================================ */

function getAllVideos() {

    return [
        ...videos,
        ...customVideos
    ];

}


function renderVideos(videoList = getAllVideos()) {

    const container =
        document.getElementById(
            "videoContainer"
        );

    if (!container) {

        return;

    }

    container.innerHTML = "";

    if (videoList.length === 0) {

        container.innerHTML = `
            <section>
                <h3>No videos found.</h3>
                <p>Try searching for another topic.</p>
            </section>
        `;

        return;

    }

    videoList.forEach(function(video) {

        const card =
            createVideoCard(video);

        container.appendChild(card);

    });

}


function createVideoCard(video) {

    const article =
        document.createElement("article");

    article.className = "video-card";

    const liked =
        likedVideos.includes(video.id);

    const saved =
        watchLater.includes(video.id);

    const learning =
        learningVideos.includes(video.id);

    article.innerHTML = `

        <figure>

            <video
                width="320"
                height="180"
                preload="metadata"
                ${video.videoUrl ? "" : "controls"}
            >

                ${
                    video.videoUrl
                    ?
                    `<source
                        src="${video.videoUrl}"
                        type="video/mp4">`
                    :
                    ""
                }

            </video>

            <figcaption>
                ${escapeHTML(video.title)}
            </figcaption>

        </figure>

        <h3>
            ${escapeHTML(video.title)}
        </h3>

        <p>
            ${escapeHTML(video.creator)}
        </p>

        <p>
            ${formatViews(video.views)}
            views • ${video.age}
        </p>

        <p>
            🏷️ ${escapeHTML(video.skill)}
        </p>

        <button
            data-action="watch"
            data-id="${video.id}">
            ▶ Watch
        </button>

        <button
            data-action="save"
            data-id="${video.id}">
            ${saved ? "✓ Saved" : "📌 Save"}
        </button>

        <button
            data-action="learning"
            data-id="${video.id}">
            ${learning ? "✓ Learning" : "🧠 Learn"}
        </button>

    `;


    article
        .querySelectorAll("button")
        .forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const action =
                        button.dataset.action;

                    const id =
                        Number(
                            button.dataset.id
                        );

                    if (action === "watch") {

                        openVideo(id);

                    }

                    if (action === "save") {

                        toggleWatchLater(id);

                    }

                    if (action === "learning") {

                        toggleLearningVideo(id);

                    }

                }
            );

        });


    const videoElement =
        article.querySelector("video");

    if (videoElement) {

        videoElement.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                openVideo(video.id);

            }
        );

    }


    return article;

}


/* ============================================================
   7. OPEN VIDEO
   ============================================================ */

function openVideo(videoId) {

    const video =
        getAllVideos().find(
            function(item) {

                return item.id === videoId;

            }
        );

    if (!video) {

        showToast(
            "Video not found."
        );

        return;

    }

    currentVideo = video;

    addToHistory(video.id);

    hideAllPages();

    const page =
        document.getElementById(
            "watchPage"
        );

    page.hidden = false;

    document.getElementById(
        "watchTitle"
    ).textContent = video.title;

    document.getElementById(
        "watchCreator"
    ).textContent =
        `${video.creator} • Skill: ${video.skill}`;


    const mainVideo =
        document.getElementById(
            "mainVideo"
        );


    if (video.videoUrl) {

        mainVideo.src =
            video.videoUrl;

        mainVideo.controls = true;

    } else {

        mainVideo.removeAttribute(
            "src"
        );

    }


    renderWatchButtons();

    renderComments();

    loadSavedNotes();

    setupChallenge();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   8. WATCH BUTTON STATE
   ============================================================ */

function renderWatchButtons() {

    const buttons =
        document.querySelectorAll(
            "#watchPage section button"
        );

    buttons.forEach(function(button) {

        const text =
            button.textContent;

        if (
            text.includes("Like")
        ) {

            button.textContent =
                likedVideos.includes(
                    currentVideo.id
                )
                ?
                "👍 Liked"
                :
                "👍 Like";

        }

        if (
            text.includes("Dislike")
        ) {

            button.textContent =
                dislikedVideos.includes(
                    currentVideo.id
                )
                ?
                "👎 Disliked"
                :
                "👎 Dislike";

        }

    });

}


/* ============================================================
   9. LIKE VIDEO
   ============================================================ */

function likeVideo() {

    if (!currentVideo) {

        return;

    }

    const id =
        currentVideo.id;

    const index =
        likedVideos.indexOf(id);


    if (index === -1) {

        likedVideos.push(id);

        const dislikeIndex =
            dislikedVideos.indexOf(id);

        if (dislikeIndex !== -1) {

            dislikedVideos.splice(
                dislikeIndex,
                1
            );

        }

        showToast(
            "Video liked 👍"
        );

    } else {

        likedVideos.splice(
            index,
            1
        );

        showToast(
            "Like removed"
        );

    }


    saveData(
        "likedVideos",
        likedVideos
    );

    saveData(
        "dislikedVideos",
        dislikedVideos
    );

    renderWatchButtons();

}


/* ============================================================
   10. DISLIKE VIDEO
   ============================================================ */

function dislikeVideo() {

    if (!currentVideo) {

        return;

    }

    const id =
        currentVideo.id;

    const index =
        dislikedVideos.indexOf(id);


    if (index === -1) {

        dislikedVideos.push(id);

        const likeIndex =
            likedVideos.indexOf(id);

        if (likeIndex !== -1) {

            likedVideos.splice(
                likeIndex,
                1
            );

        }

        showToast(
            "Video disliked"
        );

    } else {

        dislikedVideos.splice(
            index,
            1
        );

    }


    saveData(
        "likedVideos",
        likedVideos
    );

    saveData(
        "dislikedVideos",
        dislikedVideos
    );

    renderWatchButtons();

}


/* ============================================================
   11. WATCH LATER
   ============================================================ */

function toggleWatchLater(videoId) {

    const index =
        watchLater.indexOf(videoId);


    if (index === -1) {

        watchLater.push(videoId);

        showToast(
            "Added to Watch Later 📌"
        );

    } else {

        watchLater.splice(
            index,
            1
        );

        showToast(
            "Removed from Watch Later"
        );

    }


    saveData(
        "watchLater",
        watchLater
    );

    renderVideos();

    updateWatchLater();

}


function saveVideo(title) {

    const video =
        getAllVideos().find(
            function(item) {

                return item.title === title;

            }
        );

    if (video) {

        toggleWatchLater(
            video.id
        );

    }

}


function saveCurrentVideo() {

    if (currentVideo) {

        toggleWatchLater(
            currentVideo.id
        );

    }

}


/* ============================================================
   12. WATCH LATER PAGE
   ============================================================ */

function showWatchLater() {

    showPage(
        "watchLaterPage"
    );

    updateWatchLater();

}


function updateWatchLater() {

    const list =
        document.getElementById(
            "watchLaterList"
        );

    if (!list) {

        return;

    }

    list.innerHTML = "";


    if (watchLater.length === 0) {

        list.innerHTML = `
            <li>
                No videos saved yet.
            </li>
        `;

        return;

    }


    watchLater.forEach(function(id) {

        const video =
            getAllVideos().find(
                function(item) {

                    return item.id === id;

                }
            );

        if (!video) {

            return;

        }

        const li =
            document.createElement("li");

        li.innerHTML = `
            <strong>
                ${escapeHTML(video.title)}
            </strong>

            <br>

            <small>
                ${escapeHTML(video.creator)}
            </small>

            <br><br>

            <button>
                ▶ Watch
            </button>

            <button>
                ❌ Remove
            </button>
        `;


        const buttons =
            li.querySelectorAll(
                "button"
            );


        buttons[0].onclick =
            function() {

                openVideo(
                    video.id
                );

            };


        buttons[1].onclick =
            function() {

                toggleWatchLater(
                    video.id
                );

            };


        list.appendChild(li);

    });

}


/* ============================================================
   13. LEARNING VIDEOS
   ============================================================ */

function toggleLearningVideo(videoId) {

    const index =
        learningVideos.indexOf(
            videoId
        );


    if (index === -1) {

        learningVideos.push(
            videoId
        );

        showToast(
            "Added to Skill Journey 🧠"
        );

    } else {

        learningVideos.splice(
            index,
            1
        );

        showToast(
            "Removed from Skill Journey"
        );

    }


    saveData(
        "learningVideos",
        learningVideos
    );

    renderVideos();

    updateLearningList();

}


function addToLearning(title) {

    const video =
        getAllVideos().find(
            function(item) {

                return item.title === title;

            }
        );

    if (video) {

        if (
            !learningVideos.includes(
                video.id
            )
        ) {

            learningVideos.push(
                video.id
            );

            saveData(
                "learningVideos",
                learningVideos
            );

            updateLearningList();

            showToast(
                "Added to Skill Journey 🧠"
            );

        }

    }

}


/* ============================================================
   14. LEARNING DASHBOARD
   ============================================================ */

function showLearning() {

    showPage(
        "learningPage"
    );

    updateLearningList();

    updateSkillProgress();

    updateProfileStats();

}


function updateLearningList() {

    const list =
        document.getElementById(
            "learningList"
        );

    if (!list) {

        return;

    }

    list.innerHTML = "";


    if (learningVideos.length === 0) {

        list.innerHTML =
            "<li>No learning videos yet.</li>";

        return;

    }


    learningVideos.forEach(function(id) {

        const video =
            getAllVideos().find(
                function(item) {

                    return item.id === id;

                }
            );

        if (!video) {

            return;

        }

        const li =
            document.createElement("li");

        const progress =
            videoProgress[id] || 0;

        li.innerHTML = `

            <strong>
                ${escapeHTML(video.title)}
            </strong>

            <br>

            <small>
                ${escapeHTML(video.skill)}
            </small>

            <br>

            <progress
                value="${progress}"
                max="100">
            </progress>

            ${progress}%

            <br><br>

            <button>
                Continue
            </button>

        `;


        li.querySelector(
            "button"
        ).onclick =
            function() {

                openVideo(
                    video.id
                );

            };


        list.appendChild(li);

    });

}


/* ============================================================
   15. SKILL JOURNEY
   ============================================================ */

function openSkillJourney(skill) {

    showLearning();

    const progress =
        skillProgress[skill] || 0;

    showToast(
        `${skill}: ${progress}% completed`
    );

}


function startLearningJourney() {

    showLearning();

    showToast(
        "Your Skill Journey has started 🚀"
    );

}


/* ============================================================
   16. SKILL PROGRESS
   ============================================================ */

function updateSkillProgress() {

    const progressElements =
        document.querySelectorAll(
            "#learningPage progress"
        );

    progressElements.forEach(
        function(progress) {

            const parent =
                progress.parentElement;

            if (!parent) {

                return;

            }

        }
    );

}


/* ============================================================
   17. DAILY MISSION
   ============================================================ */

function getDailyProgress() {

    return loadData(
        "dailyProgress",
        1
    );

}


function setDailyProgress(value) {

    saveData(
        "dailyProgress",
        value
    );

}


function updateDailyProgress() {

    const progress =
        getDailyProgress();


    const progressBar =
        document.getElementById(
            "dailyProgress"
        );

    const text =
        document.getElementById(
            "dailyProgressText"
        );


    if (progressBar) {

        progressBar.value =
            progress;

    }


    if (text) {

        text.textContent =
            `${progress} / 3 completed`;

    }

}


function completeDailyMission() {

    let progress =
        getDailyProgress();


    if (progress < 3) {

        progress++;

        setDailyProgress(
            progress
        );

        updateDailyProgress();

        if (progress === 3) {

            increaseStreak();

            showToast(
                "🎉 Daily mission completed!"
            );

        } else {

            showToast(
                `Mission progress: ${progress}/3`
            );

        }

    } else {

        showToast(
            "Today's mission is already complete!"
        );

    }

}


/* ============================================================
   18. STREAK
   ============================================================ */

function increaseStreak() {

    currentUser.streak++;

    saveData(
        "streak",
        currentUser.streak
    );

    updateStreak();

}


function updateStreak() {

    const savedStreak =
        loadData(
            "streak",
            currentUser.streak
        );

    currentUser.streak =
        savedStreak;


    const streak =
        document.getElementById(
            "streak"
        );

    if (streak) {

        streak.textContent =
            `${currentUser.streak} days`;

    }

}


/* ============================================================
   19. WATCH HISTORY
   ============================================================ */

function addToHistory(videoId) {

    watchHistory =
        watchHistory.filter(
            function(id) {

                return id !== videoId;

            }
        );


    watchHistory.unshift(
        videoId
    );


    if (watchHistory.length > 50) {

        watchHistory =
            watchHistory.slice(
                0,
                50
            );

    }


    saveData(
        "watchHistory",
        watchHistory
    );

}


function showHistory() {

    showPage(
        "historyPage"
    );

    updateHistory();

}


function updateHistory() {

    const list =
        document.getElementById(
            "historyList"
        );

    if (!list) {

        return;

    }

    list.innerHTML = "";


    if (watchHistory.length === 0) {

        list.innerHTML =
            "<li>No watch history.</li>";

        return;

    }


    watchHistory.forEach(function(id) {

        const video =
            getAllVideos().find(
                function(item) {

                    return item.id === id;

                }
            );

        if (!video) {

            return;

        }

        const li =
            document.createElement("li");

        li.innerHTML = `
            <strong>
                ${escapeHTML(video.title)}
            </strong>

            <br>

            <small>
                ${escapeHTML(video.creator)}
            </small>

            <br><br>

            <button>
                Watch Again
            </button>
        `;


        li.querySelector(
            "button"
        ).onclick =
            function() {

                openVideo(
                    video.id
                );

            };


        list.appendChild(li);

    });

}


/* ============================================================
   20. SEARCH
   ============================================================ */

function searchVideos(event) {

    if (event) {

        event.preventDefault();

    }


    const input =
        document.getElementById(
            "searchInput"
        );


    if (!input) {

        return;

    }


    const query =
        input.value
            .trim()
            .toLowerCase();


    if (query === "") {

        renderVideos();

        document.getElementById(
            "sectionTitle"
        ).textContent =
            "Recommended For You";

        return;

    }


    const results =
        getAllVideos().filter(
            function(video) {

                const searchableText =
                    `
                    ${video.title}
                    ${video.creator}
                    ${video.skill}
                    ${video.category}
                    ${video.description}
                    `.toLowerCase();

                return searchableText.includes(
                    query
                );

            }
        );


    renderVideos(
        results
    );


    document.getElementById(
        "sectionTitle"
    ).textContent =
        `Search results for "${input.value}"`;

}


/* ============================================================
   21. SKILL FILTER
   ============================================================ */

function filterSkill(skill) {

    const results =
        getAllVideos().filter(
            function(video) {

                return video.skill
                    .toLowerCase()
                    .includes(
                        skill.toLowerCase()
                    );

            }
        );


    showHome();

    renderVideos(
        results
    );


    document.getElementById(
        "sectionTitle"
    ).textContent =
        `${skill} Videos`;

}


/* ============================================================
   22. TRENDING
   ============================================================ */

function showTrending() {

    const sorted =
        [...getAllVideos()]
            .sort(
                function(a, b) {

                    return b.views - a.views;

                }
            );


    showHome();

    renderVideos(
        sorted
    );


    document.getElementById(
        "sectionTitle"
    ).textContent =
        "🔥 Trending Videos";

}


/* ============================================================
   23. SUBSCRIPTIONS
   ============================================================ */

function showSubscriptions() {

    showHome();


    if (subscriptions.length === 0) {

        renderVideos([]);

        document.getElementById(
            "sectionTitle"
        ).textContent =
            "📺 Your Subscriptions";

        showToast(
            "You haven't subscribed to any creators yet."
        );

        return;

    }


    const results =
        getAllVideos().filter(
            function(video) {

                return subscriptions.includes(
                    video.creator
                );

            }
        );


    renderVideos(
        results
    );


    document.getElementById(
        "sectionTitle"
    ).textContent =
        "📺 Your Subscriptions";

}


/* ============================================================
   24. NOTIFICATIONS
   ============================================================ */

function showNotifications() {

    showPage(
        "notificationPage"
    );

}


/* ============================================================
   25. PROFILE
   ============================================================ */

function showProfile() {

    showPage(
        "profilePage"
    );

    updateProfileStats();

}


function updateProfileStats() {

    const profile =
        document.getElementById(
            "profilePage"
        );

    if (!profile) {

        return;

    }


    const existingStats =
        profile.querySelector(
            ".dynamic-profile-stats"
        );


    if (existingStats) {

        existingStats.remove();

    }


    const stats =
        document.createElement(
            "section"
        );


    stats.className =
        "dynamic-profile-stats";


    stats.innerHTML = `

        <h2>Your Stats</h2>

        <p>
            📚 Learning Videos:
            <strong>
                ${learningVideos.length}
            </strong>
        </p>

        <p>
            🕘 Videos Watched:
            <strong>
                ${watchHistory.length}
            </strong>
        </p>

        <p>
            ❤️ Liked Videos:
            <strong>
                ${likedVideos.length}
            </strong>
        </p>

        <p>
            🧩 Challenges Completed:
            <strong>
                ${completedChallenges.length}
            </strong>
        </p>

        <p>
            🔥 Current Streak:
            <strong>
                ${currentUser.streak} days
            </strong>
        </p>

    `;


    profile.appendChild(
        stats
    );

}


/* ============================================================
   26. LEARN MODE
   ============================================================ */

function activateLearnMode() {

    if (!currentVideo) {

        showToast(
            "Open a video first."
        );

        return;

    }


    const challengeBox =
        document.getElementById(
            "challengeBox"
        );


    challengeBox.hidden =
        false;


    challengeBox.scrollIntoView({
        behavior: "smooth"
    });


    showToast(
        "🧠 Learn Mode activated!"
    );

}


function setupChallenge() {

    if (!currentVideo) {

        return;

    }


    const question =
        document.getElementById(
            "challengeQuestion"
        );


    if (question) {

        question.textContent =
            currentVideo.challenge;

    }


    const answer =
        document.getElementById(
            "challengeAnswer"
        );


    const result =
        document.getElementById(
            "challengeResult"
        );


    if (answer) {

        answer.value = "";

    }


    if (result) {

        result.textContent = "";

    }


    document.getElementById(
        "challengeBox"
    ).hidden = true;

}


function submitChallenge() {

    if (!currentVideo) {

        return;

    }


    const answer =
        document.getElementById(
            "challengeAnswer"
        );


    const result =
        document.getElementById(
            "challengeResult"
        );


    const text =
        answer.value.trim();


    if (text.length < 10) {

        result.textContent =
            "Your answer is too short. Explain the concept properly.";

        return;

    }


    if (
        !completedChallenges.includes(
            currentVideo.id
        )
    ) {

        completedChallenges.push(
            currentVideo.id
        );

        saveData(
            "completedChallenges",
            completedChallenges
        );


        increaseSkillProgress(
            currentVideo.skill,
            5
        );

    }


    result.textContent =
        "🎉 Challenge completed! Great job.";

    showToast(
        "Challenge completed 🧠"
    );


    updateProfileStats();

}


/* ============================================================
   27. SKILL PROGRESS INCREASE
   ============================================================ */

function increaseSkillProgress(
    skill,
    amount
) {

    if (
        skillProgress[skill] === undefined
    ) {

        skillProgress[skill] = 0;

    }


    skillProgress[skill] += amount;


    if (skillProgress[skill] > 100) {

        skillProgress[skill] = 100;

    }


    saveData(
        "skillProgress",
        skillProgress
    );


    showToast(
        `${skill} progress increased!`
    );

}


/* ============================================================
   28. VIDEO PROGRESS
   ============================================================ */

function setupVideoProgressTracking() {

    const video =
        document.getElementById(
            "mainVideo"
        );


    if (!video) {

        return;

    }


    video.addEventListener(
        "timeupdate",
        function() {

            if (
                !currentVideo ||
                !video.duration
            ) {

                return;

            }


            const percentage =
                Math.floor(
                    (
                        video.currentTime /
                        video.duration
                    ) * 100
                );


            videoProgress[
                currentVideo.id
            ] = percentage;


            saveData(
                "videoProgress",
                videoProgress
            );


            if (
                percentage === 90
            ) {

                increaseSkillProgress(
                    currentVideo.skill,
                    2
                );

            }

        }
    );

}


/* ============================================================
   29. NOTES
   ============================================================ */

function saveNotes() {

    if (!currentVideo) {

        return;

    }


    const textarea =
        document.getElementById(
            "videoNotes"
        );


    const status =
        document.getElementById(
            "notesStatus"
        );


    const text =
        textarea.value.trim();


    notes[
        currentVideo.id
    ] = text;


    saveData(
        "notes",
        notes
    );


    status.textContent =
        "✓ Notes saved successfully.";


    showToast(
        "Notes saved 📝"
    );


    setTimeout(
        function() {

            status.textContent = "";

        },
        2500
    );

}


function loadSavedNotes() {

    const textarea =
        document.getElementById(
            "videoNotes"
        );


    if (
        !textarea ||
        !currentVideo
    ) {

        return;

    }


    textarea.value =
        notes[
            currentVideo.id
        ] || "";

}


/* ============================================================
   30. COMMENTS
   ============================================================ */

function addComment(event) {

    event.preventDefault();


    if (!currentVideo) {

        return;

    }


    const input =
        document.getElementById(
            "commentInput"
        );


    const text =
        input.value.trim();


    if (text === "") {

        return;

    }


    if (
        !comments[currentVideo.id]
    ) {

        comments[
            currentVideo.id
        ] = [];

    }


    comments[
        currentVideo.id
    ].unshift({

        user: "Saketh",

        text: text,

        date:
            new Date()
                .toLocaleString()

    });


    saveData(
        "comments",
        comments
    );


    input.value = "";

    renderComments();


    showToast(
        "Comment added 💬"
    );

}


function renderComments() {

    if (!currentVideo) {

        return;

    }


    const container =
        document.getElementById(
            "comments"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const videoComments =
        comments[
            currentVideo.id
        ] || [];


    const defaultComments = [

        {
            user: "Rahul",
            text:
                "This explanation finally made the concept clear!"
        },

        {
            user: "Priya",
            text:
                "The challenge at the end is a great idea."
        }

    ];


    const allComments =
        [
            ...videoComments,
            ...defaultComments
        ];


    allComments.forEach(
        function(comment) {

            const article =
                document.createElement(
                    "article"
                );


            article.innerHTML = `

                <h4>
                    ${escapeHTML(
                        comment.user
                    )}
                </h4>

                <p>
                    ${escapeHTML(
                        comment.text
                    )}
                </p>

                ${
                    comment.date
                    ?
                    `<small>
                        ${escapeHTML(
                            comment.date
                        )}
                    </small>`
                    :
                    ""
                }

            `;


            container.appendChild(
                article
            );

        }
    );

}


/* ============================================================
   31. SHARE VIDEO
   ============================================================ */

async function shareVideo() {

    if (!currentVideo) {

        return;

    }


    const shareData = {

        title:
            currentVideo.title,

        text:
            `Check out "${currentVideo.title}" on SkillTube!`,

        url:
            window.location.href

    };


    if (
        navigator.share
    ) {

        try {

            await navigator.share(
                shareData
            );

            showToast(
                "Shared successfully!"
            );

        } catch (error) {

            console.log(
                "Share cancelled."
            );

        }

        return;

    }


    if (
        navigator.clipboard
    ) {

        await navigator.clipboard.writeText(
            window.location.href
        );

        showToast(
            "Link copied 🔗"
        );

    } else {

        showToast(
            "Copy this page URL to share."
        );

    }

}


/* ============================================================
   32. CREATE MENU
   ============================================================ */

function openCreateMenu() {

    showPage(
        "createPage"
    );

}


/* ============================================================
   33. CREATE VIDEO
   ============================================================ */

function createVideo() {

    const title =
        prompt(
            "Enter your video title:"
        );


    if (!title) {

        return;

    }


    const creator =
        prompt(
            "Enter creator name:"
        ) || "Saketh";


    const skill =
        prompt(
            "Enter skill/category:"
        ) || "General";


    const newVideo = {

        id:
            Date.now(),

        title:
            title,

        creator:
            creator,

        skill:
            skill,

        views:
            0,

        age:
            "Just now",

        duration:
            "00:00",

        description:
            "Creator uploaded video.",

        category:
            skill,

        challenge:
            "Explain the main concept of this video.",

        videoUrl:
            ""

    };


    customVideos.push(
        newVideo
    );


    saveData(
        "customVideos",
        customVideos
    );


    renderVideos();


    showToast(
        "Video created successfully 🎥"
    );


    showHome();

}


/* ============================================================
   34. CREATE SKILL JOURNEY
   ============================================================ */

function createLearningPath() {

    const skill =
        prompt(
            "What skill do you want to create a journey for?"
        );


    if (!skill) {

        return;

    }


    if (
        skillProgress[skill] === undefined
    ) {

        skillProgress[skill] = 0;

    }


    saveData(
        "skillProgress",
        skillProgress
    );


    showToast(
        `${skill} Skill Journey created 🧠`
    );


    showLearning();

}


/* ============================================================
   35. CREATE CHALLENGE
   ============================================================ */

function createChallenge() {

    const question =
        prompt(
            "Enter your challenge question:"
        );


    if (!question) {

        return;

    }


    showToast(
        "Challenge created 🧩"
    );


    alert(
        "Your challenge:\n\n" +
        question
    );

}


/* ============================================================
   36. SUBSCRIPTIONS
   ============================================================ */

function subscribeToCreator(
    creator
) {

    const index =
        subscriptions.indexOf(
            creator
        );


    if (index === -1) {

        subscriptions.push(
            creator
        );

        showToast(
            `Subscribed to ${creator} 🔔`
        );

    } else {

        subscriptions.splice(
            index,
            1
        );

        showToast(
            `Unsubscribed from ${creator}`
        );

    }


    saveData(
        "subscriptions",
        subscriptions
    );

}


/* ============================================================
   37. KEYBOARD SHORTCUTS
   ============================================================ */

function setupKeyboardShortcuts() {

    document.addEventListener(
        "keydown",
        function(event) {

            const tag =
                document.activeElement.tagName;


            if (
                tag === "INPUT" ||
                tag === "TEXTAREA"
            ) {

                return;

            }


            if (
                event.key === "/"
            ) {

                event.preventDefault();

                const search =
                    document.getElementById(
                        "searchInput"
                    );

                if (search) {

                    search.focus();

                }

            }


            if (
                event.key === "Escape"
            ) {

                showHome();

            }


            if (
                event.key === "l" ||
                event.key === "L"
            ) {

                if (currentVideo) {

                    activateLearnMode();

                }

            }

        }
    );

}


/* ============================================================
   38. TOAST NOTIFICATION
   ============================================================ */

function showToast(message) {

    let toast =
        document.getElementById(
            "skilltubeToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "skilltubeToast";


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "30px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.background =
            "#272727";

        toast.style.color =
            "#ffffff";

        toast.style.padding =
            "12px 20px";

        toast.style.borderRadius =
            "25px";

        toast.style.zIndex =
            "99999";

        toast.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.4)";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.opacity =
        "1";


    clearTimeout(
        toast.hideTimer
    );


    toast.hideTimer =
        setTimeout(
            function() {

                toast.style.opacity =
                    "0";

            },
            2500
        );

}


/* ============================================================
   39. UTILITY - FORMAT VIEWS
   ============================================================ */

function formatViews(number) {

    if (number >= 1000000) {

        return (
            number / 1000000
        ).toFixed(1) + "M";

    }


    if (number >= 1000) {

        return (
            number / 1000
        ).toFixed(1) + "K";

    }


    return number.toString();

}


/* ============================================================
   40. UTILITY - ESCAPE HTML
   ============================================================ */

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(value);

    return div.innerHTML;

}


/* ============================================================
   41. CLEAR WATCH HISTORY
   ============================================================ */

function clearHistory() {

    watchHistory = [];

    saveData(
        "watchHistory",
        watchHistory
    );

    updateHistory();

    showToast(
        "Watch history cleared."
    );

}


/* ============================================================
   42. CLEAR WATCH LATER
   ============================================================ */

function clearWatchLater() {

    watchLater = [];

    saveData(
        "watchLater",
        watchLater
    );

    updateWatchLater();

    renderVideos();

    showToast(
        "Watch Later cleared."
    );

}


/* ============================================================
   43. RESET APPLICATION
   ============================================================ */

function resetSkillTube() {

    const confirmation =
        confirm(
            "Are you sure you want to reset all SkillTube data?"
        );


    if (!confirmation) {

        return;

    }


    localStorage.clear();

    location.reload();

}


/* ============================================================
   44. LEARNING TIME
   ============================================================ */

function addLearningTime(
    minutes
) {

    currentUser.learningTime +=
        minutes;


    saveData(
        "learningTime",
        currentUser.learningTime
    );


    updateProfileStats();

}


/* ============================================================
   45. VIDEO ENDED EVENT
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const video =
            document.getElementById(
                "mainVideo"
            );


        if (!video) {

            return;

        }


        video.addEventListener(
            "ended",
            function() {

                if (!currentVideo) {

                    return;

                }


                videoProgress[
                    currentVideo.id
                ] = 100;


                saveData(
                    "videoProgress",
                    videoProgress
                );


                increaseSkillProgress(
                    currentVideo.skill,
                    5
                );


                showToast(
                    "Video completed! 🎉"
                );

            }
        );

    }
);


/* ============================================================
   46. AUTO SAVE NOTES
   ============================================================ */

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.id !==
            "videoNotes"
        ) {

            return;

        }


        if (!currentVideo) {

            return;

        }


        notes[
            currentVideo.id
        ] =
            event.target.value;


        saveData(
            "notes",
            notes
        );

    }
);


/* ============================================================
   47. SEARCH ENTER KEY
   ============================================================ */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !== "Enter"
        ) {

            return;

        }


        if (
            document.activeElement.id ===
            "searchInput"
        ) {

            searchVideos(
                event
            );

        }

    }
);


/* ============================================================
   48. HOME BUTTON
   ============================================================ */

window.showHome =
    showHome;


/* ============================================================
   49. EXPOSE FUNCTIONS
   ============================================================ */

window.searchVideos =
    searchVideos;

window.showTrending =
    showTrending;

window.showSubscriptions =
    showSubscriptions;

window.showLearning =
    showLearning;

window.showHistory =
    showHistory;

window.showWatchLater =
    showWatchLater;

window.showNotifications =
    showNotifications;

window.showProfile =
    showProfile;

window.openCreateMenu =
    openCreateMenu;

window.filterSkill =
    filterSkill;

window.openVideo =
    openVideo;

window.likeVideo =
    likeVideo;

window.dislikeVideo =
    dislikeVideo;

window.saveVideo =
    saveVideo;

window.saveCurrentVideo =
    saveCurrentVideo;

window.addToLearning =
    addToLearning;

window.activateLearnMode =
    activateLearnMode;

window.submitChallenge =
    submitChallenge;

window.saveNotes =
    saveNotes;

window.addComment =
    addComment;

window.shareVideo =
    shareVideo;

window.completeDailyMission =
    completeDailyMission;

window.startLearningJourney =
    startLearningJourney;

window.openSkillJourney =
    openSkillJourney;

window.createVideo =
    createVideo;

window.createLearningPath =
    createLearningPath;

window.createChallenge =
    createChallenge;

window.subscribeToCreator =
    subscribeToCreator;

window.clearHistory =
    clearHistory;

window.clearWatchLater =
    clearWatchLater;

window.resetSkillTube =
    resetSkillTube;