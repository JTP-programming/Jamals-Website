// Chatbot Widget Functionality
let chatbotToggle, chatbotClose, chatbotWindow, chatbotInput, chatbotSend, chatbotMessages;

// API Configuration - Add your API key here when ready
const API_KEY = ""; // Add your API key here
const API_URL = ""; // Add your API endpoint here

// Initialize chatbot elements once DOM is ready
function initializeChatbot() {
  chatbotToggle = document.getElementById("chatbotToggle");
  chatbotClose = document.getElementById("chatbotClose");
  chatbotWindow = document.getElementById("chatbotWindow");
  chatbotInput = document.getElementById("chatbotInput");
  chatbotSend = document.getElementById("chatbotSend");
  chatbotMessages = document.getElementById("chatbotMessages");

  if (!chatbotToggle || !chatbotWindow || !chatbotInput) {
    console.error("Chatbot elements not found");
    return;
  }

  attachEventListeners();
}

// Attach all event listeners
function attachEventListeners() {
  // Toggle chatbot window
  chatbotToggle.addEventListener("click", toggleChatbot);

  // Close chatbot window
  chatbotClose.addEventListener("click", closeChatbot);

  // Send message on button click
  chatbotSend.addEventListener("click", sendMessage);

  // Send message on Enter key
  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Scroll to bottom when keyboard appears (iOS fix)
  chatbotInput.addEventListener("focus", () => {
    setTimeout(() => {
      if (chatbotMessages) {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
    }, 300);
  });
}

// Toggle chatbot window
function toggleChatbot() {
  if (!chatbotWindow) return;
  
  chatbotWindow.classList.toggle("active");
  chatbotToggle.classList.toggle("active");
  
  if (chatbotWindow.classList.contains("active")) {
    setTimeout(() => {
      if (chatbotInput) {
        chatbotInput.focus();
      }
      if (chatbotMessages) {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
      }
    }, 100);
  }
}

// Close chatbot window
function closeChatbot() {
  if (!chatbotWindow) return;
  chatbotWindow.classList.remove("active");
  chatbotToggle.classList.remove("active");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeChatbot);
} else {
  initializeChatbot();
}

// Send message function
function sendMessage() {
  if (!chatbotInput || !chatbotMessages) return;
  
  const message = chatbotInput.value.trim();
  if (message === "") return;

  // Add user message to chat
  addMessage(message, "user");
  chatbotInput.value = "";

  // Show loading indicator
  const loadingDiv = document.createElement("div");
  loadingDiv.classList.add("message", "bot-message", "loading");
  loadingDiv.innerHTML = "<p><span></span><span></span><span></span></p>";
  chatbotMessages.appendChild(loadingDiv);
  
  // Scroll to bottom
  setTimeout(() => {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }, 50);

  // Get bot response
  if (API_KEY && API_URL) {
    // Use API if credentials are provided
    callAPI(message, loadingDiv);
  } else {
    // Use fallback responses
    setTimeout(() => {
      if (loadingDiv.parentNode) {
        loadingDiv.remove();
      }
    }, 500);
  }
}

// Call API endpoint
async function callAPI(userMessage, loadingDiv) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        message: userMessage,
        // Add any other parameters your API requires
      }),
    });

    const data = await response.json();
    loadingDiv.remove();

    // Extract bot response based on your API response format
    const botResponse =
      data.reply ||
      data.message ||
      data.response ||
      "I understand. How can I help you further?";
    addMessage(botResponse, "bot");
  } catch (error) {
    console.error("API Error:", error);
    loadingDiv.remove();
    addMessage("Sorry, I encountered an error. Please try again.", "bot");
  }
}

// Add message to chat
function addMessage(text, sender) {
  if (!chatbotMessages) return;
  
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender + "-message");
  messageDiv.innerHTML = `<p>${escapeHtml(text)}</p>`;
  chatbotMessages.appendChild(messageDiv);

  // Simple scroll for better iOS compatibility
  setTimeout(() => {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }, 50);
}

// Fallback responses when no API is configured
function getFallbackResponse(userMessage) {
  const responses = {
    hello: "Hi there! How can I help you?",
    hi: "Hello! What can I do for you?",
    help: "I'm here to help! Feel free to ask me anything about Jamal's portfolio, skills, or projects.",
    projects:
      "Jamal has worked on some amazing projects including Agro Bot and an Automated Vehicle. Would you like to know more?",
    skills:
      "Jamal is skilled in React, C++, Arduino, HTML, CSS, and much more!",
    experience:
      "Jamal has interned at Qucoon as a Frontend Developer, at Polaris as a Backend Developer, and worked on Robotics at AfriEdutech.",
    age: "Jamal is 14 years old and already passionate about software development!",
    contact:
      "You can contact Jamal through the contact section on the website!",
    default:
      "That's an interesting question! But right now I am only limited to some answers such as: 1. Projects. 2.Skills 3. Experiences 4. age; You can speak with my creator via his email. Jamalm32110@gmail.com. Thank you.",
    school:
      "Jamal currently attends James Hope college. With an average of 97.2% in computer studdies, and an average of A accross all subjects.",
  };

  const lowerMessage = userMessage.toLowerCase();

  for (const [key, value] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return value;
    }
  }

  return responses.default;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

