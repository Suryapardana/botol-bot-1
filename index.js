// aktifkan bila sering close sendiri
//process.on('uncaughtException', console.error)
const
	{
		WAConnection,
		MessageType,
		Presence,
		MessageOptions,
		Mimetype,
		WALocationMessage,
		WA_MESSAGE_STUB_TYPES,
		ReconnectMode,
		ProxyAgent,
		GroupSettingChange,
		waChatKey,
		mentionedJid
	} = require("@adiwajshing/baileys")
const qrcode = require("qrcode-terminal")
const moment = require("moment-timezone")
const fs = require("fs")
const speed = require('performance-now')
const { Utils_1 } = require('./node_modules/@adiwajshing/baileys/lib/WAConnection/Utils')
const tiktod = require('tiktok-scraper')
const axios = require("axios")
const ffmpeg = require('fluent-ffmpeg')
const imageToBase64 = require('image-to-base64');
const { removeBackgroundFromImageFile } = require('remove.bg')
const { spawn, exec, execSync } = require("child_process")
const fetchs = require("node-superfetch");
const ms = require('parse-ms')
const toMs = require('ms')
const figlet = require('figlet')
const lolcatjs = require('lolcatjs')
const phoneNum = require('awesome-phonenumber')
const translate = require('./lib/translate')

/* CALLBACK */
const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { color, bgcolor } = require('./lib/color')
const { fetchJson, uploadImages } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
const { error } = require("qrcode-terminal")
const { exif } = require('./lib/exif')
const { processTime, sleep, hilih } = require('./lib/index')
const { custom, random } = require('./lib/meme')

/* DATABASE */
const left = JSON.parse(fs.readFileSync('./src/left.json'))
const welkom = JSON.parse(fs.readFileSync('./src/welkom.json'))
const setiker = JSON.parse(fs.readFileSync('./src/stik.json'))
const videonye = JSON.parse(fs.readFileSync('./src/video.json'))
const audionye = JSON.parse(fs.readFileSync('./src/audio.json'))
const imagenye = JSON.parse(fs.readFileSync('./src/image.json'))
const truth = JSON.parse(fs.readFileSync('./src/truth.json'))
const dare = JSON.parse(fs.readFileSync('./src/dare.json'))
const config = JSON.parse(fs.readFileSync('./config.json'))
const time = moment().tz('Asia/Jakarta').format("HH:mm:ss")
const timet = moment().tz('Asia/Jakarta').format("HH:mm")
const vcard = 'BEGIN:VCARD\n' 
            + 'VERSION:3.0\n' 
            + 'FN:Owner\n' 
            + 'ORG: Creator Botol BOT;\n' 
            + 'TEL;type=CELL;type=VOICE;waid=${config.ownerNumber}:${config.ownerNumberr}\n' 
            + 'END:VCARD'

prefix = '.'
fake = 'BOTOL BOT'
numbernya = '0'

function kyun(seconds){
    function pad(s){
      return (s < 10 ? '0' : '') + s;
    }
    var hours = Math.floor(seconds / (60*60));
    var minutes = Math.floor(seconds % (60*60) / 60);
    var seconds = Math.floor(seconds % 60);
  
    //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
    return `-[ ???????????????????????????? ]-\n${pad(hours)}H ${pad(minutes)}M ${pad(seconds)}S`
}

function addMetadata(packname, author) {
  if (!packname) packname = `${config.packname}`;
  if (!author) author = ` ${config.author}`;
  author = author.replace(/[^a-zA-Z0-9]/g, '');
  let name = `${author}_${packname}`

  if (fs.existsSync(`./src/sticker/${name}.exif`)) {
    return `./src/sticker/${name}.exif`
  }
  const json = {
    "sticker-pack-name": packname,
    "sticker-pack-publisher": author,
  }

  const littleEndian = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00])
  const bytes = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00]

  let len = JSON.stringify(json).length
  let last

  if (len > 256) {
    len = len - 256
    bytes.unshift(0x01)
  } else {
    bytes.unshift(0x00)
  }

  if (len < 16) {
    last = len.toString(16)
    last = "0" + len
  } else {
    last = len.toString(16)
  }

  const buf2 = Buffer.from(last, "hex")
  const buf3 = Buffer.from(bytes)
  const buf4 = Buffer.from(JSON.stringify(json))

  const buffer = Buffer.concat([littleEndian, buf2, buf3, buf4])

  fs.writeFile(`./src/sticker/${name}.exif`, buffer, (err) => {
    return `./src/sticker/${name}.exif`
  })
}

async function starts() {
    const client = new WAConnection()

    client.logger.level = 'warn'

    client.on('qr', () => {
        console.log('[', color('!', 'red') ,']', 'Please, scan the QR code!')
    })

    fs.existsSync('./session.json') && client.loadAuthInfo('./session.json')
    client.on('connecting', () => {
        console.log(color('Connecting to WhatsApp...', 'green'))
    })
    client.on('open', () => {
        console.log(color('Connected', 'green'))
        lolcatjs.fromString(figlet.textSync('Botol-Bot', 'Larry 3D'))
    })
    await client.connect({timeoutMs: 30*1000})
        fs.writeFileSync('./session.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

    client.on('chat-update', async (mek) => {
        try {
            if (!mek.hasNewMessage) return
            mek = JSON.parse(JSON.stringify(mek)).messages[0]
            if (!mek.message) return
            if (mek.key && mek.key.remoteJid === 'status@broadcast') return
            if (mek.key.fromMe) return
            const content = JSON.stringify(mek.message)
            const from = mek.key.remoteJid
            const type = Object.keys(mek.message)[0]
            const { text, extendedText, liveLocation, contact, contactsArray, location, image, video, sticker, document, audio, product } = MessageType
            const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
            budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
            const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
            const arg = body.substring(body.indexOf(' ') + 1)
            const args = body.trim().split(/ +/).slice(1)
            const isCmd = body.startsWith(prefix)
            const q = args.join(' ')
            const botNumber = client.user.jid
            const ownerNumber = [`${config.ownerNumber}@s.whatsapp.net`] // Replace with your number
            const isGroup = from.endsWith('@g.us')
            const sender = isGroup ? mek.participant : mek.key.remoteJid
            const sender1 = sender === undefined ? botNumber : sender
            const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
            const groupName = isGroup ? groupMetadata.subject : ''
            const groupId = isGroup ? groupMetadata.jid : ''
      	    const groupMembers = isGroup ? groupMetadata.participants : ''
      	    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
      	    const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
                  const isGroupAdmins = groupAdmins.includes(sender) || false
                  const isOwner = ownerNumber.includes(sender)
                  pushname2 = client.contacts[sender1] != undefined ? client.contacts[sender1].vname || client.contacts[sender1].notify : undefined
      			const isUrl = (url) => {
      			    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
      			}
      			const reply = (teks) => {
      				client.sendMessage(from, teks, text, {quoted:mek})
      			}
      			const sendMess = (hehe, teks) => {
      				client.sendMessage(hehe, teks, text)
      			}
      			const mentions = (teks, memberr, id) => {
      				(id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
                  }
            const sendPtt = (audio) => {
      			client.sendMessage(from, audio, mp3, { quoted: mek })
      		}
      		  
        		const fakestatus = (teks) => {
        			client.sendMessage(from, teks, text, {
        				quoted: {
        					key: {
        						fromMe: false,
        						participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {})
        					},
        					message: {
        						"imageMessage": {
        							"url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc",
        							"mimetype": "image/jpeg",
        							"caption": fake,
        							"fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=",
        							"fileLength": "28777",
        							"height": 1080,
        							"width": 1079,
        							"mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=",
        							"fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=",
        							"directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69",
        							"mediaKeyTimestamp": "1610993486",
        							"jpegThumbnail": fs.readFileSync('./src/image/thumbnail.jpeg'),
        							"scansSidecar": "1W0XhfaAcDwc7xh1R8lca6Qg/1bB4naFCSngM2LKO2NoP5RI7K+zLw=="
        						}
        					}
        				}
        			})
        		}
        		const fakegroup = (teks) => {
        			client.sendMessage(from, teks, text, {
        				quoted: {
        					key: {
        						fromMe: false,
        						participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "6289523258649-1604595598@g.us" } : {})
        					},
        					message: {
        						conversation: fake
        					}
        				}
        			})
        		}
              mess = {
                wait: 'Sedang di proses...',
                success: 'Berhasil!',
                afkalready: 'AFK sudah diaktifkan sebelumnya...',
                afkgroupalready: 'AFK digroup ini sudah diaktifkan sebelumnya',
                wrongFormat: 'Format salah, coba liat lagi di menu',
                afkdisable: 'Afk berhasil di matikan!',
                afkenable: 'AFK berhasil diaktifkan!',
                sedangafk: 'Maaf saya sedang offline, silahkan coba beberapa saat lagi\n\n_SELF-BOT_',
                error: {
                  stick: 'bukan sticker itu',
                  Iv: 'Linknya mokad'
                },
                only: {
                  group: 'Khusus grup ngab',
                  ownerG: 'Khusus owner grup ngab',
                  ownerB: 'Lahh?',
                  admin: 'Mimin grup only bruh...',
                  Badmin: 'Jadiin gw admin dlu:v'
                }
              }

            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
      			const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
      			const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
            if (!isGroup && !isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ PRIVATE ]", "aqua"), 'message from', color(sender1.split("@")[0]))
            if (isGroup && !isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ GROUP ]', 'aqua'), 'message from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (!mek.key.fromMe && isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ GROUP ]', 'aqua'), 'message from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ EXEC ]'), 'from', color(sender1.split("@")[0]), 'in', color(groupName))
            if (!isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ EXEC ]"), 'from', color(sender1.split("@")[0]))

                switch(command) {
                    case 'join':
                    if (!isOwner) return fakegroup(mess.only.ownerB)
                                                  if (!q) return fakestatus('Masukan link group')
                                                  const codeInvite = `${q}`
                                                  let response = await client.acceptInvite(codeInvite);
                                                  console.log(response);
                                                break
                    case 'term':
                    case 'exec':
                    if (!isOwner) return fakegroup(mess.only.ownerB)
                    if (!q) return fakegroup(mess.wrongFormat)
                    exec(q, (err, stdout) => {
                      if (err) return fakegroup(`root@Botol-Bot:~ ${err}`)
                      if (stdout) {
                        fakestatus(stdout)
                      }
                    })
                    break
                    case 'play':
                    if (!q) return fakegroup(mess.wrongFormat)
                    data = await fetchJson(`https://api.vhtear.com/ytmp3?query=${q}&apikey=${config.vhtearkey}`, { method: 'get' })
                    playmp3 = data.result
                    var teks = `??? Judul : ${playmp3.title}
??? Duration : ${playmp3.duration}
??? Size : ${playmp3.size}
??? Ext : ${playmp3.ext}
??? Id : ${playmp3.id}
??? Link : ${playmp3.mp3}
??? Source : ${playmp3.url}`
                    
                    const playing = { key: { participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { "imageMessage": { "url": "https://mmg.whatsapp.net/d/f/At0x7ZdIvuicfjlf9oWS6A3AR9XPh0P-hZIVPLsI70nM.enc", "mimetype": "image/jpeg", "caption": `*Duration* : ${playmp3.duration}\n*Size* : ${playmp3.size}\n*Ext* : ${playmp3.ext}`, "fileSha256": "+Ia+Dwib70Y1CWRMAP9QLJKjIJt54fKycOfB2OEZbTU=", "fileLength": "28777", "height": 1080, "width": 1079, "mediaKey": "vXmRR7ZUeDWjXy5iQk17TrowBzuwRya0errAFnXxbGc=", "fileEncSha256": "sR9D2RS5JSifw49HeBADguI23fWDz1aZu4faWG/CyRY=", "directPath": "/v/t62.7118-24/21427642_840952686474581_572788076332761430_n.enc?oh=3f57c1ba2fcab95f2c0bb475d72720ba&oe=602F3D69", "mediaKeyTimestamp": "1610993486", "jpegThumbnail": fs.readFileSync('./src/image/thumbnail.jpeg') } } }
                    
                    thumb = await getBuffer(playmp3.image)
                    fakestatus(mess.wait)
                    client.sendMessage(from, thumb, image, { caption: `${teks}`, quoted: playing })
                    bufferss = await getBuffer(playmp3.mp3)
                    client.sendMessage(from, bufferss, MessageType.audio, { mimetype: 'audio/mp4', filename: `${playmp3.title}.mp3`, quoted: playing })
                    break
                    case 'ping':
                              const timestamp = speed();
                              const latensi = speed() - timestamp
                              exec(`neofetch --stdout`, (error, stdout, stderr) => {
                                const child = stdout.toString('utf-8')
                                const teks = child.replace(/Memory:/, "Ram:")
                                const teks2 = `\nDevice Botol BOT\n???????????????????????????????????????????????? \n???? : ${client.user.name}\n???? : ${client.browserDescription[1]} browser\n???? : ${client.browserDescription[0]} baileys version\n???? : ${client.browserDescription[2]} browser version\n???? : ${process.uptime()} speed\n???? : ${client.user.phone.wa_version} wa version`
                                const pingnya = `${teks}${teks2}`
                                fakestatus(pingnya)
                              })
                           break
                    case 'speed':
                          reply(`Pong, *${processTime(mek.messageTimestamp, moment())} _Seconds_*`)
                          break
                    case 'h':
                        if (!isGroup) return fakegroup(mess.only.group)
                        if (!isGroupAdmins) return fakegroup(mess.only.admin)
                        var value = args.join(" ")
                        var grup = await client.groupMetadata(from)
                        var member = grup['participants']
                        var mem = []
                        member.map( async adm => {
                            mem.push(adm.jid)
                        })
                        var options = {
                            text: value,
                            contextInfo: {
                                mentionedJid: mem
                            }
                        }
                        client.sendMessage(from, options, text)
                        break
                case 'owner':
                case 'creator':
                      client.sendMessage(from, {displayname: "Owner botol bot", vcard: vcard}, MessageType.contact, { quoted: mek})
                      client.sendMessage(from, 'Itu Nomor Owner Botol bot',MessageType.text, { quoted: mek} )
    	          break
                case 'f':
                            var value = args.join(" ")
                            var options = {
                                text: value,
                                contextInfo: {
                                    participant: '0@s.whatsapp.net',
                                    remoteJid: 'status@broadcast',
                                    isForwarded: true,
                                    forwardingScore: 300,
                                    quotedMessage: {
                                        documentMessage: {
                                            fileName: fake,
                                            jpegThumbnail: fs.readFileSync('./src/image/thumbnail.jpeg'),
                                            mimetype: 'application/pdf',
                                            pageCount: 200
                                        }
                                    }
                                }
                            }
                            client.sendMessage(from, options, text)
                            break
                        case '.':
                        if (!isOwner) return fakegroup(mess.only.ownerB)
                        let code = args.join(" ")
                    try {
    
                    if (!code) return client.reply(from, 'No JavaScript Code', id)
                    let evaled;
    
                    if (code.includes("--silent") && code.includes("--async")) {
                    code = code.replace("--async", "").replace("--silent", "");
    
                    return await eval(`(async () => { ${code} })()`)
                    } else if (code.includes("--async")) {
                    code = code.replace("--async", "");
            
                    evaled = await eval(`(async () => { ${code} })()`);
                    } else if (code.includes("--silent")) {
                    code = code.replace("--silent", "");
            
                    return await eval(code);
                    } else evaled = await eval(code);
    
                  if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled, { depth: 0 });
      
                let output = clean(evaled);
                var options = {
                    contextInfo: {
                        participant: '0@s.whatsapp.net',
                        quotedMessage: {
                            extendedTextMessage: {
                                text: "????????????????????????????????"
                            }
                        }
                    }
                }
                client.sendMessage(from, `${output}`, text, options)
                } catch(err) {
                console.error(err)
                reply(err)
                }
                function clean(text) {
                if (typeof text === "string")
                  return text
                    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                    .replace(/@/g, `@${String.fromCharCode(8203)}`);
                // eslint-disable-line prefer-template
                else return text;
                }
                break
                case 'setprefix':
                    if (!isOwner) return fakegroup(mess.only.ownerB)
                    if (args.length < 1) return
                    prefix = args[0]
                    reply(`*Prefix berhasil diubah ke ${prefix}*`)
                    break
                case 'setnomor':
                    if (!isOwner) return fakegroup(mess.only.ownerB)
                    if (args.length < 1) return
                    numbernya = args[0]
                    reply(`*Berhasil ubah nomor ke ${numbernya}*`)
                    break
                case 'setpesan':
                    if (!isOwner) return fakegroup(mess.only.ownerB)
                    if (args.length < 1) return
                    fake = args.join(" ")
                    reply(`*Berhasil mengubah pesan reply ke: ${fake}*`)
                    break
                case 'runtime':
                    runtime = process.uptime()
                    teks = `${kyun(runtime)}`
                    const rtime = {
                        contextInfo: {
                            participant: `${numbernya}@s.whatsapp.net`,
                            remoteJid: 'status@broadcast',
                            quotedMessage: {
                                extendedTextMessage: {
                                    text: "-[ ???????????????????????? ]-"
                                }
                            }
                        }
                    }
                    client.sendMessage(from, `${teks}`, text, rtime)
                    break
                case 'toimg':
                    if ((isQuotedSticker && mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated === false)) {
                        encmedia = JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo
                        media = await client.downloadAndSaveMediaMessage(encmedia)
                        ran = getRandom('.png')
                        exec(`ffmpeg -i ${media} ${ran}`, (err) => {
                            fs.unlinkSync(media)
                            if (err) return reply('ada yang error')
                            buffer = fs.readFileSync(ran)
                            client.sendMessage(from, buffer, image, {quoted:mek, caption: "nih dah jadi"})
                            fs.unlinkSync(ran)
                        })
                    } else if ((isQuotedSticker && mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated)) {
                        encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
                        media = await client.downloadAndSaveMediaMessage(encmedia)
                        ran = getRandom('.gif')
                        ranw = getRandom('.mp4')
                        spawn('./webp2gif', [
                            media,
                            ran
                        ]).on('error', (err) => {
                            reply(`Error: ${err}`).then(() => {
                                console.log(err)
                            })
                            fs.unlinkSync(media)
                        }).on('close', () => {
                            fs.unlinkSync(media)
                            exec(`ffmpeg -i ${ran} -pix_fmt yuv420p ${ranw}`, (err) => {
                                if (err) return reply('error')
                                client.sendMessage(from, fs.readFileSync(ranw), video, {quoted:mek, mimetype: 'video/gif'})
                                fs.unlinkSync(ran)
                                fs.unlinkSync(ranw)
                            })
                        })
                    } else {
                        reply('reply stickernya bang')
                    }
                    break
                    case 'stiker':
                    case 'sticker':
                    if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                      const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                      const media = await client.downloadAndSaveMediaMessage(encmedia)
                      ran = getRandom('.webp')
                      await ffmpeg(`./${media}`)
                        .input(media)
                        .on('start', function(cmd) {
                          console.log(`Started : ${cmd}`)
                        })
                        .on('error', function(err) {
                          console.log(`Error : ${err}`)
                          fs.unlinkSync(media)
                          reply(mess.error.stick)
                        })
                        .on('end', function() {
                          console.log('Finish')
                          exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${ran} -o ${ran}`, async (error) => {
                            //if (error) return reply(mess.error.stick)
                            client.sendMessage(from, fs.readFileSync(ran), MessageType.sticker, { quoted: mek })
                            fs.unlinkSync(media)
                            fs.unlinkSync(ran)
                          })
                        })
                        .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(512,iw)':min'(512,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(ran)
                    } else if ((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
                      const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                      const media = await client.downloadAndSaveMediaMessage(encmedia)
                      ran = getRandom('.webp')
                      reply(mess.wait)
                      await ffmpeg(`./${media}`)
                        .inputFormat(media.split('.')[1])
                        .on('start', function(cmd) {
                          console.log(`Started : ${cmd}`)
                        })
                        .on('error', function(err) {
                          console.log(`Error : ${err}`)
                          fs.unlinkSync(media)
                          tipe = media.endsWith('.mp4') ? 'video' : 'gif'
                          reply(`??? Gagal, pada saat mengkonversi ${tipe} ke stiker`)
                        })
                        .on('end', function() {
                          console.log('Finish')
                          exec(`webpmux -set exif ${addMetadata(`${config.author}`, `${config.packname}`)} ${ran} -o ${ran}`, async (error) => {
                           // if (error) return reply(mess.error.stick)
                            client.sendMessage(from, fs.readFileSync(ran), MessageType.sticker, { quoted: mek })
                            fs.unlinkSync(media)
                            fs.unlinkSync(ran)
                          })
                        })
                        .addOutputOptions([`-vcodec`, `libwebp`, `-vf`, `scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
                        .toFormat('webp')
                        .save(ran)
                    } else if ((isMedia || isQuotedImage) && args[0] == 'nobg') {
                      const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : mek
                      const media = await client.downloadAndSaveMediaMessage(encmedia)
                      ranw = getRandom('.webp')
                      ranp = getRandom('.png')
                      reply(mess.wait)
                      keyrmbg = config.VhtearKey
                      await removeBackgroundFromImageFile({ path: media, apiKey: keyrmbg, size: 'auto', type: 'auto', ranp }).then(res => {
                        fs.unlinkSync(media)
                        let bufferir9vn5 = Buffer.from(res.base64img, 'base64')
                        fs.writeFileSync(ranp, bufferir9vn5, (err) => {
                          if (err) return reply('Gagal, Terjadi kesalahan, silahkan coba beberapa saat lagi.')
                        })
                        exec(`ffmpeg -i ${ranp} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${ranw}`, (err) => {
                          fs.unlinkSync(ranp)
                          if (err) return reply(mess.error.stick)
                          exec(`webpmux -set exif ${addMetadata(`${config.author}`, authorname)} ${ranw} -o ${ranw}`, async (error) => {
                            if (error) return reply(mess.error.stick)
                            client.sendMessage(from, fs.readFileSync(ranw), MessageType.sticker, { quoted: freply })
                            fs.unlinkSync(ranw)
                          })
                        })
                      })
                    } else {
                      reply(`Kirim gambar dengan caption ${prefix}sticker atau tag gambar yang sudah dikirim`)
                    }
                    break
                    case 'meme':
                        reply('Bentar om, lagi nyari...')
                        var { author, title, postLink, url } = await random()
                        var buffer = await getBuffer(url)
                        var options = {
                            caption: '-[ ???????????????????????????? ]-',
                            contextInfo: {
                                participant: `${numbernya}@s.whatsapp.net`,
                                quotedMessage: {
                                    extendedTextMessage: {
                                        text: `*Author: ${author}*\n*Title: ${title}*\n*Link: ${postLink}*`
                                    }
                                }
                            }
                        }
                        client.sendMessage(from, buffer, image, options)
                        break
                    case 'memeimg':
                        case 'memeimage':
                                if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length > 0) {
                                    const top = arg.split('|')[0]
                                    const bottom = arg.split('|')[1]
                                    const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                                    const media = await client.downloadMediaMessage(encmedia, 'buffer')
                                    const getUrl = await uploadImages(media, false)
                                    const memeRes = await custom(getUrl, top, bottom)
                                    client.sendMessage(from, memeRes, image, {quoted: mek, caption: 'dah jadi nih bang.'})
                                }
                                break
                    case 'imgtourl':
                        if ((isMedia && !mek.videoMessage || isQuotedImage) && args.length == 0) {
                            reply('*Bentar...*')
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadMediaMessage(encmedia, 'buffer')
                            const getUrl = await uploadImages(media, false)
                            client.sendMessage(from, `${getUrl}`)
                        }
                        break
                    case 'wait':
                        case 'whatnimek':
                            if ((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0) {
                                const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace("quotedM","m")).message.extendedTextMessage.contextInfo : mek
                                const media = await client.downloadMediaMessage(encmedia, 'buffer')
                                const img64 = `data:image/jpeg;base64,${media.toString('base64')}`
                                fetch('https://trace.moe/api/search', {
                                    method: 'POST',
                                    body: JSON.stringify({ image: img64 }),
                                    headers: { "Content-Type": "application/json" }
                                })
                                .then(respon => respon.json())
                                .then(async (resolt) => {
                                    if (resolt.docs && resolt.docs.length <= 0) {
                                        reply('Gak tau anime apaan!')
                                    }
                                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                                    var teksnime = ''
                                    if (similarity < 0.92) {
                                        teksnime += '*Saya memiliki keyakinan rendah dengan request ini*\n\n'
                                    }
                                    teksnime += `??? *Title Japanese* : ${title}\n??? *Title chinese* : ${title_chinese}\n??? *Title Romaji* : ${title_romaji}\n??? *Title English* : ${title_english}\n`
                                    teksnime += `??? *Ecchi* : ${is_adult}\n`
                                    teksnime += `??? *Eps* : ${episode.toString()}\n`
                                    teksnime += `??? *Kesamaan* : ${(similarity * 100).toFixed(1)}%\n`
                                    var imek = `https://media.trace.moe/image/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`
                                    var buffer = await getBuffer(imek)
                                    
                                    client.sendMessage(from, buffer, image, { quoted: mek, caption: teksnime })
                                })
                                .catch(err => console.log('[',color('!', 'red'),']', color(err, 'red')))
                            }
                            break
                    case 'tga':
                        if (!isGroup) return fakegroup(mess.only.group)
                        if (!isGroupAdmins) return fakegroup(mess.only.admin)
                        members_id = []
                        teks = args.join(" ")
                        teks += "\n\n"
                        for (let mem of groupMembers) {
                            teks += `# @${mem.jid.split("@")[0]}\n`
                            members_id.push(mem.jid)
                        }
                        mentions(teks, members_id)
                        break
                    case 'tga2':
                        if (!isGroup) return fakegroup(mess.only.group)
                        if (!isGroupAdmins) return fakegroup(mess.only.admin)
                        members_id = []
                        teks = "*Tagall v2*"
                        teks += "\n\n"
                        for (let mem of groupMembers) {
                            teks += `~> @${mem.jid.split("@")[0]}\n`
                            members_id.push(mem.jid)
                        }
                        client.sendMessage(from, teks, text, {quoted:mek, contextInfo: { "mentionedJid": members_id}})
                        break
                    case 'tga3':
                        if (!isGroup) return fakegroup(mess.only.group)
                        if (!isGroupAdmins) return fakegroup(mess.only.admin)
                        members_id = []
                        teks = "*Tagall v3*"
                        teks += "\n\n"
                        for (let mem of groupMembers) {
                            teks += `<#> https://wa.me/${mem.jid.split("@")[0]}\n`
                            members_id.push(mem.jid)
                        }
                        client.sendMessage(from, teks, text, {contextInfo: {"mentionedJid": members_id }})
                        break
                    case 'setnick':
                        if (!isOwner) return fakegroup(mess.only.ownerB)
                        entah = args.join(" ")
                        client.updateProfileName(entah).then(() => {
                            reply(`Sukses mengubah ke ${entah}`)
                        }).catch((err) => { reply(`Error: ${err}`) })
                        break
                    case 'setpict':
                        if (!isOwner) return fakegroup(mess.only.ownerB)
                        if ((isMedia && !mek.message.videoMessage || isQuotedImage)) {
                            const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadMediaMessage(encmedia, 'buffer')
                            client.updateProfilePicture(botNumber, media).then(() => {
                                reply('Sukses update profile picture')
                            }).catch((err) => {
                                reply(`Error: ${err}`)
                            })
                        } else {
                            reply('bukan gambar')
                        }
                        break
                    case 'del':
                        case 'delete':
                            if (args[0] === 'priv' || args[0] === 'private') {
                                memew = client.chats.array.filter(v => v.jid.endsWith("@s.whatsapp.net") || v.jid.endsWith("@c.us")).map(v => v.jid)
                                for (let ids of memew) client.modifyChat(ids, 'delete')
                                reply(`Sukses menghapus *${memew.length}* personal chat`)
                            } else {
                                reply("*Masukan type chat yang ingin dibersihkan*\n1. private -> Personal Chat")
                            }
                            break
                    case 'hilih':
                        entah = args.join(" ")
                        imni = hilih(entah)
                        reply(imni)
                        break
                    case 'kontak':
                        entah = args[0]
                        disname = args[1]
                        if (isNaN(entah)) return reply('Invalid phone number'.toUpperCase());
                        vcard = 'BEGIN:VCARD\n'
                                  + 'VERSION:3.0\n'
                                  + `FN:${disname}\n`
                                  + `TEL;type=CELL;type=VOICE;waid=${entah}:${phoneNum('+' + entah).getNumber('internasional')}\n`
                                  + 'END:VCARD'.trim()
                            client.sendMessage(from, {displayName: disname, vcard: vcard}, contact)
                            break
                    case 'tr':
                            if (mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) {
                                tolang = args[0]
                                entah = body.slice(3+args[0].length+1)
                                translate(entah, tolang)
                                .then((res) => { reply(`${res}`) })
                            } else {
                                tolang = args[0]
                                entah = mek.message.extendedTextMessage.contextInfo.quotedMessage.conversation
                                translate(entah, tolang)
                                .then((res) => { reply(`${res}`) })
                            }
                            break
                    case 'tomp3':
                        if ((isMedia && mek.message.videoMessage.seconds <= 30 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds <= 30)) {
                            const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                            const media = await client.downloadAndSaveMediaMessage(encmedia, "video")
                            exec(`ffmpeg -y -i ${media} -b:a 192K -ar 44100 -vn -f mp3 tomp3.mp3`, function(err) {
                                fs.unlinkSync(media)
                                if (err) return reply("error om")
                                client.sendMessage(from, fs.readFileSync('./tomp3.mp3'), audio, {mimetype: 'audio/ogg', quoted: mek})
                                fs.unlinkSync('./tomp3.mp3')
                            })
                        }
                        break
                        case 'help':
                        case 'menu':
                        fakestatus(`*Botol - bot Simple Menu*

??? ${prefix}info
??? ${prefix}donasi
??? ${prefix}h - > hidetag
??? ${prefix } f - > forward
??? ${prefix}eval - > eval
??? ${prefix}ping - > cek device
??? ${prefix}speed - > cek jaringan bot
??? ${prefix}exec -> run bash
??? ${prefix}join - > join group
??? ${prefix}runtime - > runtime
??? ${prefix}setnomor - > Set Nomor Reply
??? ${prefix}setpesan - > Set Pesan Reply
??? ${prefix}setprefix - > Set Prefix
??? ${prefix}toimg - > Convert to Image
??? ${prefix}stiker - > gambar / gif / video Sticker
??? ${prefix}meme - > Random Meme
??? ${prefix}imgtourl - > Upload Telegra.ph
??? ${prefix}memeimg - > memegen.link API
??? ${prefix}tga - > Tag All
??? ${prefix}tga2 - > Tag All v2
??? ${prefix}tga3 - > Tag All v3
??? ${prefix}wait - > What ANime is This ?
??? ${prefix}setnick - > Ganti Nickname WhatsApp kamu
??? ${prefix}setpict - > Ganti photo profile WhatsApp kamu < i > kirim gambar atau reply gambar dengan caption ${prefix}setpict
??? ${prefix}delete - > Hapus pesan(personal / private atau grup)
??? ${prefix}hilih - > ih gisiki giliy
??? ${prefix}owner - > Dapatkan kontak owner
??? ${prefix}kontak - > Kirim Kontak
??? ${prefix}tomp3 - > Video jadi mp3
??? ${prefix}play - > Download music whit yt`)
                    break
                          case 'donasi':
                            fakestatus('Halo kak mau donasi?\nBoleh banget kak, list untuk pembayaran donasi ada dibawah in.\n\n??? Dana : +62 878-9151-8799\n??? Gopay : +62 878-9151-8799\n??? Pulsa : +62 878-9151-8799\n\nTerimakasih sudah berdonasi, uangnya untuk memperpanjang server bot.')
                            break
                          case 'info':
                            fakestatus(`Halo kak ???????? perkenalkan saya botol, saya adalah bot whatsapp yang terbuat dari bahasa node js dan beberapa api, saya juga memakai lib dari *Baileys* yang dibuat oleh *Adiwajshing*\nSaya juga memakai base bot dari *MhankBarBar* yang saya custom (redesain) model\n\nBot ini juga merupakan open source yang dapat anda lihat di https://github.com/progsysdriver/botol-bot\nDiperbolehkan bagi siapapun menggunakan bot kami tetapi ingat, jangan menghilangkan hak cipta dari bot kami\n\nOwner Botol bot adalah Angga surya x ProgsysDriver\nIni dibuat untuk bahan belajar dan senang senang saja, jadi kalau ada kurangnya mohon maaf yang sebesar besarnya.\n\nTerimakasih yang sudah berkonstribusi`)
break
            default:
                }
        } catch(err) {
            console.log('[',color('!', 'red'),']', color(err, 'red'))
        }
    })
}

starts()