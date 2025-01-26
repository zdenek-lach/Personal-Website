document.addEventListener('DOMContentLoaded', () => {
	let skipIntro = localStorage.getItem('skipIntro') === 'true'; // Retrieve skipIntro from localStorage

	const textElement = document.querySelector('.text');
	const textContainer = document.querySelector('.text-container');
	const header = document.querySelector('.header');
	const mainContent = document.querySelector('.main-content');
	const replayIntroButton = document.querySelector('.replay-intro-button');
	header.style.display = 'none'; // Hide the header initially
	mainContent.style.display = 'none'; // Hide the main content initially
	replayIntroButton.style.display = 'none'; // Hide the replay button initially

	const intro_messages = [
		'oh?',
		'hi!',
		'..',
		"so.. you're looking for more information about me?",
		'okay, here you go..',
	];
	let messageIndex = 0;
	let charIndex = 0;
	let currentMessage = intro_messages[messageIndex];

	function typeWriter() {
		if (charIndex < currentMessage.length) {
			textElement.textContent += currentMessage.charAt(charIndex);
			charIndex++;
			setTimeout(typeWriter, 50); // Typing speed
		} else {
			if (messageIndex < intro_messages.length - 1) {
				messageIndex++;
				setTimeout(displayNextMessage, 2000); // Wait before displaying the next message
			} else {
				setTimeout(showContent, 2000); // Show content after the last message
			}
		}
	}

	function displayNextMessage() {
		textElement.textContent = '';
		currentMessage = intro_messages[messageIndex];
		charIndex = 0;
		typeWriter();
	}

	function showContent() {
		document.body.classList.add('intro-done'); // Change background color and trigger fade-in
		header.style.display = 'flex'; // Show the header
		header.classList.add('visible'); // Ensure the header is visible
		mainContent.style.display = 'block'; // Show the main content
		mainContent.classList.add('visible'); // Ensure the main content is visible with animation
		replayIntroButton.style.display = 'inline-block'; // Show the replay button
		replayIntroButton.classList.add('visible'); // Ensure the replay button is visible with animation
		const sections = mainContent.querySelectorAll('section');
		let expandedSections = [];
		let maxExpandedSections;

		switch (true) {
			case screen.height <= 720 || screen.width <= 600:
				maxExpandedSections = 1;
				break;
			case screen.height <= 900:
				maxExpandedSections = 2;
				break;
			case screen.height <= 1080:
				maxExpandedSections = 3;
				break;
			default:
				maxExpandedSections = 5;
				break;
		}

		sections.forEach((section, index) => {
			if (index === 0) {
				section.classList.add('visible'); // Expand the first section by default
				section.classList.add('animated-border'); // Expand the first section by default
				expandedSections.push(section);
			} else {
				section.classList.add('collapsed'); // Ensure other sections are collapsed
			}
			const title = section.querySelector('h2');
			title.addEventListener('click', () => {
				if (section.classList.contains('visible')) {
					section.classList.remove('visible');
					section.classList.remove('animated-border');
					section.classList.add('collapsed');
					expandedSections = expandedSections.filter((s) => s !== section);
				} else {
					if (expandedSections.length >= maxExpandedSections) {
						const oldestSection = expandedSections.shift();
						oldestSection.classList.remove('visible');
						oldestSection.classList.remove('animated-border');
						oldestSection.classList.add('collapsed');
					}
					section.classList.add('visible');
					section.classList.add('animated-border');
					section.classList.remove('collapsed');
					expandedSections.push(section);
				}
			});
		});
		textContainer.style.display = 'none'; // Hide the text container
		localStorage.setItem('skipIntro', 'true'); // Set skipIntro to true in localStorage
	}

	if (skipIntro) {
		showContent(); // Skip the intro and show the content immediately
	} else {
		setTimeout(displayNextMessage, 2000); // Initial delay before displaying the first message
	}

	replayIntroButton.addEventListener('click', () => {
		localStorage.setItem('skipIntro', 'false'); // Set skipIntro to false in localStorage
		location.reload(); // Reload the page
	});
});
