const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const clearCompletedButton = document.getElementById("clearCompleted");
const todoMessage = document.getElementById("todoMessage");
const storageKey = "sreerag-portfolio-prep-tasks";


// Creates HTML elements safely.
function createElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}


// Mobile navigation
menuToggle.addEventListener("click", function () {
  const isOpen = siteNav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

document.querySelectorAll(".site-nav a").forEach(function (link) {
  link.addEventListener("click", function () {
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  });
});


// Loads portfolio information from portfolio-data.json
function renderPortfolio(data) {
  const profile = data.profile;

  document.title = `${profile.name} | Software Engineer Portfolio`;

  document.getElementById("profileRole").textContent = profile.role;
  document.getElementById("profileSummary").textContent = profile.summary;
  document.getElementById("profileFocus").textContent = profile.focus;
  document.getElementById("profileAvailability").textContent =
    profile.availability;

  const headline = document.getElementById("profileHeadline");
  const emphasis = createElement("em", "", profile.headlineEmphasis);

  headline.replaceChildren(profile.headlineLeading, emphasis);


  // Profile statistics
  const profileStats = document.getElementById("profileStats");

  profile.stats.forEach(function (stat) {
    const statItem = document.createElement("div");

    statItem.append(
      createElement("strong", "", stat.value),
      createElement("span", "", stat.label)
    );

    profileStats.appendChild(statItem);
  });


  // Highlights
  const highlights = document.getElementById("highlights");

  data.highlights.forEach(function (highlight) {
    const item = document.createElement("div");

    item.append(
      createElement("span", "", highlight.number),
      createElement("p", "", highlight.text)
    );

    highlights.appendChild(item);
  });


  // About section
  const aboutCopy = document.getElementById("aboutCopy");

  data.about.forEach(function (paragraph) {
    aboutCopy.appendChild(createElement("p", "", paragraph));
  });

  const aboutLink = createElement("a", "text-link", "Work with me ");
  aboutLink.href = "#contact";
  aboutLink.appendChild(createElement("span", "", "→"));

  aboutCopy.appendChild(aboutLink);


  // Skills
  const skillsGrid = document.getElementById("skillsGrid");

  data.skills.forEach(function (skill) {
    const card = createElement("article", "skill-group");

    card.append(
      createElement("span", "skill-number", skill.number),
      createElement("h3", "", skill.title),
      createElement("p", "", skill.description)
    );

    skillsGrid.appendChild(card);
  });


  // Projects
  const projectsGrid = document.getElementById("projectsGrid");

  data.projects.forEach(function (project) {
    const card = createElement("article", "project-card");

    if (project.featured) {
      card.classList.add("project-featured");
    }

    const labels = createElement("div", "project-label-row");

    labels.append(
      createElement("span", "", project.label),
      createElement("span", "", project.type)
    );

    const points = document.createElement("ul");

    project.points.forEach(function (point) {
      points.appendChild(createElement("li", "", point));
    });

    card.append(
      labels,
      createElement("h3", "", project.title),
      createElement("p", "", project.description),
      points
    );

    projectsGrid.appendChild(card);
  });


  // Experience
  const experienceTimeline = document.getElementById("experienceTimeline");

  data.experience.forEach(function (experience) {
    const item = createElement("article", "timeline-item");
    const meta = createElement("div", "timeline-meta");

    meta.append(
      createElement("span", "", experience.role),
      createElement("span", "", experience.company)
    );

    const details = document.createElement("div");

    details.append(
      createElement("h3", "", experience.title),
      createElement("p", "", experience.description)
    );

    item.append(meta, details);
    experienceTimeline.appendChild(item);
  });


  // Education
  const educationGrid = document.getElementById("educationGrid");

  data.education.forEach(function (education) {
    const item = document.createElement("article");

    item.append(
      createElement("span", "", education.label),
      createElement("h3", "", education.title),
      createElement("p", "", education.description)
    );

    educationGrid.appendChild(item);
  });


  // Contact information
  const contactLinks = document.getElementById("contactLinks");

  const emailLink = createElement("a", "", profile.email);
  emailLink.href = `mailto:${profile.email}`;

  const phoneLink = createElement("a", "", profile.phoneDisplay);
  phoneLink.href = `tel:${profile.phoneLink}`;

  contactLinks.append(
    emailLink,
    phoneLink,
    createElement("span", "", profile.socialText)
  );
}


async function loadPortfolioData() {
  try {
    const response = await fetch("./portfolio-data.json");

    if (!response.ok) {
      throw new Error("Could not load portfolio-data.json");
    }

    const data = await response.json();
    renderPortfolio(data);
  } catch (error) {
    console.error(error);

    document.getElementById("profileRole").textContent =
      "Start this website with Live Server to load portfolio data.";
  }
}


// To-do list localStorage functions
function getTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey) || "[]");

    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function updateTaskCount(tasks) {
  const activeTasks = tasks.filter(function (task) {
    return !task.completed;
  }).length;

  taskCount.textContent =
    `${activeTasks} active ${activeTasks === 1 ? "task" : "tasks"}`;
}

function renderTasks() {
  const tasks = getTasks();

  todoList.innerHTML = "";

  tasks.forEach(function (task) {
    const item = document.createElement("li");
    item.className = "todo-item";

    if (task.completed) {
      item.classList.add("done");
    }

    const checkbox = document.createElement("input");
    checkbox.className = "todo-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);

    checkbox.addEventListener("change", function () {
      const updatedTasks = getTasks().map(function (savedTask) {
        if (savedTask.id === task.id) {
          return {
            ...savedTask,
            completed: checkbox.checked
          };
        }

        return savedTask;
      });

      saveTasks(updatedTasks);
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.setAttribute("aria-label", `Remove ${task.text}`);

    deleteButton.addEventListener("click", function () {
      const updatedTasks = getTasks().filter(function (savedTask) {
        return savedTask.id !== task.id;
      });

      saveTasks(updatedTasks);
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    todoList.appendChild(item);
  });

  updateTaskCount(tasks);
}

todoForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = todoInput.value.trim();

  if (text === "") {
    todoMessage.textContent = "Add a task before saving it.";
    todoInput.focus();
    return;
  }

  const tasks = getTasks();

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false
  });

  saveTasks(tasks);

  todoInput.value = "";
  todoMessage.textContent = "";
  todoInput.focus();

  renderTasks();
});

clearCompletedButton.addEventListener("click", function () {
  const activeTasks = getTasks().filter(function (task) {
    return !task.completed;
  });

  saveTasks(activeTasks);
  renderTasks();
});


// Run when the browser opens the page.
document.getElementById("currentYear").textContent = new Date().getFullYear();

renderTasks();
loadPortfolioData();