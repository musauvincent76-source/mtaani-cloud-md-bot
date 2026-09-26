const delay = ms => new Promise(res => setTimeout(res, ms));

async function menuCommand(sock, msg) {
    const from = msg.key.remoteJid;

    // FAKE TYPING 5 SEC
    await sock.sendPresenceUpdate('composing', from);
    await delay(5000);
    await sock.sendPresenceUpdate('paused', from);

    const menuText = `
╭───「 *MTAANI CLOUD MD* 」───
│ 🚀 *Welcome boss!*
│
│ 📱 *TILL:* 3624692
│ ☁️ *Status:* ONLINE
│
│ *COMMANDS:*
│ •.menu
│ •.ping
│ •.alive
│ •.owner
│
│ 🔥 Powered by Mtaani Cloud
╰───────────────────
`;

    await sock.sendMessage(from, {
        text: menuText,
        contextInfo: {
            externalAdReply: {
                title: "MTAANI CLOUD ☁️",
                body: "Deploy Anything",
                thumbnailUrl: "",
                mediaType: 1
            }
        }
    });
}

module.exports = menuCommand;
