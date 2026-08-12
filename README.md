# GitHub Profile Analyzer

## About

A lightweight, read-only developer tool that analyzes public GitHub profiles using the GitHub REST API. It summarizes public repositories, stars, forks, followers, language usage, recent activity, and other publicly available profile information directly in the browser.

## What it does

Enter a GitHub username and the app summarizes:

- Public repository count
- Total stars across owned public repositories
- Total forks across owned public repositories
- Followers
- Top repositories
- Primary language mix
- Recent public GitHub activity
- Basic public profile information

The app loads `Arondith` by default and can analyze another public account from the search field or a `?user=USERNAME` query parameter.

## GitHub API integration

This project uses GitHub's public REST API directly from the browser.

Endpoints used:

```text
GET /users/{username}
GET /users/{username}/repos
GET /users/{username}/events/public
```

Requests include GitHub's REST API version header and use only public, read-only data. No password, personal access token, private repository access, or write permission is requested.

## Run locally

Because this is a static HTML/CSS/JavaScript project, no build step is required.

1. Clone or download the repository.
2. Open the project in VS Code.
3. Serve the folder with Live Server or another static HTTP server.
4. Open `index.html` in the browser.

A local server is recommended rather than opening the file directly so browser networking behavior matches a deployed site more closely.

## Project files

```text
index.html   — application markup
styles.css   — responsive interface styling
app.js       — GitHub REST API integration and data analysis
README.md    — project documentation
```

## Privacy and security

- The app is read-only.
- It only requests information GitHub already exposes publicly.
- It does not collect or store GitHub credentials.
- It does not include a GitHub personal access token in client-side code.

## GitHub Developer Program

This project is an integration in development that uses the GitHub API. GitHub's Developer Program is open to individual developers and companies with an integration in development or production that uses the GitHub API and a support contact email.

Before applying, make sure the project is publicly accessible and provide a support email you are comfortable using for the integration.

## Author

Built by [Arondith](https://github.com/Arondith).
