let nav = 0; //Current month navigator
let clicked = null; //Which day and month has been selected
let events = localStorage.getItem("events")
	? JSON.parse(localStorage.getItem("events"))
	: [];

const calendar = document.getElementById("calendar");
const weekdays = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

function load() {
	const dt = new Date();

	const day = dt.getDate();
	const month = dt.getMonth();
	const year = dt.getFullYear();

	const firstDayOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const dateString = firstDayOfMonth.toLocaleDateString("de-DE", {
		weekday: "long",
		year: "numeric",
		month: "numeric",
		day: "numeric",
	});

	const paddingDays = weekdays.indexOf(dateString.split(", "), [0]);

	for (let i = 0; i <= paddingDays + daysInMonth; i++) {
		const daySquare = document.createElement("div");
		daySquare.classList.add("day");

		if (i > paddingDays) {
			daySquare.innerText = i - paddingDays;

			daySquare.addEventListener("click", () => console.log("click"));
		} else {
			daySquare.classList.add("padding");
		}

		calendar.appendChild(daySquare);
	}

	//console.log(c);
}

load();
