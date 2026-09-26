const delay = ms => new Promise(r => setTimeout(r, ms));
module.exports = async (sock, msg) => {
  const from = msg.key.remoteJid;
  await sock.sendPresenceUpdate('composing', from);
  await delay(5000);
  await sock.sendMessage(from, { text: `👑 OWNER: Musau Vincent\n📱 TILL: 3624692\n☁️ Mtaani Cloud\n\nWasiliana: wa.me/2547XXXXXXXX` });
}
