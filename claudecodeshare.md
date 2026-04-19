# 🚀 CLI Share CLI — PRD + TRD (Detailed Version)

---

# 📄 🧠 PRODUCT REQUIREMENTS DOCUMENT (PRD)

---

## 🏷️ Product Name

**CLI Share**

---

## 🎯 Vision

Developers jab AI CLI tools (Claude Code, Codex, etc.) use karte hain,
toh unki conversations valuable hoti hain:

* debugging solutions
* architecture plans
* prompts & outputs
* real dev workflows

👉 Problem:
Ye sab **terminal me locked reh jata hai**, share karna mushkil hota hai.

---

## 🎯 Goal

Ek simple command:

```bash
/share
```

👉 se:

* conversation capture ho
* exact terminal UI preserve ho
* GitHub Gist me convert ho
* shareable link mile

---

## ❓ Why this product?

### Current Problems

1. ❌ Copy paste se UI break ho jata hai
2. ❌ ASCII logo / borders lost ho jate hain
3. ❌ formatting messy ho jati hai
4. ❌ devs ko clean share banana padta hai manually
5. ❌ knowledge reusable nahi hota

---

### ✅ Solution

👉 “One command sharing system”

* no manual work
* no formatting loss
* GitHub native sharing

---

## 👤 Target Users

* Developers using CLI tools
* AI engineers
* Indie hackers
* Open source contributors
* Students learning from AI

---

## 🎯 Use Cases (Real Scenarios)

### 1. Debugging Share

```bash
User: /share
```

👉 dev apna error + solution share karta hai

---

### 2. Learning Content

* “How I built X using AI”
* CLI conversation share as proof

---

### 3. Team Collaboration

* dev apna flow share karta hai
* team review kar sakti hai

---

### 4. Twitter / Community

* raw terminal share → looks authentic 🔥

---

## ⚡ Core Feature

### `/share`

User type kare:

```bash
/share
```

---

## 🧩 Detailed Workflow (STEP BY STEP)

---

### 🔹 Step 1: Command Trigger

User:

```bash
> /share
```

System detect karega:

* ye normal message nahi hai
* ye command hai

---

### 🔹 Step 2: Mode Selection

```bash
Select what to share:

1. Full Conversation (RAW)
2. Custom Range
```

👉 Why?

* user full ya partial share kar sake

---

### 🔹 Step 3: Custom Range (optional)

```bash
Enter range (e.g. 2-5):
```

👉 Why?

* unnecessary logs remove karne ke liye
* sirf important part share karne ke liye

---

### 🔹 Step 4: Visibility

```bash
1. Public
2. Private
```

👉 Why?

* public sharing (community)
* private sharing (team / debugging)

---

### 🔹 Step 5: GitHub Auth

👉 System check karega:

* token hai? → continue
* nahi hai? → login flow

👉 Why GitHub?

* devs already use karte hain
* no new platform needed

---

### 🔹 Step 6: Processing

System internally:

1. raw terminal capture karega
2. ANSI colors remove karega
3. markdown wrap karega

---

### 🔹 Step 7: Upload

GitHub Gist me:

* `.md` file create hogi
* content paste hoga

---

### 🔹 Step 8: Output

```bash
✅ Gist created:
https://gist.github.com/abc123
```

👉 clickable link

---

## 🧠 Core Concept (VERY IMPORTANT)

👉 System messages store nahi karta
👉 System **terminal output capture karta hai**

---

## 📄 🔥 Real Example (Expected Output)

````md
```bash
▐▛███▜▌   Claude Code v2.1.112
▝▜█████▛▘  Sonnet 4.6
  ▘▘ ▝▝    ~/Desktop/plany

❯ i want to design api routes

● Skill(superpowers:brainstorming)
  ⎿ Successfully loaded skill
```
````

Full reference:


---

## 🎯 Output Guarantee

| Element   | Requirement |
| --------- | ----------- |
| ASCII     | preserved   |
| borders   | preserved   |
| spacing   | preserved   |
| symbols   | preserved   |
| structure | preserved   |

---

## 🎨 Color Handling

👉 Terminal colors markdown me render nahi hote

👉 So:

* colors remove (MVP)
* future me HTML preview

---

## 🧠 Why RAW is default?

👉 Because:

* real feel deta hai
* devs trust karte hain
* aesthetic hota hai
* Twitter-friendly

---

## ⚠️ Edge Cases

* empty log
* invalid range
* huge logs
* auth fail

---

# ⚙️ 🧠 TECHNICAL REQUIREMENTS DOCUMENT (TRD)

---

## 🏗️ Architecture

```text
CLI
 ↓
Raw Logger
 ↓
Formatter
 ↓
GitHub OAuth
 ↓
Gist API
```

---

## 🧠 How system actually works

---

### Step 1: CLI Output Generate

```bash
▐▛███▜▌ Claude Code
...
```

---

### Step 2: Raw Capture

```javascript
rawLog += text
```

👉 every line store hoti hai

---

### Step 3: ANSI Remove

```javascript
stripAnsi(rawLog)
```

---

### Step 4: Markdown Wrap

````javascript
```bash
<rawLog>
````

````

---

### Step 5: Upload to Gist

---

### Step 6: Render

👉 GitHub same UI dikha deta hai  

---

## ⚙️ Core Modules

### Raw Logger

```javascript
let rawLog = "";

function log(text) {
  process.stdout.write(text + "\n");
  rawLog += text + "\n";
}
````

---

### Formatter

````javascript
function formatRaw(rawLog) {
  return "```bash\n" + rawLog + "\n```";
}
````

---

### Range Parser

```javascript
function getRange(rawLog, start, end) {
  return rawLog.split("\n").slice(start-1, end).join("\n");
}
```

---

### Gist Upload

```javascript
octokit.gists.create({
  public: true,
  files: {
    "chat.md": {
      content: formatRaw(data)
    }
  }
});
```

---

## 🎯 Output Guarantee

| Feature | Result |
| ------- | ------ |
| ASCII   | ✅      |
| layout  | ✅      |
| spacing | ✅      |
| colors  | ❌      |

---

## 🚀 Final System Summary

👉 System kya karta hai?

> “Terminal ko record karta hai → usko freeze karta hai → GitHub pe replay karta hai”

---

# 💡 Product Insight

Ye sirf feature nahi hai:

👉 **Developer knowledge sharing infrastructure**

---

# ✅ Status

* Clear problem
* Clear solution
* Clear workflow
* Clear system

---
