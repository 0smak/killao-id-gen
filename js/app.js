import html2canvas from "html2canvas";

const camera_button = document.querySelector("#start-camera"),
	name = document.querySelector("#name"),
	dateOfBirth = document.querySelector("#dob"),
	dateOfBirthText = document.querySelector("#dob-text"),
	exp = document.querySelector("#exp"),
	issueDate = document.querySelector("#issue-date"),
	fileInput = document.querySelector("#fileInput"),
	imgContainer = document.querySelector("#img-container"),
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
		saveAs(canvas.toDataURL(), "carne-killao.png");
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
	if (checkIfMobile()) {
		fileInput.click();
		return;
	} else {
		camera_button.style.zIndex = "-1";
		video.setAttribute("autoplay", "");
		video.setAttribute("muted", "");
		video.setAttribute("playsinline", "");
		video.setAttribute("playsinline", true);
		let stream = await navigator.mediaDevices.getUserMedia({
			audio: false,
			video: {
				facingMode: "user",
				width: { ideal: 300 },
				height: { ideal: 360 },
			},
		});
		video.srcObject = stream;
	}
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

function checkIfMobile() {
	return window.innerWidth < 500;
}

// if ios hide video element
if (checkIfMobile()) {
	video.style.display = "none";
	fileInput.style.display = "block";
} else {
	video.style.display = "block";
	fileInput.style.display = "none";
}

fileInput.addEventListener("change", function (event) {
	const selectedFile = event.target.files[0];
	const reader = new FileReader();

	imgContainer.title = selectedFile.name;

	reader.onload = function (event) {
		console.log({ event });
		imgContainer.src = event.target.result;
		camera_button.style.display = "none";
	};

	reader.readAsDataURL(selectedFile);
});

// on add imag

dateOfBirthText.innerHTML = randomDate();
issueDate.innerHTML = parseDate(new Date());
exp.innerHTML = parseDate(addDate4Years(dateOfBirthText.innerHTML));

window.addEventListener("resize", resize);
setTimeout(() => {
	resize();
}, 250);
