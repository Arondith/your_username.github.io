# GitHub Profile Analyzer

## About

A lightweight **read-only GitHub profile analysis tool** built with HTML, CSS, JavaScript, and the GitHub REST API. The application lets a user enter any public GitHub username and converts publicly available account data into an easy-to-read developer profile summary directly in the browser.

The analyzer retrieves **basic profile information, public repository count, followers, total stars, total forks, top repositories, primary language usage, and recent public activity**. It uses GitHub's public API without collecting passwords, storing credentials, requesting private-repository access, or embedding a personal access token in the front-end code.

The project demonstrates practical REST API integration, asynchronous JavaScript requests, data aggregation, dynamic interface updates, error handling, and privacy-conscious use of public developer data.

## Core features

- Search and analyze a public GitHub username
- Display basic public profile information
- Count public repositories
- Calculate total stars across owned public repositories
- Calculate total forks
- Display follower information
- Rank / display top repositories
- Summarize primary programming-language usage
- Show recent public GitHub activity
- Support usernames through the search field or `?user=USERNAME`
- Read-only GitHub REST API integration
- No GitHub password or private data required

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

## Technology

- HTML
- CSS
- JavaScript
- GitHub REST API
- Asynchronous API requests
- Client-side data processing

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
