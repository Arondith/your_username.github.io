const API_BASE = 'https://api.github.com';
const API_VERSION = '2022-11-28';

const form = document.querySelector('#search-form');
const usernameInput = document.querySelector('#username');
const analyzeButton = document.querySelector('#analyze-button');
const statusEl = document.querySelector('#status');
const resultsEl = document.querySelector('#results');

const avatarEl = document.querySelector('#avatar');
const displayNameEl = document.querySelector('#display-name');
const accountTypeEl = document.querySelector('#account-type');
const profileLinkEl = document.querySelector('#profile-link');
const bioEl = document.querySelector('#bio');
const profileMetaEl = document.querySelector('#profile-meta');
const reposCountEl = document.querySelector('#repos-count');
const starsCountEl = document.querySelector('#stars-count');
const forksCountEl = document.querySelector('#forks-count');
const followersCountEl = document.querySelector('#followers-count');
const repoListEl = document.querySelector('#repo-list');
const languageListEl = document.querySelector('#language-list');
const activityListEl = document.querySelector('#activity-list');
const apiNoteEl = document.querySelector('#api-note');

function apiHeaders() {
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': API_VERSION,
  };
}

async function githubFetch(path) {
  const response = await fetch(`${API_BASE}${path}`, { headers: apiHeaders() });

  if (!response.ok) {
    const error = new Error(`GitHub API request failed with status ${response.status}`);
    error.status = response.status;
    error.rateRemaining = response.headers.get('x-ratelimit-remaining');
    error.rateReset = response.headers.get('x-ratelimit-reset');
    throw error;
  }

  return {
    data: await response.json(),
    rateRemaining: response.headers.get('x-ratelimit-remaining'),
  };
}

function setStatus(message = '', isError = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('error', isError);
}

function setLoading(isLoading) {
  analyzeButton.disabled = isLoading;
  analyzeButton.textContent = isLoading ? 'Analyzing…' : 'Analyze';
}

function formatNumber(value) {
  return new Intl.NumberFormat().format(value ?? 0);
}

function formatDate(dateString) {
  if (!dateString) return null;
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

function relativeTime(dateString) {
  const date = new Date(dateString);
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));

  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateString);
}

function appendMeta(label, value) {
  if (!value) return;
  const span = document.createElement('span');
  span.textContent = `${label}: ${value}`;
  profileMetaEl.appendChild(span);
}

function renderProfile(profile) {
  avatarEl.src = profile.avatar_url;
  avatarEl.alt = `${profile.login} avatar`;
  displayNameEl.textContent = profile.name || profile.login;
  accountTypeEl.textContent = profile.type || 'User';
  profileLinkEl.href = profile.html_url;
  profileLinkEl.textContent = `@${profile.login}`;
  bioEl.textContent = profile.bio || 'No public bio provided.';

  profileMetaEl.replaceChildren();
  appendMeta('Location', profile.location);
  appendMeta('Company', profile.company);
  appendMeta('Joined', formatDate(profile.created_at));

  reposCountEl.textContent = formatNumber(profile.public_repos);
  followersCountEl.textContent = formatNumber(profile.followers);
}

function repoScore(repo) {
  return (repo.stargazers_count * 4) + (repo.forks_count * 2) + (repo.watchers_count || 0);
}

function renderRepositories(repos) {
  const ownRepos = repos.filter((repo) => !repo.fork);
  const totalStars = ownRepos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = ownRepos.reduce((sum, repo) => sum + repo.forks_count, 0);

  starsCountEl.textContent = formatNumber(totalStars);
  forksCountEl.textContent = formatNumber(totalForks);

  const topRepos = [...ownRepos]
    .sort((a, b) => repoScore(b) - repoScore(a) || new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 6);

  repoListEl.replaceChildren();

  if (!topRepos.length) {
    repoListEl.appendChild(emptyState('No public, non-fork repositories found.'));
    return;
  }

  topRepos.forEach((repo) => {
    const item = document.createElement('article');
    item.className = 'repo-item';

    const titleRow = document.createElement('div');
    titleRow.className = 'repo-title-row';

    const link = document.createElement('a');
    link.className = 'repo-name';
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = repo.name;

    const stars = document.createElement('span');
    stars.className = 'repo-stars';
    stars.textContent = `★ ${formatNumber(repo.stargazers_count)}`;

    titleRow.append(link, stars);

    const description = document.createElement('p');
    description.className = 'repo-description';
    description.textContent = repo.description || 'No repository description.';

    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    [
      repo.language || 'No primary language',
      `⑂ ${formatNumber(repo.forks_count)} forks`,
      `Updated ${relativeTime(repo.updated_at)}`,
    ].forEach((text) => {
      const span = document.createElement('span');
      span.textContent = text;
      meta.appendChild(span);
    });

    item.append(titleRow, description, meta);
    repoListEl.appendChild(item);
  });
}

function renderLanguages(repos) {
  const counts = new Map();

  repos
    .filter((repo) => !repo.fork && repo.language)
    .forEach((repo) => {
      counts.set(repo.language, (counts.get(repo.language) || 0) + 1);
    });

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  languageListEl.replaceChildren();

  if (!sorted.length) {
    languageListEl.appendChild(emptyState('No language data available.'));
    return;
  }

  const total = sorted.reduce((sum, [, count]) => sum + count, 0);

  sorted.forEach(([language, count]) => {
    const percent = Math.round((count / total) * 100);
    const row = document.createElement('div');
    row.className = 'language-row';

    const label = document.createElement('div');
    label.className = 'language-label';

    const name = document.createElement('span');
    name.textContent = language;
    const value = document.createElement('span');
    value.textContent = `${percent}%`;
    label.append(name, value);

    const track = document.createElement('div');
    track.className = 'language-track';
    const fill = document.createElement('div');
    fill.className = 'language-fill';
    fill.style.width = `${percent}%`;
    track.appendChild(fill);

    row.append(label, track);
    languageListEl.appendChild(row);
  });
}

function eventSummary(event) {
  const repo = event.repo?.name || 'a repository';

  switch (event.type) {
    case 'PushEvent':
      return `Pushed ${event.payload?.commits?.length || 'changes'} to ${repo}`;
    case 'PullRequestEvent':
      return `${capitalize(event.payload?.action || 'updated')} a pull request in ${repo}`;
    case 'IssuesEvent':
      return `${capitalize(event.payload?.action || 'updated')} an issue in ${repo}`;
    case 'IssueCommentEvent':
      return `Commented in ${repo}`;
    case 'CreateEvent':
      return `Created ${event.payload?.ref_type || 'content'} in ${repo}`;
    case 'ForkEvent':
      return `Forked ${repo}`;
    case 'WatchEvent':
      return `Starred ${repo}`;
    case 'ReleaseEvent':
      return `${capitalize(event.payload?.action || 'updated')} a release in ${repo}`;
    default:
      return `${event.type.replace(/Event$/, '')} activity in ${repo}`;
  }
}

function capitalize(value) {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderActivity(events) {
  activityListEl.replaceChildren();
  const recent = events.slice(0, 7);

  if (!recent.length) {
    activityListEl.appendChild(emptyState('No recent public events available.'));
    return;
  }

  recent.forEach((event) => {
    const item = document.createElement('div');
    item.className = 'activity-item';

    const dot = document.createElement('span');
    dot.className = 'activity-dot';

    const text = document.createElement('div');
    text.textContent = `${eventSummary(event)} · ${relativeTime(event.created_at)}`;

    item.append(dot, text);
    activityListEl.appendChild(item);
  });
}

function emptyState(message) {
  const p = document.createElement('p');
  p.className = 'empty-state';
  p.textContent = message;
  return p;
}

function normalizeUsername(value) {
  return value.trim().replace(/^@/, '');
}

function explainError(error, username) {
  if (error.status === 404) return `No public GitHub account found for “${username}”.`;
  if (error.status === 403 && error.rateRemaining === '0') {
    return 'GitHub’s unauthenticated API rate limit has been reached. Try again after the rate-limit window resets.';
  }
  return 'GitHub could not be reached right now. Please try again.';
}

async function analyze(username) {
  const cleanUsername = normalizeUsername(username);
  if (!cleanUsername) return;

  setLoading(true);
  setStatus(`Loading @${cleanUsername} from the GitHub REST API…`);

  try {
    const profileResponse = await githubFetch(`/users/${encodeURIComponent(cleanUsername)}`);
    const [reposResponse, eventsResponse] = await Promise.all([
      githubFetch(`/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated&type=owner`),
      githubFetch(`/users/${encodeURIComponent(cleanUsername)}/events/public?per_page=30`),
    ]);

    renderProfile(profileResponse.data);
    renderRepositories(reposResponse.data);
    renderLanguages(reposResponse.data);
    renderActivity(eventsResponse.data);

    const remaining = eventsResponse.rateRemaining ?? reposResponse.rateRemaining ?? profileResponse.rateRemaining;
    apiNoteEl.textContent = remaining !== null
      ? `GitHub REST API · ${remaining} unauthenticated requests remaining in the current rate-limit window.`
      : 'Data provided by the GitHub REST API.';

    resultsEl.hidden = false;
    setStatus(`Analysis complete for @${cleanUsername}.`);
    history.replaceState(null, '', `?user=${encodeURIComponent(cleanUsername)}`);
  } catch (error) {
    resultsEl.hidden = true;
    setStatus(explainError(error, cleanUsername), true);
  } finally {
    setLoading(false);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  analyze(usernameInput.value);
});

const initialUser = new URLSearchParams(window.location.search).get('user') || 'Arondith';
usernameInput.value = initialUser;
analyze(initialUser);
