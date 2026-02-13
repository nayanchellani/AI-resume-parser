#  AI Resume Parser & Analyzer

A sophisticated automation workflow that extracts structured data from resume PDFs using Large Language Models (LLM) and organizes candidates into a central database.

Workflow Diagram <img width="1046" height="434" alt="image" src="https://github.com/user-attachments/assets/adface82-f3ee-4abe-b21a-e91acfd7f634" />


## 🚀 Features
- **Dual-Engine Support:** configured to work with **Google Gemini (Cloud)** for speed or **Ollama (Local)** for privacy.
- **Automated Extraction:** Parses complex PDFs to extract Name, Email, Skills, and Experience.
- **Duplicate Prevention:** Checks existing database (Google Sheets) before adding new candidates.
- **Format Standardization:** Converts unstructured text into strict JSON format.

## 🛠️ Tech Stack
- **Orchestrator:** n8n (Workflow Automation)
- **AI Models:** Google Gemini 1.5 Flash / Ollama (Qwen 2.5 7B)
- **Database:** Google Sheets
- **Tunneling:** Ngrok (for local LLM connectivity)

## ⚙️ How to Use
1. **Import:** Download `resume-parser-workflow.json` and import it into your n8n instance.
2. **Setup Credentials:**
   - Add your Google Sheets OAuth2 credentials.
   - Add your Gemini API Key (or connect Local Ollama).
3. **Configure Sheet:** Create a Google Sheet with columns: `name`, `email`, `phone`, `skills`, `experience`.
4. **Activate:** Toggle the workflow to 'Active' and use the Production Webhook URL.

