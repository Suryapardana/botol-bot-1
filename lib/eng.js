exports.wait = () => {
	return`\`\`\`[🗿] Loading\`\`\``
}

exports.succes = () => {
	return`\`\`\`Sukses\`\`\``
}

exports.lvlon = () => {
	return`\`\`\`Sukses enable leveling\`\`\``
}

exports.lvloff = () => {
	return`\`\`\`Sukses disable leveling\`\`\``
}

exports.lvlnul = () => {
	return`\`\`\`Levelmu maaih kosong\`\`\``
}

exports.lvlnoon = () => {
	return`\`\`\`Leveling belum di aktifkan\`\`\``
}

exports.noregis = () => {
	return`\`\`\`「 BELUM DAFTAR 」\`\`\`\n\n\`\`\`silahkan ketik ${prefix}verify\`\`\`
`
}

exports.rediregis = () => {
	return`\`\`\`Hai ${pushname} kamu sudah terdaftar di database bot\`\`\``
}

exports.stikga = () => {
	return`\`\`\`Yah gagal coba ulangi beberapa saat lagi\`\`\`
	`
}

exports.linkga = () => {
	return`\`\`\`Maaf link tidak valid\`\`\``
}

exports.groupo = () => {
	return`\`\`\`Hanya untuk Group\`\`\``
}

exports.ownerb = () => {
	return`\`\`\`Hanya untuk pengguna Premium & Owner\`\`\``
}

exports.premo = () => {
	return`\`\`\`Hanya untuk pengguna Premium\`\`\``
}

exports.ownerg = () => {
	return`\`\`\`Hanya untuk Owner\`\`\``
}

exports.adminb = () => {
	return`\`\`\`Hanya untuk admin Bot\`\`\``
}

exports.admin = () => {
	return`\`\`\`Hanya untuk admin Group\`\`\``
}

exports.badmin = () => {
	return`\`\`\`Jadikan bot sebagai Admin terlebih dahulu\`\`\``
}

exports.nimu = () => {
	return`\`\`\`Mode anime belum diaktifkan\`\`\``
}

exports.bug = () => {
	return`\`\`\`Masalah telah di laporkan ke owner BOT, laporan palsu/main2 tidak akan ditanggapi\`\`\``
}

exports.wrongf = () => {
	return`\`\`\`Format salah/text kosong\`\`\``
}

exports.baned = () => {
	return`\`\`\`[❗] Anda telah telah di banned oleh bot, dikarenakan anda telah melanggar ketentuan bot, silahkan hubungi owner jika ingin kembali menggunakan bot\`\`\``
}

exports.clears = () => {
	return`\`\`\`CLEAR ALL SUCCES\`\`\``
}

exports.pc = () => {
	return`*「 REGISTRASI 」*\n\nuntuk mengetahui apa kamu sudah terdaftar silahkah check message yang saya kirim \n\nNOTE:\n\`\`\`jika kamu belum mendapatkan pesan. berarti kamu belum menyimpan nomer bot\`\`\`
	`
}

exports.registered = (pushname, serialUser, time, sender) => {
	return`\`\`\`Verifikasi Sukses\`\`\`

• \`\`\`Nama\`\`\` : ${pushname}
• \`\`\`Nomor\`\`\`: wa.me/${sender.split("@")[0]}
• \`\`\`Waktu Pendaftaran\`\`\` :  
${time}
• \`\`\`SN\`\`\` :
${serialUser}`
}

exports.levelup = (pushname, sender, getLevelingXp, getLevel, getLevelingLevel, role, bars) => {
	return`
 *「 LEVEL UP 」*
 
• \`\`\`Nama\`\`\` : ${pushname}
• \`\`\`Nomer\`\`\` : ${sender.split("@")[0]}
• \`\`\`Xp\`\`\` : ${getLevelingXp(sender)}
• \`\`\`Role\`\`\` : ${role}
• \`\`\`Level\`\`\` : ${getLevel} > ${getLevelingLevel(sender)}
`
}

exports.limitend = (pushname) => {
	return`\`\`\`Maaf ${pushname} limit hari ini habis\`\`\`
	\`\`\`Beli limit dengan cara ${prefix}buylimit/naik level\`\`\`
`
}

exports.premlimitend = (pushname) => {
	return`\`\`\`Maaf ${pushname} premium limit hari ini habis\`\`\`
\`\`\`Beli premlimit dengan cara ${prefix}buypremlimit/naik level\`\`\`
	`
}




