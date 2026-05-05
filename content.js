const GROQ_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual API key


let btn = document.createElement("button");
btn.innerText = "AI Suggest Improvements";
btn.style.position = "fixed";
btn.style.top = "100px";
btn.style.right = "20px";
btn.style.zIndex = "9999";
btn.style.padding = "10px";
btn.style.backgroundColor = "#0073b1";
btn.style.color = "white";
btn.style.border = "none";
btn.style.borderRadius = "5px";
btn.style.cursor = "pointer";

let outputBox = document.createElement("div");
outputBox.style.position = "fixed";
outputBox.style.top = "160px";
outputBox.style.right = "20px";
outputBox.style.width = "300px";
outputBox.style.backgroundColor = "white";
outputBox.style.border = "1px solid #ccc";
outputBox.style.padding = "10px";
outputBox.style.borderRadius = "10px";
outputBox.style.zIndex = "9999";
outputBox.style.fontSize = "14px";
outputBox.style.color = "#333";
outputBox.style.maxHeight = "500px";
outputBox.style.overflowY = "auto";

let outputText = document.createElement("p");
outputText.innerText = "Click button to analyze profile...";
outputBox.appendChild(outputText);

document.body.appendChild(btn);
document.body.appendChild(outputBox);

function showSuggestions(reply) {
  // ✅ Fixed extraction — line by line parse karo
  let headlineNew = "";
  let aboutNew = "";
  let collectingAbout = false;
  let aboutLines = [];

  let lines = reply.split('\n');
  for(let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Headline dhundo
    if(line.match(/IMPROVED HEADLINE/i)) {
      collectingAbout = false;
      // Same line mein colon ke baad content
      let colonPart = line.split(':').slice(1).join(':').trim();
      colonPart = colonPart.replace(/^["*\s]+|["*\s]+$/g, "").trim();
      if(colonPart.length > 5) {
        headlineNew = colonPart;
      } else {
        // Agli line mein content hoga
        let next = lines[i+1]?.trim() || "";
        headlineNew = next.replace(/^["*\s]+|["*\s]+$/g, "").trim();
      }
    }

    // About section dhundo
    if(line.match(/IMPROVED ABOUT SECTION/i)) {
      collectingAbout = true;
      aboutLines = [];
      // Same line mein colon ke baad content check karo
      let colonPart = line.split(':').slice(1).join(':').trim();
      colonPart = colonPart.replace(/^["*\s]+|["*\s]+$/g, "").trim();
      if(colonPart.length > 10) {
        aboutLines.push(colonPart);
      }
      continue;
    }

    // About collect karo jab tak PRO TIPS na aaye
    if(collectingAbout) {
      if(line.match(/PRO TIPS|7\.|PRO_TIPS/i)) {
        collectingAbout = false;
      } else {
        if(line.length > 0) aboutLines.push(line);
      }
    }
  }

  aboutNew = aboutLines.join(" ").replace(/^["*\s]+|["*\s]+$/g, "").trim();

  if(!headlineNew && !aboutNew) return;

  let suggestDiv = document.createElement("div");
  suggestDiv.style.marginTop = "15px";
  suggestDiv.style.borderTop = "2px solid #0073b1";
  suggestDiv.style.paddingTop = "10px";

  suggestDiv.innerHTML = `
    <p style="font-weight:bold;color:#0073b1;font-size:14px;margin:0 0 10px 0">
      ✨ Apply Suggestions:
    </p>

    ${headlineNew ? `
    <div style="margin-bottom:10px;padding:8px;background:#f0f7ff;border-radius:8px;border:1px solid #cce4f7">
      <p style="font-size:11px;color:#666;margin:0 0 4px 0">📝 New Headline:</p>
      <p style="margin:0 0 8px 0;font-size:12px;color:#333">${headlineNew}</p>
      <button id="applyHeadlineBtn" style="background:#0073b1;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px;width:100%">
        ✅ Apply Headline to LinkedIn
      </button>
    </div>` : ""}

    ${aboutNew ? `
    <div style="padding:8px;background:#f0f7ff;border-radius:8px;border:1px solid #cce4f7">
      <p style="font-size:11px;color:#666;margin:0 0 4px 0">📄 New About:</p>
      <p style="margin:0 0 8px 0;font-size:12px;color:#333">${aboutNew.substring(0, 120)}...</p>
      <button id="applyAboutBtn" style="background:#0073b1;color:white;border:none;padding:6px 12px;border-radius:5px;cursor:pointer;font-size:12px;width:100%">
        ✅ Apply About to LinkedIn
      </button>
    </div>` : ""}
  `;

  outputBox.appendChild(suggestDiv);

  // Headline Apply
  document.getElementById("applyHeadlineBtn")?.addEventListener("click", () => {
    let editBtn = document.querySelector("a[href*='edit/intro']") ||
                  document.querySelector("button.pv-top-card--edit-btn");
    if(editBtn) {
      editBtn.click();
      setTimeout(() => {
        let headlineField = document.querySelector("input#headline") ||
                           document.querySelector("input[name='headline']") ||
                           document.querySelector("input[id*='headline']");
        if(headlineField) {
          headlineField.focus();
          headlineField.select();
          headlineField.value = headlineNew;
          headlineField.dispatchEvent(new Event('input', {bubbles: true}));
          headlineField.dispatchEvent(new Event('change', {bubbles: true}));
          alert("✅ Headline fill ho gayi! Ab Save button click karo.");
        } else {
          navigator.clipboard.writeText(headlineNew);
          alert("📋 Copied! Edit box mein paste karo.");
        }
      }, 2000);
    } else {
      navigator.clipboard.writeText(headlineNew);
      alert("📋 Headline copied!\n\n1. Profile pe pencil icon click karo\n2. Headline box mein paste karo\n3. Save karo");
    }
  });

  // About Apply
  document.getElementById("applyAboutBtn")?.addEventListener("click", () => {
    navigator.clipboard.writeText(aboutNew);
    let aboutEditBtn = document.querySelector("a[href*='edit/summary']") ||
                       document.querySelector("section#about button");
    if(aboutEditBtn) {
      aboutEditBtn.click();
      setTimeout(() => {
        let aboutField = document.querySelector("textarea#summary") ||
                        document.querySelector("textarea[name='summary']");
        if(aboutField) {
          aboutField.focus();
          aboutField.value = aboutNew;
          aboutField.dispatchEvent(new Event('input', {bubbles: true}));
          alert("✅ About fill ho gayi! Ab Save karo.");
        } else {
          alert("📋 About copied!\n\n1. About section pe pencil click karo\n2. Paste karo\n3. Save karo");
        }
      }, 2000);
    } else {
      alert("📋 About copied!\n\n1. About section pe pencil click karo\n2. Paste karo\n3. Save karo");
    }
  });
}

btn.addEventListener("click", async () => {
  outputBox.innerHTML = "⏳ AI analyze kar raha hai...";

  let name = document.querySelector("p._9215e3ad._6a0a9947")?.innerText || "";
  let headline = document.querySelector("p.aef4888d")?.innerText || "";
  let username = window.location.pathname.split("/")[2] || "";

  let pageText = [];
  document.querySelectorAll("p, span, li, h3").forEach(el => {
    let text = el.innerText?.trim();
    if(text && text.length > 30 && text.length < 400) {
      let skipWords = ["ad preferences", "Help Center", "Privacy",
                       "LinkedIn Corporation", "seeing this ad",
                       "Someone at", "National Highways",
                       "notifications", "Content Security"];
      let shouldSkip = skipWords.some(word => text.includes(word));
      if(!shouldSkip) pageText.push(text);
    }
  });

  let uniqueText = [...new Set(pageText)].join("\n");
  let profileText = `
Name: ${name}
Profile URL: linkedin.com/in/${username}
Headline: ${headline}
Other Profile Data:
${uniqueText.substring(0, 2500)}
`;

  chrome.runtime.sendMessage(
    {
      type: "AGENT_AI_CALL",
      profileText: `Review this LinkedIn profile in detail and give:
1. RATING: Score out of 10
2. STRENGTHS: Min 4 points
3. WEAKNESSES: Min 4 points
4. MISSING KEYWORDS
5. IMPROVED HEADLINE
6. IMPROVED ABOUT section
7. PRO TIPS: 5 tips

Profile Data:
${profileText}`
    },
    (response) => {
      if (response && response.success) {
        let reply = response.data?.response ||
                    response.data?.message ||
                    response.data?.reply ||
                    JSON.stringify(response.data);

        outputBox.innerHTML = reply
          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
          .replace(/\n\n/g, "<br><br>")
          .replace(/\n/g, "<br>")
          .replace(/(\d+\.\s)/g, "<br><b>$1</b>");

        showSuggestions(reply);

      } else {
        fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{
              role: "user",
              content: `You are a LinkedIn profile expert. Analyze this profile:
1. RATING: Score out of 10
2. STRENGTHS: Min 4 points
3. WEAKNESSES: Min 4 points
4. MISSING KEYWORDS
5. IMPROVED HEADLINE: write it
6. IMPROVED ABOUT SECTION: write it
7. PRO TIPS: 5 tips

Profile:
${profileText}`
            }],
            max_tokens: 2048
          })
        })
        .then(r => r.json())
        .then(data => {
          if(data.choices?.[0]) {
            let reply = data.choices[0].message.content;
            outputBox.innerHTML = reply
              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
              .replace(/\n\n/g, "<br><br>")
              .replace(/\n/g, "<br>")
              .replace(/(\d+\.\s)/g, "<br><b>$1</b>");
            showSuggestions(reply);
          } else {
            outputBox.innerHTML = "API Error: " + JSON.stringify(data);
          }
        })
        .catch(err => {
          outputBox.innerHTML = "Error: " + err.message;
        });
      }
    }
  );
});