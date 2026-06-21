const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearNode = document.querySelector('#year');
const clientList = document.querySelector('#clientList');
const extraLinksList = document.querySelector('#extraLinksList');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const getHostFallbackAvatar = (urlString) => {
  try {
    const host = new URL(urlString).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
  } catch {
    return 'https://www.google.com/s2/favicons?domain=youtube.com&sz=128';
  }
};

const getAvatarFromSocialLink = (urlString) => {
  try {
    const url = new URL(urlString);
    const host = url.hostname.toLowerCase();
    const path = url.pathname;

    if (host.includes('youtube.com')) {
      const match = path.match(/@([^/?#]+)/i);
      if (match && match[1]) {
        return `https://unavatar.io/youtube/${match[1]}`;
      }
      return 'https://unavatar.io/youtube';
    }

    if (host.includes('tiktok.com')) {
      const match = path.match(/@([^/?#]+)/i);
      if (match && match[1]) {
        return `https://unavatar.io/tiktok/${match[1]}`;
      }
      return 'https://unavatar.io/tiktok';
    }

    return getHostFallbackAvatar(urlString);
  } catch {
    return getHostFallbackAvatar(urlString);
  }
};

const createClientCard = (client) => {
  const card = document.createElement('a');
  card.className = 'client-card';
  card.href = client.link;
  card.target = '_blank';
  card.rel = 'noreferrer';

  const avatar = document.createElement('img');
  avatar.className = 'client-avatar';
  avatar.loading = 'lazy';
  avatar.alt = `${client.name} profile image`;

  const primaryAvatar = getAvatarFromSocialLink(client.link);
  const fallbackAvatar = getHostFallbackAvatar(client.link);
  avatar.src = primaryAvatar;
  avatar.onerror = () => {
    if (avatar.src !== fallbackAvatar) {
      avatar.src = fallbackAvatar;
    }
  };

  const body = document.createElement('div');
  body.className = 'client-body';

  const title = document.createElement('h3');
  title.textContent = client.name;

  const linkLabel = document.createElement('p');
  linkLabel.className = 'client-link-text';
  linkLabel.textContent = client.link;

  body.append(title, linkLabel);
  card.append(avatar, body);
  return card;
};

const createExtraLinkCard = (item) => {
  const card = document.createElement('a');
  card.className = 'client-card';
  card.href = item.link;
  card.target = '_blank';
  card.rel = 'noreferrer';

  const avatar = document.createElement('img');
  avatar.className = 'client-avatar';
  avatar.loading = 'lazy';
  avatar.alt = `${item.name} link icon`;

  const primaryAvatar = getAvatarFromSocialLink(item.link);
  const fallbackAvatar = getHostFallbackAvatar(item.link);
  avatar.src = primaryAvatar;
  avatar.onerror = () => {
    if (avatar.src !== fallbackAvatar) {
      avatar.src = fallbackAvatar;
    }
  };

  const body = document.createElement('div');
  body.className = 'client-body';

  const title = document.createElement('h3');
  title.textContent = item.name;

  const note = document.createElement('p');
  note.className = 'extra-link-note';
  note.textContent = item.note || 'Open link';

  const linkLabel = document.createElement('p');
  linkLabel.className = 'client-link-text';
  linkLabel.textContent = item.link;

  body.append(title, note, linkLabel);
  card.append(avatar, body);
  return card;
};

const renderClients = async () => {
  if (!clientList) {
    return;
  }

  try {
    const response = await fetch('clients.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load clients.json');
    }

    const data = await response.json();
    const clients = Array.isArray(data.clients) ? data.clients : [];

    clientList.innerHTML = '';

    clients.forEach((client) => {
      if (!client || !client.name || !client.link) {
        return;
      }
      clientList.append(createClientCard(client));
    });

    if (clientList.children.length === 0) {
      clientList.innerHTML = '<p class="client-empty">No clients added yet.</p>';
    }
  } catch {
    clientList.innerHTML = '<p class="client-empty">Could not load clients list.</p>';
  }
};

const renderExtraLinks = async () => {
  if (!extraLinksList) {
    return;
  }

  try {
    const response = await fetch('links.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load links.json');
    }

    const data = await response.json();
    const links = Array.isArray(data.links) ? data.links : [];

    extraLinksList.innerHTML = '';

    links.forEach((item) => {
      if (!item || !item.name || !item.link) {
        return;
      }
      extraLinksList.append(createExtraLinkCard(item));
    });

    if (extraLinksList.children.length === 0) {
      extraLinksList.innerHTML = '<p class="client-empty">No links added yet.</p>';
    }
  } catch {
    extraLinksList.innerHTML = '<p class="client-empty">Could not load links list.</p>';
  }
};

renderClients();
renderExtraLinks();
