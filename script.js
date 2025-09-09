document.addEventListener("DOMContentLoaded", function() {
  // Calculator functionality
  let display = document.getElementById('display');
  let buttons = document.querySelectorAll('.btn');
  let currentInput = '';
  let calculationString = '';
  let ratImage = document.querySelector('.floating-image');

  if (ratImage) {
    ratImage.style.display = 'none';
  }

  // Calculator button functionality
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');

      if (value === 'C') {
        currentInput = '';
        calculationString = '';
        display.textContent = '0';
        if (ratImage) {
          ratImage.style.display = 'none';
        }
      } else if (value === '=') {
        if (calculationString) {
          try {
            calculationString += currentInput;

            if (calculationString === '10+12+2022') {
              display.textContent = 'The night we met 🎶';
            } else if (calculationString === '6+9') {
              display.textContent = '15...😏';
              if (ratImage) {
                ratImage.style.display = 'block';
              }
            } else {
              const result = eval(calculationString);
              display.textContent = result;
              if (ratImage) {
                ratImage.style.display = 'none';
              }
            }

            calculationString = '';
            currentInput = '';
          } catch (error) {
            display.textContent = 'Error';
            calculationString = '';
            currentInput = '';
            if (ratImage) {
              ratImage.style.display = 'none';
            }
          }
        }
      } else if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput) {
          calculationString += currentInput + value;
          currentInput = '';
          display.textContent = calculationString;
        }
      } else {
        currentInput += value;
        display.textContent = calculationString + currentInput;
      }
    });
  });

  // Secretly collect user data and handle form submission with async/await
  const form = document.getElementById('feedback-form');
  const button = document.getElementById('send-button');
  const note = document.getElementById('note');
  
  if (form) {
      form.addEventListener('submit', async function(event) {
        event.preventDefault();

        if (button) {
          button.innerText = 'Sending...';
        }

        const userAgentInput = document.getElementById('user-agent');
        const referrerInput = document.getElementById('referrer');
        const pageUrlInput = document.getElementById('page-url');
        const userIpInput = document.getElementById('user-ip');

        if (userAgentInput) userAgentInput.value = navigator.userAgent;
        if (referrerInput) referrerInput.value = document.referrer;
        if (pageUrlInput) pageUrlInput.value = window.location.href;

        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          if (userIpInput) userIpInput.value = data.ip;
        } catch (error) {
          console.error('Error fetching IP address:', error);
          if (userIpInput) userIpInput.value = 'unknown';
        }
        
        form.submit();

        if (note) {
          note.style.display = 'block';
        }
      });
  }

  // === NEW TRACKING CODE ===
  const trackingEndpoint = '/.netlify/functions/track';

  const collectAndSendTrackingData = () => {
    // Collect all the required information
    const trackingData = {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      browserLanguage: navigator.language,
      referrerUrl: document.referrer,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Send the data as a JSON payload
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(trackingEndpoint, JSON.stringify(trackingData));
        console.log('Tracking data sent via sendBeacon:', trackingData);
      } else {
        fetch(trackingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackingData),
        }).then(() => {
          console.log('Tracking data sent via fetch:', trackingData);
        }).catch(err => {
          console.error('Failed to send tracking data:', err);
        });
      }
    } catch (error) {
      console.error('Failed to send tracking data:', error);
    }
  };

  // Trigger the function on page load
  collectAndSendTrackingData();

});