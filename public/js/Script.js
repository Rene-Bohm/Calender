let storage = new RemoteBucket("/bucket/1234");

const calendar = document.getElementById("calendar");
const newEventModal = document.getElementById("newEventModal");
const deleteEventModal = document.getElementById("deleteEventModal");
const backDrop = document.getElementById("modalBackDrop");
const eventTitleInput = document.getElementById("eventTitleInput");

const weekdays = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

let nav;
let clicked;
let events;

async function setUp() {
	nav = 0; //Current month navigator
	clicked = null; //Which day and month has been selected
	events = [];

	initButtons();
	await load();

	setInterval(async () => {
		await load();
	}, 5000);
}

function openModal(date) {
	clicked = date;
	const eventForDay = events.find((e) => e.date === clicked);

	if (eventForDay) {
		document.getElementById("eventText").innerText = eventForDay.title;
		deleteEventModal.style.display = "block";
	} else {
		newEventModal.style.display = "block";
	}

	backDrop.style.display = "block";
}

async function load() {
	console.log("Loading new data...");

	try {
		events = JSON.parse(await storage.getItems());
	} catch {
		events = [];
	}

	const dt = new Date();

	if (nav !== 0) {
		dt.setMonth(new Date().getMonth() + nav);
	}

	const day = dt.getDate();
	const month = dt.getMonth();
	const year = dt.getFullYear();

	const firstDayOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const dateString = firstDayOfMonth.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});

	const paddingDays = weekdays.indexOf(dateString.split(", ")[0]);

	document.getElementById(
		"monthDisplay"
	).innerText = `${dt.toLocaleDateString("en-US", {
		month: "long",
	})} ${year}`;

	calendar.innerHTML = "";

	for (let i = 1; i <= paddingDays + daysInMonth; i++) {
		const daySquare = document.createElement("div");
		daySquare.classList.add("day");
		const dayString = `${month + 1}/${i - paddingDays}/${year}`;

		if (i > paddingDays) {
			daySquare.innerText = i - paddingDays;

			const eventForDay = events.find((e) => e.date === dayString);

			if (eventForDay) {
				const eventDiv = document.createElement("div");
				eventDiv.classList.add("event");
				eventDiv.innerText = eventForDay.title;
				daySquare.appendChild(eventDiv);
			}

			daySquare.addEventListener("click", () => openModal(dayString));
		} else {
			daySquare.classList.add("padding");
		}

		calendar.appendChild(daySquare);
	}
}

function closeModal() {
	eventTitleInput.classList.remove("error");
	newEventModal.style.display = "none";
	deleteEventModal.style.display = "none";
	backDrop.style.display = "none";
	eventTitleInput.value = "";
	clicked = null;
	load();
}

async function saveEvent() {
	if (eventTitleInput.value) {
		eventTitleInput.classList.remove("error");

		events.push({
			date: clicked,
			title: eventTitleInput.value,
		});

		await storage.newEvent(clicked, eventTitleInput.value);

		closeModal();
	} else {
		eventTitleInput.classList.add("error");
	}
}

async function deleteEvent() {
	events = events.filter((e) => e.date !== clicked);
	await storage.removeItem(clicked);
	closeModal();
}

function initButtons() {
	document.getElementById("nextButton").addEventListener("click", () => {
		nav++;
		load();
	});

	document.getElementById("backButton").addEventListener("click", () => {
		nav--;
		load();
	});

	document.getElementById("saveButton").addEventListener("click", saveEvent);

	document
		.getElementById("cancelButton")
		.addEventListener("click", closeModal);

	document
		.getElementById("deleteButton")
		.addEventListener("click", deleteEvent);

	document
		.getElementById("closeButton")
		.addEventListener("click", closeModal);
}

setUp();
