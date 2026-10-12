// Owner's enquiry inbox. Plain JavaScript, no build step.
// Everything a visitor typed is inserted with textContent, never innerHTML.

const INTERESTS = {
  stay: 'Lodge stay',
  meeting: 'Meeting hall',
  cafe: 'Café',
  event: 'Gathering or event',
  other: 'Other',
};

const KEY_STORAGE = 'dani-lodge-admin-key';
const $ = (id) => document.getElementById(id);

const login = $('login');
const inbox = $('inbox');
const list = $('list');
const statusLine = $('status');
const tabs = [...document.querySelectorAll('[role="tab"]')];

// sessionStorage: the key is forgotten when the browser tab is closed
let adminKey = sessionStorage.getItem(KEY_STORAGE) ?? '';
let filter = 'new';

class AuthError extends Error {}

async function api(path, options = {}) {
  const res = await fetch(`/api/admin/inquiries${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminKey}` },
  });
  const body = await res.json().catch(() => ({}));
  if (res.status === 401) throw new AuthError(body.error ?? 'Wrong admin key.');
  if (!res.ok) throw new Error(body.error ?? 'Something went wrong. Please try again.');
  return body;
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

/** Turns a local Ethiopian number (09…/07…) into international digits for wa.me links. */
function whatsappDigits(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `251${digits.slice(1)}` : digits;
}

function renderItem(inquiry) {
  const item = el('li', `card item ${inquiry.status}`);

  const head = el('div', 'item-head');
  head.append(el('h2', '', inquiry.name));
  const time = el('time', '', formatDate(inquiry.createdAt));
  time.dateTime = inquiry.createdAt;
  head.append(time);
  item.append(head, el('span', 'tag', INTERESTS[inquiry.interest] ?? inquiry.interest));

  const details = [
    inquiry.checkIn && `Check-in ${inquiry.checkIn}`,
    inquiry.checkOut && `Check-out ${inquiry.checkOut}`,
    inquiry.guests && `${inquiry.guests} guest${inquiry.guests === 1 ? '' : 's'}`,
  ].filter(Boolean);
  if (details.length) item.append(el('p', 'details', details.join(' · ')));

  item.append(el('p', 'message', inquiry.message));

  const actions = el('div', 'actions');
  const call = el('a', '', `Call ${inquiry.phone}`);
  call.href = `tel:${inquiry.phone.replace(/[^\d+]/g, '')}`;
  const whatsapp = el('a', 'wa', 'WhatsApp');
  whatsapp.href = `https://wa.me/${whatsappDigits(inquiry.phone)}`;
  whatsapp.target = '_blank';
  whatsapp.rel = 'noopener noreferrer';

  const isNew = inquiry.status === 'new';
  const toggle = el('button', 'secondary', isNew ? 'Mark as handled' : 'Move back to new');
  toggle.addEventListener('click', async () => {
    toggle.disabled = true;
    try {
      await api(`/${inquiry.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: isNew ? 'handled' : 'new' }),
      });
      await load();
    } catch (err) {
      toggle.disabled = false;
      handleError(err);
    }
  });

  actions.append(call, whatsapp, toggle);
  item.append(actions);
  return item;
}

function showLogin(message = '') {
  adminKey = '';
  sessionStorage.removeItem(KEY_STORAGE);
  inbox.hidden = true;
  $('signOut').hidden = true;
  login.hidden = false;
  $('loginError').textContent = message;
  $('key').focus();
}

function handleError(err) {
  if (err instanceof AuthError) showLogin(err.message);
  else statusLine.textContent = err.message;
}

async function load() {
  statusLine.textContent = 'Loading…';
  try {
    const data = await api(filter ? `?status=${filter}` : '');
    $('newCount').textContent = data.newCount;
    list.replaceChildren(...data.inquiries.map(renderItem));
    statusLine.textContent = data.inquiries.length ? '' : 'No enquiries here yet.';
    login.hidden = true;
    inbox.hidden = false;
    $('signOut').hidden = false;
  } catch (err) {
    handleError(err);
  }
}

login.addEventListener('submit', async (event) => {
  event.preventDefault();
  adminKey = $('key').value.trim();
  $('key').value = '';
  sessionStorage.setItem(KEY_STORAGE, adminKey);
  $('loginError').textContent = '';
  await load();
});

tabs.forEach((tab) =>
  tab.addEventListener('click', () => {
    filter = tab.dataset.status;
    tabs.forEach((t) => t.setAttribute('aria-selected', String(t === tab)));
    load();
  })
);

$('refresh').addEventListener('click', load);
$('signOut').addEventListener('click', () => showLogin());

if (adminKey) load();
else showLogin();
