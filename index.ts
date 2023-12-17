import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import axios from 'axios';
//@ts-ignore
import stringExtractor from 'string-extractor'
import moment from 'moment';


var justify = require('justify');
//import dateFormat, { masks } from "dateformat";
//const now = new Date();
var nestedProperty = require("nested-property");



const BASE_URL = "https://script.google.com/macros/s/AKfycbxhAt-Egn6kX0WZqcJ2dqfSKtR_gKW1nBgcJfYbV5YRxP61EmgheU7qsbYdhnKLvBEk/exec?"



async function connectToWhatsApp () {
    const {state, saveCreds} = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state
    });



    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0];

        if (!msg.key.fromMe && m.type === 'notify') {
            
            console.log("COBA 1 : "+msg.key.remoteJid?.replace('@s.whatsapp.net', ''));
            console.log("COBA 2 : " + JSON.stringify(msg.message));
            axios.get(`${BASE_URL}whatsapp=${msg.key.remoteJid?.replace("@s.whatsapp.net", "")}&pesan=${(JSON.stringify(msg.message?.conversation))}`);

            const str4a = `Assalamualaikum Wr. Wb. \n\n_Maaf saat ini system sedang_\n_proses *maintenance*_ 🙏🏻\n\nJika ada yang perlu ditanyakan\nsilahkan kontak :\n\nhttps://wa.me/8128374551\n\n_*Bendum.OR.04017*_`;
                                        await sock.sendMessage(msg.key.remoteJid!, {
                                            text: str4a

                                        })

        }

 });
}


connectToWhatsApp();