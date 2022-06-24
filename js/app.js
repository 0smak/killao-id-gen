import html2canvas from "html2canvas";

const camera_button = document.querySelector("#start-camera"),
	name = document.querySelector("#name"),
	dateOfBirth = document.querySelector("#dob"),
	dateOfBirthText = document.querySelector("#dob-text"),
	exp = document.querySelector("#exp"),
	issueDate = document.querySelector("#issue-date"),
	colorPalette = document.querySelector("#color-palette"),
	color = document.querySelector("#selected-color"),
	signature = document.querySelector("#signature-name"),
	video = document.querySelector("#video"),
	outer = document.getElementById("killao-card"),
	wrapper = document.getElementById("outer"),
	maxWidth = outer.clientWidth,
	maxHeight = outer.clientHeight;

document.getElementById("save-btn").addEventListener("click", function () {
	colorPalette.style.display = "none";
	html2canvas(outer, {
		allowTaint: true,
		useCORS: true,
	}).then(function (canvas) {
		colorPalette.style.display = "block";
		saveAs(canvas.toDataURL(), "file-name.png");
	});
});

function saveAs(uri, filename) {
	const link = document.createElement("a");
	if (typeof link.download === "string") {
		link.href = uri;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	} else {
		window.open(uri);
	}
}

name.addEventListener("blur", () => {
	if (!name.innerText?.trim()?.length) name.innerText = "Minimenda";
	signature.innerHTML = name.innerText.split(/\s/)[0];
});

name.addEventListener("input", () => {
	signature.innerHTML = name.innerText.split(/\s/)[0];
});

dateOfBirth.addEventListener("change", () => {
	let date = dateOfBirth.value;
	if (!date) date = new Date();
	const dob = new Date(date);
	const dobString = parseDate(dob);
	dateOfBirthText.innerHTML = dobString;
});

color.addEventListener("change", () => {
	const colorValue = color.value;
	name.style.color = colorValue;
});

camera_button.addEventListener("click", async function () {
	camera_button.style.zIndex = "-1";
	let stream = await navigator.mediaDevices.getUserMedia({
		audio: false,
		video: {
			width: { min: 197, ideal: 197, max: 197 },
			height: { min: 307, ideal: 307, max: 307 },
		},
	});
	video.srcObject = stream;
	video.setAttribute("playsinline", true);
});

function resize() {
	let scale,
		width = window.innerWidth,
		height = window.innerHeight,
		isMax = width >= maxWidth && height >= maxHeight;

	scale = Math.min(width / maxWidth, height / maxHeight);
	outer.style.transform = isMax ? "" : "scale(" + scale + ")";
	wrapper.style.width = isMax ? "" : maxWidth * scale;
	wrapper.style.height = isMax ? "" : maxHeight * scale;
}

function parseDate(date) {
	return date.toLocaleDateString("es-ES", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

function randomDate() {
	const start = new Date(1996, 0, 1);
	const end = new Date(2002, 0, 1);
	return parseDate(
		new Date(
			start.getTime() + Math.random() * (end.getTime() - start.getTime())
		)
	);
}

function reverseDate(date) {
	const [day, month, year] = date.split("/");
	return new Date(year, month - 1, day);
}

function addDate4Years(date) {
	const dob = reverseDate(date);
	const random = Math.floor(Math.random() * 13) + 13;
	return new Date(
		dob.getFullYear() + 4,
		dob.getMonth(),
		dob.getDate() + random
	);
}

dateOfBirthText.innerHTML = randomDate();
issueDate.innerHTML = parseDate(new Date());
exp.innerHTML = parseDate(addDate4Years(dateOfBirthText.innerHTML));

window.addEventListener("resize", resize);
resize();
