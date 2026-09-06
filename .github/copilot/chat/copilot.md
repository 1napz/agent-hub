# GitHub Copilot Chat — Responsible AI Application Card

## 1. Overview
**GitHub Copilot Chat** is a conversational coding assistant available on GitHub.com, VS Code, Visual Studio, JetBrains/Eclipse IDEs, GitHub Mobile, and Windows Terminal. It answers coding questions, explains code, suggests fixes, generates tests, and produces PR summaries & commit messages. It is **optimized primarily for English** and coding-related queries only.

Built on Microsoft’s six Responsible AI principles — **fairness, reliability & safety, privacy & security, inclusiveness, transparency, accountability** — and governed by Microsoft’s Responsible AI Standard v2. 🔗 Transparency Report: [Microsoft Responsible AI Transparency Report 2025](https://cdn-dynmedia-1.microsoft.com/is/content/microsoftcorp/microsoft/msc/documents/presentations/CSR/Responsible-AI-Transparency-Report-2025-vertical.pdf)

---

## 2. Key Terms
- **Content filtering**: Scans prompts & responses to block harmful content
- **Hallucination**: Plausible but factually incorrect output — requires human review
- **LLM**: Large language model — powers understanding & generation
- **Public code matching**: Detects suggestions resembling public code; blocks or annotates with source/license
- **Red teaming**: Deliberate probing to uncover vulnerabilities pre/post-release
- **Training data**: Publicly available text & code — quality varies by language volume/diversity

---

## 3. Capabilities
- 💬 **Conversational assistance**: Answers syntax, concepts, debugging, design questions
- 🧠 **Context-aware**: Uses open files, repo data, chat history, web search (optional)
- 🤖 **Agent mode**: Multi-step planning, tool use, iteration in IDEs
- 📂 **Copilot Spaces**: Curated context bundles for project-specific answers
- 📝 **PR summaries & commit messages**: Auto-generates change overviews
- 🔑 **BYOK**: Connect to third-party models (Anthropic, OpenAI, Google, etc.)

---

## 4. Intended Uses
- Answer coding questions & explain code
- Generate unit tests & propose bug fixes
- Summarize PRs, commits, issues & release notes
- Suggest commands & document CLI usage
- Accelerate onboarding & team knowledge sharing

> **NOT designed for**: non-coding queries, consequential decisions without oversight, or fully autonomous production deployment.

---

## 5. Models & Data
- **Models**: Multiple LLMs available (GPT-5, Claude, Gemini, etc.) — selected by plan
- **Training data**: Public code repositories + public text; quality correlates to language volume
- **BYOK considerations**:
  - Your prompts/responses go to your chosen provider
  - Filtering still applied by GitHub
  - **You own**: API key security, costs, compliance, output validation

---

## 6. How It Works
1. **Input processing**: Combine prompt + context → preprocess
2. **LLM inference**: Analyze & generate response
3. **Safety filtering**: Block harmful content
4. **Formatting & delivery**: Syntax highlighting, links, references

**Evaluations**: SWE-Bench + internal suites measuring resolution rate, latency, tool accuracy. Safety evaluations: hate/unfairness, sexual, violence, self-harm, protected material, jailbreak, code vulnerability — adapted from Microsoft Foundry evaluators.

---

## 7. Key Limitations
| Category | Risk |
|---|---|
| **Language coverage** | Less common languages = lower quality; English primary |
| **Hallucinations** | Code/explanations may look valid but be incorrect |
| **Security** | Generated code may contain vulnerabilities — **always review** |
| **Public code matches** | Rare but possible — test & scan for IP |
| **Non-coding queries** | Responses may be irrelevant/nonsensical |
| **CLI commands** | Potentially destructive — review before executing |
| **PR/Commit summaries** | Not auto-updated; may replicate harmful terms from source |
| **Biases** | Training data biases may be perpetuated |
| **Web search** | Uses Bing — governed by Microsoft Privacy Statement |

---

## 8. Safety & Mitigations
- ✅ **Content filtering**: Blocks harmful outputs
- ✅ **Public code matching**: Detects & blocks/attributes matches
- ✅ **Red teaming**: Pre-deployment adversarial testing
- ✅ **Human oversight**: Required — outputs are suggestions, not facts
- ✅ **Feedback loop**: Thumbs up/down improves model

---

## 9. Responsible Deployment Best Practices
1. **Human review always** — validate all outputs
2. **Not for high-stakes decisions** without independent verification
3. **Code review & test everything** — especially security-critical code
4. **Limit prompts to coding** — improves relevance & safety
5. **Be aware of overreliance risk** — don't blindly accept
6. **Stay updated** — model & safeguards evolve
7. **Report issues** via feedback buttons or `copilot-safety@github.com`

---

## 10. Compliance & Governance
- Built on **Microsoft Responsible AI Standard v2** requirements:
  - **Transparency notes** for platform services
  - **Annual reviews + updates** on new risks/functionality
  - **Impact assessments** for stakeholders
  - **Fairness evaluations** across demographic groups
  - **Reliability & safety monitoring** throughout lifecycle
  - **Privacy & security aligned** with Microsoft policies
- **EU AI Act readiness**: layered compliance approach, prohibited practices screening, documentation workflows
- **Data privacy**: prompts/responses retained per plan; Business/Enterprise not used for model training

---

## 11. Learn More
- 📖 [Copilot Trust Center](https://copilot.github.trust.page/)
- 📖 [Microsoft AI Principles](https://www.microsoft.com/en-us/ai/responsible-ai)
- 📖 [Responsible AI Resources](https://www.microsoft.com/en-us/ai/responsible-ai-resources)
- 📖 [Privacy Statement](https://privacy.microsoft.com/en-us/privacystatement)
- 📖 [Copilot FAQ — Training Data & IP](https://github.com/features/copilot#faq)

---

> **Bottom line**: Copilot Chat is a **powerful coding assistant, not an authoritative source**. Treat all outputs as suggestions to be reviewed, tested, and validated by humans. Use responsibly, keep oversight, and stay updated as capabilities evolve.

Would you like me to adapt this into a concise one-page summary or a team-ready slide deck with key takeaways?