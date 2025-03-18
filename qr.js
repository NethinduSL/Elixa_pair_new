const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const QRCode = require('qrcode');
const express = require('express');
const path = require('path');
const fs = require('fs');
const pino = require("pino");

const {
    default: Wasi_Tech,
    useMultiFileAuthState,
    jidNormalizedUser,
    Browsers,
    delay,
    makeInMemoryStore,
} = require("@whiskeysockets/baileys");

let router = express.Router();

const { readFile } = require("node:fs/promises");

function removeFile(FilePath) {
    try {
        if (fs.existsSync(FilePath)) {
            fs.rmSync(FilePath, { recursive: true, force: true });
        }
    } catch (error) {
        console.error(`Failed to remove file: ${FilePath}`, error);
    }
}

router.get('/', async (req, res) => {
    const id = makeid();

    async function WASI_MD_QR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

        try {
            let Qr_Code_By_Wasi_Tech = Wasi_Tech({
                auth: state,
                printQRInTerminal: false,
                logger: pino({ level: "silent" }),
                browser: Browsers.macOS("Desktop"),
            });

            Qr_Code_By_Wasi_Tech.ev.on('creds.update', saveCreds);
            Qr_Code_By_Wasi_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect, qr } = s;
                
                if (qr) {
                    return res.end(await QRCode.toBuffer(qr));
                }

                if (connection === "open") {
                    await delay(5000);
                    let data = fs.readFileSync(path.join(__dirname, `temp/${id}/creds.json`));
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    
                   // let session = await Qr_Code_By_Wasi_Tech.sendMessage(Qr_Code_By_Wasi_Tech.user.id, { text: '' + b64data });

                    let WASI_MD_TEXT = ` ╭ ❰ *ɪᴍ*  𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗 ❱❱
┃
┃ *ʜɪ*   *ɪ'ᴍ ᴄᴏɴɴᴇᴄᴛᴇᴅ* 
┃
┃⦁❤️ *ᴡᴀɪᴛɪɴɢ ᴛᴏ ᴡᴏʀᴋ*
┃⦁🖥️ *ʀᴇᴘᴏ* : github.com/Eboxsl/Elixa_MD
┃ *⦁👩‍💻ᴄʀᴇᴀᴛᴏʀ* : Nethindu, Jithula
┃⦁🤝 *ᴏᴡɴᴇʀ* : Your Name
╰═══════════════

> 𝗚𝗲𝟆𝗮𝗿𝗮𝐭𝗲𝙙 𝝗𝞤 𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗༺`;

                    await Qr_Code_By_Wasi_Tech.sendMessage(Qr_Code_By_Wasi_Tech.user.id, {
    image: { 
        url: "https://raw.githubusercontent.com/Eboxsl/ELAUTO/refs/heads/main/Elixa/connect.png"
    },
    caption: WASI_MD_TEXT
});


                    await Qr_Code_By_Wasi_Tech.sendMessage(Qr_Code_By_Wasi_Tech.user.id, {
                        document: { url: `./temp/${id}/creds.json` },
                        mimetype: 'application/json',
                        fileName: 'creds.json',
                        caption: '> 𝗚𝗲𝟆𝗮𝗿𝗮𝐭𝗲𝙙 𝝗𝞤 𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗༺'
                    });

                    await delay(100);
                    await Qr_Code_By_Wasi_Tech.ws.close();
                    return removeFile(`temp/${id}`);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    WASI_MD_QR_CODE();
                }
            });
        } catch (err) {
            if (!res.headersSent) {
                res.json({ code: "Service is Currently Unavailable" });
            }
            console.error(err);
            removeFile(`temp/${id}`);
        }
    }

    return WASI_MD_QR_CODE();
});

module.exports = router;
