# Project Rooted: Product Requirements Document (PRD)

> [!IMPORTANT]  
> **Course/Event Context:** UK Work Culture Programme – Ezoic Project 1: AI-Assisted MVP  
> **Presentation Date:** Wed 25th March, 11:10 AM  
> **Deliverables Required:** Live MVP Demo, Presentation (Problem, Solution, Build Process), and Reflection on Prompt Engineering.

---

## 1. Problem Identification & App Purpose

**The Problem:** International students and expatriates from diverse cultures relocating to the UK often struggle to find authentic grocery products and ingredients that accurately recreate the flavors of their home countries. Existing solutions (like generic supermarkets) lack cultural context, and finding hidden local grocery stores relies heavily on word-of-mouth.

**The User:** International individuals (e.g., Indian, Arabic, or Portuguese) navigating the UK who want a taste of home.

**App Purpose:** "Rooted" is a community-driven product discovery engine. It helps users find culturally authentic food products, strictly validated by locals from that same culture.

**What "Success" Looks Like for this MVP:**  
A fully interactive cross-cultural demo that successfully:
1. Translates a user's language/culture into tailored search results.
2. Demonstrates the authenticity sorting algorithm.
3. Collects a 0-10 authenticity rating that feeds back into the recommendation loop.

---

## 2. Core Feature & Primary User Journey

*Per the Ezoic curriculum requirements, this MVP focuses on a single core feature flow.*

**Primary User Journey: The Discovery to Validation Loop**
1. **Search (Language/Culture Based):** The user opens the app and searches for an ingredient using their native tongue (e.g., Hindi, Arabic, Portuguese). The app auto-detects their culture.
2. **Sort & Filter:** The app displays a "Bank" of products found locally. By default, these are sorted by the core metric: **Highest Authenticity** (approved by local people), with optional secondary filters for Distance and Price.
3. **Review & Rate:** The user clicks a product and submits their own feedback. They are prompted with the mandatory question: *"Scale 0-10: How authentic is this product compared to what you used to have in your home country?"* They may also optionally leave a written review.
4. **Recommendation Loop:** The app updates the product's authenticity score, dynamically affecting future search rankings for that item.

---

## 3. Product Branding & Design Guidelines

To impress the judges, **Rooted** needs to feel incredibly premium, warm, and nostalgic.

### Brand Persona
Authentic, Nostalgic, Trustworthy, and Welcoming. 

### Color Palette
* **Primary (The Roots):** Saffron/Terracotta (`#D95D39`) – Represents spices, earth, warmth.
* **Secondary (The Growth):** Basil Green (`#204E4A`) – Denotes freshness, trust, and validation.
* **Backgrounds:** Warm Sand / Off-White (`#F9F6F0`) – Reduces eye strain and feels organic.

### Typography & Layout
* **Headings:** *Playfair Display* or *Lora*. A sophisticated serif font.
* **Body:** *Inter* or *Outfit*. A legible sans-serif that supports international unicode characters (Arabic, Devanagari).
* **RTL Support:** Soft drop shadows, rounded corners, and Right-to-Left layout responsiveness when transitioning to the Arabic language demo.

---

## 4. Tech Stack Recommendation (For the AI-Assisted Demo)

Since this project requires AI collaboration to build the MVP, the stack focuses on rapid code generation and modern interactivity.

| Component | Technology | Why for this demo? |
| :--- | :--- | :--- |
| **Framework** | Vite + React (or Next.js) | AI tools (like Claude/ChatGPT/Copilot) write excellent React code, making it highly compatible with the AI-assisted build requirement. |
| **Styling** | Vanilla CSS (CSS Modules) | Ensures we can control a custom design system easily generated via prompt engineering. |
| **Translations** | `react-i18next` | Critical for showing the Indian, Arabic, and Portuguese demos seamlessly. |
| **Data/Backend** | Mock JSON + React Context | No real backend needed. We will use AI to mock high-quality product JSON databases for the "Bank of products". |

---

## 5. AI Collaboration & Prompt Engineering Narrative (Required Deliverable)

Because the academic rubric grades you heavily on **how you worked with AI**, you must keep an ongoing log of your prompt engineering process while building Rooted.

**Maintain a Document Tracking:**
* **Key Prompts Used:** (e.g., *"Act as a UI/UX expert. Design a React component for a 0-10 authenticity rating slider..."*)
* **How Prompts Changed Over Time:** Documenting how you refined initial generic code into a culturally responsive UI.
* **What Worked vs. Failed:** Noting when the AI hallucinated the Right-to-Left Arabic layout, and how you fixed it.
* **Human Intervention:** Where you had to step in and fix the code manually (e.g., adjusting CSS for the "Distance vs. Price" sort toggle).

> [!TIP]  
> **Pitch Strategy:** During your presentation on Wed 25th, dedicate 2 minutes directly to your AI workflow. Show a slide contrasting your *first AI prompt* vs your *final refined prompt*, and discuss the limitations you faced when prompting for complex Right-to-Left Arabic UI translations.
