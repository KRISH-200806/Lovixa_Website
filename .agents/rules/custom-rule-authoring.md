# Plain-English Custom Rule Authoring Guide

Whenever the user states a custom rule, preference, constraint, or requirement in plain English (e.g., *"I don't want any jQuery"*, *"Never use localStorage"*, *"Always require phone number in forms"*), the AI Agent MUST automatically perform the following 3 steps:

1. **Create AI Rule File**: Create `.cursor/rules/custom-<topic>.mdc` and `.agents/rules/custom-<topic>.md`.
2. **Register into `custom-rules.json`**: Append pattern to `custom-rules.json` for static CLI scan.
3. **Confirm**: Notify user that rule is active across AI, CLI, and Git pre-commit.
