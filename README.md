#  Multimodal AI Resume Parser (n8n + Gemini)

Most resume parsers break the second a candidate uploads a Word document or a screenshot from their phone. This one doesn't.

This is an enterprise-grade, fully automated data extraction pipeline built in n8n. It monitors a Google Drive folder, dynamically routes files based on their MIME type (PDF, DOCX, PNG/JPEG), and uses Google Gemini's Multimodal AI to extract candidate data into a strictly validated, production-ready JSON format.

![n8n Architecture](./assets/workflow.png)

##  The Architecture (How it works)

This workflow doesn't just read text; it uses a **Router Pattern** to process messy, real-world data streams.

* **Smart Deduplication (The Bouncer):** A custom JavaScript node cross-references incoming files with previously generated JSONs. It only processes *new* resumes, preventing infinite loops and saving your API limits.
* **Dynamic Multimodal Routing:** A Switch node acts as a traffic cop:
  * **PDFs:** Routed directly to a LangChain document extractor.
  * **DOCX:** Routed through a CloudConvert loopback to flatten messy XML formatting into clean PDFs before parsing.
  * **Images/Screenshots:** Routed to a dedicated Gemini Vision node for native OCR and structured extraction.
* **Strict JSON Normalization:** Custom parsers force the LLM output into a rigid schema. Missing fields are safely handled (e.g., nulls for text, `[]` for arrays) ensuring your downstream databases never crash from unexpected LLM hallucinations.
* **Zero-Touch Automation:** Automatically downloads raw files from Google Drive and uploads the standardized JSON artifacts to an output folder.

##  Prerequisites

To import and run this workflow, you need:
1. An [n8n](https://n8n.io/) instance (Local, Cloud, or Docker).
2. **Google Cloud Credentials:** To allow n8n to read/write to your Google Drive.
3. **Google Gemini API Key:** Powers the AI text and vision extraction (Gemini 2.5/3.0).
4. **CloudConvert API Key:** A free account handles the `.docx` to `.pdf` conversions.

## 🛠 Quick Start Guide

1. Clone this repository and locate the `resume-scanner-api-jsonformat.json` file.
2. In your n8n workspace, click **Workflows** -> **Import from File**, and upload the JSON.
3. You will see red warning icons on a few nodes. Click them to connect your Google Drive, Gemini, and CloudConvert credentials.
4. **Link Your Folders:** Open the two `Search files and folders` nodes. Replace the placeholder Google Drive folder IDs in the `Query String` with your actual Drive folder IDs (one for input, one for output).
5. Drop a mix of PDFs, Images, and Word docs into your input folder and hit **Execute Workflow**.

##  The Output Schema

The pipeline guarantees a strictly typed JSON object for every resume. Example output:

```json
{
"full_name": "Nayan Chellani",
  "email": "chellaninayan@gmail.com",
  "phone_primary": "+91 9322380234",
  "location": "Thane, Mumbai, India",
  "total_experience_years": 0,
  "key_skills": [
    "JavaScript",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "AWS",
    "Python",
    "HTML",
    "CSS"
  ]
  }
