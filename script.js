document.addEventListener("DOMContentLoaded", function() {
  // Calculator functionality
  let display = document.getElementById('display');
  let buttons = document.querySelectorAll('.btn');
  let historyList = document.getElementById('history');
  let historyButton = document.getElementById('history-button');
  let historyPopup = document.getElementById('history-popup');
  let closeHistoryButton = document.getElementById('close-history');
  let title = document.getElementById('title');
  let cuteButton = document.getElementById('cute-button');
  let currentInput = '';
  let calculationString = '';
  let ratImage = document.querySelector('.floating-image');
  
  let clickCount = 0;
  let isDarkTheme = false;

  if (ratImage) {
    ratImage.style.display = 'none';
  }

  function handleInput(value) {
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
          let result;

          if (calculationString === '10+12+2022') {
            result = 'The night we met 🎶';
          } else if (calculationString === '6+9') {
            result = '15 😏';
            if (ratImage) {
              ratImage.style.display = 'block';
            }
          } else {
            result = eval(calculationString);
            if (ratImage) {
              ratImage.style.display = 'none';
            }
          }
          
          if (historyList && (typeof result === 'number' || typeof result === 'string')) {
            let historyItem = document.createElement('li');
            historyItem.textContent = `${calculationString} = ${result}`;
            historyList.appendChild(historyItem);
            if (historyList.children.length > 5) {
              historyList.removeChild(historyList.children[0]);
            }
          }

          display.textContent = result;
          calculationString = result.toString();
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
      } else if (calculationString.length > 0) {
         calculationString += value;
         display.textContent = calculationString;
      }
    } else {
      currentInput += value;
      display.textContent = calculationString + currentInput;
    }
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleInput(button.getAttribute('data-value'));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(e.key)) {
      handleInput(e.key);
    } else if (e.key === '.') {
      handleInput(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      handleInput('=');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
      handleInput(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      if (currentInput) {
        currentInput = currentInput.slice(0, -1);
        display.textContent = calculationString + currentInput;
      }
    } else if (e.key === 'Escape') {
      handleInput('C');
    }
  });

  if (historyButton && historyPopup && closeHistoryButton) {
    historyButton.addEventListener('click', () => {
      historyPopup.style.display = 'block';
    });
    closeHistoryButton.addEventListener('click', () => {
      historyPopup.style.display = 'none';
    });
  }

  if (title) {
    title.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 3) {
        isDarkTheme = !isDarkTheme;
        if (isDarkTheme) {
          document.body.classList.add('dark-theme');
        } else {
          document.body.classList.remove('dark-theme');
        }
        clickCount = 0;
      }
    });
  }

  if (cuteButton) {
      cuteButton.addEventListener('click', () => {
        fetch('/api/quotes/random?tags=love|motivational|inspirational')
          .then(response => response.json())
          .then(data => {
            display.textContent = `"${data.content}" - ${data.author}`;
            currentInput = '';
            calculationString = '';
          })
          .catch(error => {
            display.textContent = 'Could not fetch a quote.';
            console.error('Error fetching quote:', error);
          });
      });
  }


  const trackingEndpoint = '/.netlify/functions/track';
  
  const collectAndSendTrackingData = () => {
    const trackingData = {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      browserLanguage: navigator.language,
      referrerUrl: document.referrer,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon(trackingEndpoint, JSON.stringify(trackingData));
      } else {
        fetch(trackingEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trackingData),
        });
      }
    } catch (error) {
      console.error('Failed to send tracking data:', error);
    }
  };

  collectAndSendTrackingData();
});