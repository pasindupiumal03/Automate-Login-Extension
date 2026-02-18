
// Helper to wait for element
const waitForElement = (selector, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
};

// Helper to simulate typing into React inputs
const fillReactInput = (element, value) => {
  const lastValue = element.value;
  element.value = value;
  const event = new Event('input', { bubbles: true });
  event.simulated = true;
  const tracker = element._valueTracker;
  if (tracker) {
    tracker.setValue(lastValue);
  }
  element.dispatchEvent(event);
  element.dispatchEvent(new Event('change', { bubbles: true }));
};

const automateLogin = async (loginId, pin) => {
  try {
    console.log("Starting automation...");

    // Step 1: Login ID
    const loginInput = await waitForElement('input[name="login EmailId"], #login');
    console.log("Found login input", loginInput);
    fillReactInput(loginInput, loginId);

    const continueBtn1 = await waitForElement('button[data-test-id="button-continue"]');
    console.log("Found continue button 1", continueBtn1);
    continueBtn1.click();

    // Step 2: PIN
    // Wait for the pin input to appear. It might take a moment.
    // Also wait for the previous input to disappear or change? Actually just waiting for new selector is usually enough if unique.
    const pinInput = await waitForElement('input[name="pin"], #pin');
    console.log("Found pin input", pinInput);

    // Small delay to ensure React is ready
    await new Promise(r => setTimeout(r, 500));
    fillReactInput(pinInput, pin);

    // Continue again - button selector is same, so we need to re-query or rely on the fact that the page structure changes.
    // If it's the same button element but reused, we just click it.
    // If it's a new button with same test-id, waitForElement might return immediately if the old one is still there? 
    // Best to wait for stale element or just wait a bit.
    // Let's assume the DOM changes significantly or we just find the visible one.

    await new Promise(r => setTimeout(r, 500)); // Wait for button to be clickable
    const continueBtn2 = await waitForElement('button[data-test-id="button-continue"]');
    continueBtn2.click();

    // Step 3: Send verification code
    const sendCodeBtn = await waitForElement('button[data-test-id="button-submit"]');
    console.log("Found send code button", sendCodeBtn);
    await new Promise(r => setTimeout(r, 500));
    sendCodeBtn.click();

    console.log("Automation complete.");
    return { success: true };

  } catch (error) {
    console.error("Automation error:", error);
    return { success: false, error: error.message };
  }
};


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'START_LOGIN') {
    automateLogin(request.data.loginId, request.data.pin)
      .then(res => sendResponse(res))
      .catch(err => sendResponse({ success: false, error: err.message }));
    return true; // Keep channel open
  }
});

const checkPendingLogin = async () => {
  try {
    const data = await new Promise(resolve => chrome.storage.local.get(['pendingLogin'], resolve));
    if (data.pendingLogin) {
      console.log("Found pending login, starting automation...");
      // Clear it immediately to avoid loops
      await new Promise(resolve => chrome.storage.local.remove('pendingLogin', resolve));
      // Add a small delay to ensure page is ready
      setTimeout(() => {
        automateLogin(data.pendingLogin.loginId, data.pendingLogin.pin);
      }, 1000);
    }
  } catch (e) {
    console.error("Error checking pending login:", e);
  }
}

// Run check on load
checkPendingLogin();
