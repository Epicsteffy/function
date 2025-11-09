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
  let quotePopup = document.getElementById('quote-popup');
  let quoteContent = document.getElementById('quote-content');
  let closeQuoteButton = document.getElementById('close-quote');
  let audioPlayer = document.getElementById('wby-audio');
  
  let currentInput = '';
  let calculationString = '';
  let ratImage = document.querySelector('.floating-image');
  
  let clickCount = 0;
  let isDarkTheme = false;
  let quoteCache = []; // NEW: Cache to store quotes and avoid rate limits

  if (ratImage) {
    ratImage.style.display = 'none';
  }

  function handleInput(value) {
    // Stop audio on key press
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
    
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
            
            // --- Song Easter Egg Logic ---
            let clickableSpan = document.createElement('span');
            clickableSpan.textContent = 'The night we met 🎶';
            clickableSpan.style.cursor = 'pointer';
            clickableSpan.style.textDecoration = 'underline';
            clickableSpan.style.color = isDarkTheme ? '#ecf0f1' : '#6b5b95';

            clickableSpan.onclick = function() {
              if (audioPlayer) {
                audioPlayer.play();
                display.textContent = '🎶 Playing...';
              }
            };
            
            display.innerHTML = '';
            display.appendChild(clickableSpan);
            
            result = clickableSpan.outerHTML; // Store HTML content for history
            
            if (ratImage) {
              ratImage.style.display = 'none';
            }
            
          } else if (calculationString === '6+9') {
            result = '15 😏';
            if (ratImage) {
              ratImage.style.display = 'block';
            }
             display.textContent = result;
          } else {
            result = eval(calculationString);
            display.textContent = result;
            if (ratImage) {
              ratImage.style.display = 'none';
            }
          }
          
          if (historyList) {
            let historyItem = document.createElement('li');
            historyItem.textContent = `${calculationString} = ${result}`;
            historyList.appendChild(historyItem);
            if (historyList.children.length > 5) {
              historyList.removeChild(historyList.children[0]);
            }
          }

          calculationString = result.toString().replace(/<[^>]+>/g, '');
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
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }

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
      quotePopup.style.display = 'none'; 
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
  
  // --- Function to fetch and cache quotes ---
  const fetchAndCacheQuotes = () => {
    // Show fetching message, but don't show the whole popup unless requested
    console.log('Fetching new quote batch...');
    fetch('/api/quotes/quotes') 
      .then(response => {
        if (!response.ok) {
          throw new Error('API Rate Limit Hit or Server Down: ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            quoteCache = data; // Cache the quotes
            console.log(`Cache filled with ${data.length} quotes.`);
        } else {
            throw new Error('API returned empty or invalid data.');
        }
      })
      .catch(error => {
        console.error('Error fetching quote:', error);
      });
  };

  // --- Quote pop-up functionality ---
  if (cuteButton && quotePopup && closeQuoteButton) {
      // Fetch initial set of quotes on page load
      fetchAndCacheQuotes(); 

      cuteButton.addEventListener('click', () => {
        historyPopup.style.display = 'none'; // Ensure history is hidden
        quotePopup.style.display = 'block'; // Show the quote popup

        if (quoteCache.length > 0) {
            // Get a random quote from the cache
            const randomIndex = Math.floor(Math.random() * quoteCache.length);
            const quote = quoteCache[randomIndex].q;

            // Display the quote
            quoteContent.textContent = `“${quote}”`;

            // Remove the used quote from the cache and refill if low
            quoteCache.splice(randomIndex, 1); 

            if (quoteCache.length < 5) { // If fewer than 5 quotes left, fetch a new batch
                fetchAndCacheQuotes();
            }

        } else {
            // If cache is empty, display error and try to fetch new ones
            quoteContent.textContent = 'Quote failed. Please wait 30 seconds and try again.';
            // Try to fetch again, but it might fail due to rate limit
            fetchAndCacheQuotes(); 
        }
      });

      closeQuoteButton.addEventListener('click', () => {
        quotePopup.style.display = 'none';
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