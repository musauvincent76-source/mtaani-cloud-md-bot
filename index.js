const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(res => setTimeout(res, ms));

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true,
        browser: ['Mtaani Cloud', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    // Pairing Code kama huna session
    if (!sock.authState.creds.registered) {
        const number = process.env.BOT_NUMBER || "2547XXXXXXXX";
        console.log(`\n🔗 Requesting Pair Code for ${number}...`);
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(number.replace(/[^0-9]/g, ''));
                console.log(`\n✅ PAIR CODE YAKO: ${code}\n`);
                console.log(`👉 Weka WhatsApp > Linked Devices > Link with phone number > Weka: ${code}\n`);
            } catch (e) {
                console.log("Error getting pair code:", e.message);
            }
        }, 3000);
    }

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed, reconnecting:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ MTAANI CLOUD MD IS LIVE!');
            console.log('🚀 Bot imeconnect!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        try {
            const msg = messages[0];
            if (!msg.message || msg.key.fromMe) return;
            
            const from = msg.key.remoteJid;
            const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
            if (!body.startsWith('.')) return;

            const command = body.split(' ')[0].toLowerCase().slice(1);
            const args = body.split(' ').slice(1);

            console.log(`📩 Command: ${command} from ${from}`);

            // FAKE TYPING 5 SECONDS - KWA KILA COMMAND
            await sock.sendPresenceUpdate('composing', from);
            await delay(5000);
            await sock.sendPresenceUpdate('paused', from);

            // Load command file
            const cmdPath = path.join(__dirname, 'commands', `${command}.js`);
            if (fs.existsSync(cmdPath)) {
                const cmd = require(cmdPath);
                await cmd(sock, msg, args);
            } else if (command === 'menu') {
                // Fallback menu kama file haipo
                await sock.sendMessage(from, { 
                    text: `╭── MTAANI CLOUD MD ──\n│ .menu - Onyesha menu\n│ .ping - Speed\n│ .alive - Bot alive?\n╰── TILL 3624692 ──` 
                });
            }

        } catch (e) {
            console.log("Error:", e.message);
        }
    });
}

startBot();
