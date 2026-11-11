const express = require('express');
const app = express();

app.use(express.json());


const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1567005818522574980/xt7zQ06mofBlGdW_htFQHM0U1fGomQDnQB5HLUkJXw9qGc8ZKNp-yFtaZWKXcYuONlgZ';
app.post('/api/webhook', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  if (event === 'push') {
    const repoName = payload.repository.full_name;
    const pusher = payload.pusher.name;
    const branch = payload.ref.replace('refs/heads/', '');
    const commits = payload.commits || [];

    let commitList = commits.map(c => `• [\`${c.id.substring(0, 7)}\`] ${c.message} - _${c.author.name}_`).join('\n');

    const discordPayload = {
      embeds: [
        {
          title: `[${repoName}:${branch}] ${commits.length} commit baru terdeteksi`,
          description: commitList || 'Tidak ada pesan commit',
          color: 0x5865F2,
          footer: {
            text: `Pushed by ${pusher}`
          },
          timestamp: new Date()
        }
      ]
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });
  }

  return res.status(200).send('OK');
});

module.exports = app;