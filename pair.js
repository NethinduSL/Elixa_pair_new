const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");

const {
    default: Gifted_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("maher-zubair-baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    if (!num) {
        return res.status(400).send({ error: "Number parameter is required" });
    }

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);

        try {
            let Pair_Code_By_Gifted_Tech = Gifted_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: ["Chrome (Linux)", "", ""]
            });

            if (!Pair_Code_By_Gifted_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');

                const code = await Pair_Code_By_Gifted_Tech.requestPairingCode(num);

                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Gifted_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Gifted_Tech.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;

                if (connection === "open") {
                    await delay(5000);
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                   // await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, { text: '' + b64data });

                    let GIFTED_MD_TEXT = ` ╭ ❰ *ɪᴍ*  𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗 ❱❱
┃
┃ *ʜɪ*   *ɪ'ᴍ ᴄᴏɴɴᴇᴄᴛᴇᴅ* 
┃
┃⦁❤️ *ᴡᴀɪᴛɪɴɢ ᴛᴏ ᴡᴏʀᴋ*
┃⦁🖥️ *ʀᴇᴘᴏ* : github.com/Eboxsl/Elixa_MD
┃ *⦁👩‍💻ᴄʀᴇᴀᴛᴏʀ* : Nethindu, Jithula
┃⦁🤝 *ᴏᴡɴᴇʀ* : Your Name
╰═══════════════

> 𝗚𝗲𝟆𝗮𝗿𝗮𝐭𝗲𝙙 𝝗𝞤 𝗘ꟾ𝖎✘𝗮 ‐𝝡𝗗༺
`;

                    await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, {
                        image: {
                            url: "https://raw.githubusercontent.com/Eboxsl/ELAUTO/refs/heads/main/Elixa/connect.png"
                        },
                        caption: GIFTED_MD_TEXT
                    });

                    await Pair_Code_By_Gifted_Tech.sendMessage(Pair_Code_By_Gifted_Tech.user.id, {
                        document: { url: __dirname + `/temp/${id}/creds.json` },
                        mimetype: 'application/json',
                        fileName: 'creds.json',
                        caption: 'Here is your JSON file!'
                    });

                    await delay(100);
                    await Pair_Code_By_Gifted_Tech.ws.close();
                    return removeFile(`./temp/${id}`);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.log("Service restarted");
            removeFile(`./temp/${id}`);

            if (!res.headersSent) {
                res.send({ code: "Service Unavailable" });
            }
        }
    }

    return GIFTED_MD_PAIR_CODE();
});

module.exports = router;
