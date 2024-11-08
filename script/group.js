module.exports.config = {
  name: "group",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "HungCho (Khánh Milo Fix)",
  description: "Parent group settings.",
  usages: "[name/emoji/admin/image/info]",
  cooldown: 5,
};

module.exports.run = async({ api, event, args, admin }) => {
  const fs = require("fs-extra");
  const request = require("request");

  if (args.length == 0) {
    return api.sendMessage(
      formatFont(`You can use:\n/group emoji [icon]\n\n/group name [the box name needs to be changed]\n\n/group image [rep any image needs to be set as group chat image]\n\n/gcadmin [tag] => it will give qtv to the person tagged\n\n/group info => All group information!`),
      event.threadID,
      event.messageID
    );
  }

  if (args[0] == "name") {
    var content = args.join(" ");
    var c = content.slice(4, 99) || event.messageReply.body;
    api.setTitle(`${c}`, event.threadID);
  }

  if (args[0] == "emoji") {
    const name = args[1] || event.messageReply.body;
    api.changeThreadEmoji(name, event.threadID);
  }

  if (args[0] == "me") {
    if (args[1] == "admin") {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
      if (!find) {
        api.sendMessage(formatFont("BOT needs to throw admin to use?"), event.threadID, event.messageID);
      } else if (!admin.includes(event.senderID)) {
        api.sendMessage(formatFont("Cunt powers?"), event.threadID, event.messageID);
      } else {
        api.changeAdminStatus(event.threadID, event.senderID, true);
      }
    }
  }

  if (args[0] == "admin") {
    let namee;
    if (args.join().indexOf('@') !== -1) {
      namee = Object.keys(event.mentions);
    } else {
      namee = args[1];
    }
    if (event.messageReply) {
      namee = event.messageReply.senderID;
    }

    const threadInfo = await api.getThreadInfo(event.threadID);
    const findd = threadInfo.adminIDs.find(el => el.id == namee);
    const find = threadInfo.adminIDs.find(el => el.id == api.getCurrentUserID());
    const finddd = threadInfo.adminIDs.find(el => el.id == event.senderID);

    if (!finddd) return api.sendMessage(formatFont("You are not a box admin?"), event.threadID, event.messageID);
    if (!find) return api.sendMessage(formatFont("Don't throw the admin using the cock?"), event.threadID, event.messageID);
    if (!findd) {
      api.changeAdminStatus(event.threadID, namee, true);
    } else {
      api.changeAdminStatus(event.threadID, namee, false);
    }
  }

  if (args[0] == "image") {
    if (event.type !== "message_reply") {
      return api.sendMessage(formatFont("❌ You must reply to a certain audio, video, or photo"), event.threadID, event.messageID);
    }
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) {
      return api.sendMessage(formatFont("❌ You must reply to a certain audio, video, or photo"), event.threadID, event.messageID);
    }
    if (event.messageReply.attachments.length > 1) {
      return api.sendMessage(formatFont(`Please reply only one audio, video, or photo!`), event.threadID, event.messageID);
    }
    var callback = () => api.changeGroupImage(fs.createReadStream(__dirname + "/cache/1.png"), event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"));
    return request(encodeURI(event.messageReply.attachments[0].url)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
  }

  if (args[0] == "info") {
    var threadInfo = await api.getThreadInfo(event.threadID);
    let threadMem = threadInfo.participantIDs.length;
    var gendernam = [];
    var gendernu = [];
    var nope = [];
    for (let z in threadInfo.userInfo) {
      var gioitinhone = threadInfo.userInfo[z].gender;
      var nName = threadInfo.userInfo[z].name;

      if (gioitinhone == 'MALE') {
        gendernam.push(z + gioitinhone);
      } else if (gioitinhone == 'FEMALE') {
        gendernu.push(gioitinhone);
      } else {
        nope.push(nName);
      }
    }
    var nam = gendernam.length;
    var nu = gendernu.length;
    let qtv = threadInfo.adminIDs.length;
    let sl = threadInfo.messageCount;
    let icon = threadInfo.emoji;
    let threadName = threadInfo.threadName;
    let id = threadInfo.threadID;
    var listad = '';
    var qtv2 = threadInfo.adminIDs;
    for (let i = 0; i < qtv2.length; i++) {
      const infu = (await api.getUserInfo(qtv2[i].id));
      const name = infu[qtv2[i].id].name;
      listad += '•' + name + '\n';
    }
    let sex = threadInfo.approvalMode;
    var pd = sex == false ? 'Turn off' : sex == true ? 'Turn on' : 'Kh';
    var pdd = sex == false ? '❎' : sex == true ? '✅' : '⭕';
    var callback = () =>
      api.sendMessage(
        {
          body: formatFont(`GC Name: ${threadName}\nGC ID: ${id}\n${pdd} Approve: ${pd}\nEmoji: ${icon}\n-Information:\nTotal ${threadMem} members\nMale ${nam} members \nFemale: ${nu} members\n\nWith ${qtv} Administrators include:\n${listad}\nTotal number of messages: ${sl} msgs.`),
          attachment: fs.createReadStream(__dirname + '/cache/1.png')
        },
        event.threadID,
        () => fs.unlinkSync(__dirname + '/cache/1.png'),
        event.messageID
      );
    return request(encodeURI(`${threadInfo.imageSrc}`)).pipe(fs.createWriteStream(__dirname + '/cache/1.png')).on('close', () => callback());
  }
};

let fontEnabled = true;

function formatFont(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    if (fontEnabled && char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}