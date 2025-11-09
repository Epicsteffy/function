document.addEventListener("DOMContentLoaded", function() {
    const greetingElement = document.getElementById('greeting-text');

    // Get the current hour (24-hour format)
    const hour = new Date().getHours();
    let greeting = "Hello";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning jaan ☀️";
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon love ☕";
    } else if (hour >= 17 && hour < 22) {
        greeting = "Good Evening baby 🌙";
    } else {
        greeting = "Late Night, My Dear? 🦉";
    }

    // Update the HTML
    if (greetingElement) {
        greetingElement.textContent = greeting;
    }
});