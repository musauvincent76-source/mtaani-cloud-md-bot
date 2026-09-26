const delay = ms => new Promise(r => setTimeout(r, ms));
module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  await sock.sendPresenceUpdate('composing', from);
  await delay(5000);
  const start = Date.now();
  await sock.sendMessage(from, { text: `🏓 Pong!\n⚡ Speed: ${Date.now() - start}ms\n☁️ Mtaani Cloud MD - LIVE` });
}
