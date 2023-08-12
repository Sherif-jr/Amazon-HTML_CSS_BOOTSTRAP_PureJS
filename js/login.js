document.addEventListener("DOMContentLoaded", function() {
	const passwordInput = document.getElementById("passwordd");
	const emailInput = document.getElementById("email");
	const submitButton = document.getElementById("amazon");

	passwordInput.addEventListener("input", function() {
		const passwordError = document.getElementById("passwordError");
		passwordError.textContent = "";

		if (passwordInput.value.length <= 5) {
			passwordError.textContent = "Password must be longer than 5 characters";
			passwordError.style.color = "red"
		} else if (passwordInput.value.length >= 20) {
			passwordError.textContent = "Password must be less than 20 characters";
		} else {
			passwordError.textContent = "";
		}

		updateSubmitButtonState();
	});

	emailInput.addEventListener("input", function() {
		const emailError = document.getElementById("emailError");
		emailError.textContent = "";

		const emailPattern = /^[\w-\.]+@([\w-]+\.)+(com|net)$/g;
		if (!emailPattern.test(emailInput.value)) {
			emailError.textContent = "Invalid email";
			emailError.style.color = "red"
		} else {
			emailError.textContent = "";
		}

		updateSubmitButtonState();
	});

	function updateSubmitButtonState() {
		if (passwordInput.value.length > 5 && passwordInput.value.length < 20 &&
				/^[\w-\.]+@([\w-]+\.)+(com|net)$/g.test(emailInput.value)) {
			submitButton.disabled = false;
		} else {
			submitButton.disabled = true;
		}
	}
});