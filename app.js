const client = supabase.createClient(
  'https://evjxfyphtbnsannwuewz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMTAzMTI3MiwiZXhwIjoxOTM2NjA3MjcyfQ.lXvuzxnZXFEc0gr2dxPbpOoZwvTlq5RxNJcu_suYla4',
);




const messagesElement = document.querySelector('#messages');

function sanitizeText(text) {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
  });
}

function addMessageToPage(message) {
  const element = document.createElement('li');
  element.classList.add('card', 'm-2');
  element.innerHTML = `
    <div class="card-body">
      <div class="row">
        <div class="col-sm-2 avatar-container">
          <img src="https://cdn.betterttv.net/emote/57b984cf51067c5243fe3d42/2x" class="mr-3" alt="...">
          <p class="avatar-username">${sanitizeText(message.username)}</p>
        </div>
        <div class="col-sm-10">
          <p>${sanitizeText(message.content)}</p>
        </div>
      </div>
      <div class="row">
        <p class="col-sm-12 timestamp">${sanitizeText(message.created_at)}</p>
      </div>
    </div>
  `;
  messagesElement.append(element);
  setTimeout(() => {
    element.scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

const form = document.querySelector('form');
const contentElement = document.querySelector('#content');

async function init() {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = {
      username: formData.get('username'),
      content: formData.get('content'),
    };
    contentElement.value = '';
    client
      .from('messages')
      .insert([
        message,
      ]).then(() => {
        console.log('Message sent!');
      });
  });

  const { data: messages } = await client
    .from('messages')
    .select('*');

  messages.forEach(addMessageToPage);

  client
    .from('messages')
    .on('INSERT', (message) => {
      addMessageToPage(message.new);
    })
    .subscribe();
}

init();
