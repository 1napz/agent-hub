When managing merges for a GitHub repository like **Zyntro-Media-AI/new-crystalcastle**, choosing the right merge workflow depends on your team size, release frequency, and repository structure.
Here are the standard recommended workflows and best practices tailored for Git and GitHub.
### 1. Recommended Merge Strategies
GitHub offers three primary merge strategies. Select the one that fits your commit history preference:
 * **Squash and Merge (Recommended for feature branches):**
   * **Use Case:** Merging feature/bugfix branches into main or develop.
   * **Why:** Combines all commits from a feature branch into a single, clean commit on the destination branch. Keeps the commit history readable and linear.
   * **Command Equivalent:** git merge --squash feature-branch
 * **Rebase and Merge (Best for linear history without squashing):**
   * **Use Case:** Teams that want individual commits preserved on main without creating merge commits.
   * **Why:** Appends all commits from the PR branch directly onto the base branch linearly.
 * **Merge Commit (Create a merge commit):**
   * **Use Case:** Merging long-lived branches (e.g., release into main, or main into staging).
   * **Why:** Preserves full branch history and explicit context of when a branch was merged.
### 2. Standard GitHub PR Merge Workflow
#### Step 1: Feature Branch Creation
Always develop in isolated feature, bugfix, or chore branches created from the latest base branch (main or develop).
```bash
# Update base branch
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/your-feature-name

```
#### Step 2: Keep Branch Up to Date
Before submitting or merging a PR, incorporate upstream changes from main into your feature branch to resolve conflicts early.
```bash
# Option A: Rebase (Cleaner history)
git fetch origin
git rebase origin/main

# Option B: Merge main into feature branch
git fetch origin
git merge origin/main

```
#### Step 3: Open a Pull Request (PR)
 1. Push your branch to GitHub:
   ```bash
   git push -u origin feature/your-feature-name
   
   ```
 2. Create a PR targeting main (or develop).
 3. Fill out the PR template with:
   * **Summary:** What changes were made.
   * **Testing:** How changes were verified.
   * **Linked Issues:** Use Closes #123 or Fixes #123 to auto-close issues upon merge.
#### Step 4: Automated CI Checks & Code Review
Set up repository protection rules requiring:
 * Passing continuous integration (CI) status checks (e.g., unit tests, linters, security scanners).
 * At least **1–2 required approvals** from repository code owners or peers.
#### Step 5: Merge and Cleanup
 1. Use **Squash and Merge** on GitHub.
 2. Delete the remote and local feature branches post-merge:
   ```bash
   # Delete remote branch via CLI or GitHub UI
   git push origin --delete feature/your-feature-name
   
   # Clean up local references
   git checkout main
   git pull origin main
   git branch -d feature/your-feature-name
   git fetch -p
   
   ```
### 3. Repository Protection Rules (Best Practices)
To ensure smooth merges without breaking main, configure **Branch Protection Rules** under Settings > Branches in your repository:
 1. **Require a pull request before merging:** Prevent direct pushes to main.
 2. **Require status checks to pass:** Ensure GitHub Actions or CI runs pass before the merge button becomes active.
 3. **Require signed commits / linear history:** Optional, but helps enforce commit integrity.
 4. **Automatically delete head branches:** Automatically cleans up deleted feature branches upon PR merge.
