chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "AGENT_AI_CALL") {
    fetch("https://api.agent.ai/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        agent_id: "lelqzmx7ahjykzyd",
        message: request.profileText
      })
    })
    .then(r => r.json())
    .then(data => sendResponse({ success: true, data: data }))
    .catch(err => sendResponse({ success: false, error: err.message }));
    return true;
  }
});