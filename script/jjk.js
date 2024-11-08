const fs = require("fs");
const axios = require("axios");
const request = require("request");

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

module.exports.config = {
  name: "jjkedit",
  version: "1.0.0",
  aliases: ["jjk"],
  role: 0,
  hasPrefix: true,
  description: "Random JJK edit from TikTok",
  credits: "Kaizenji",
  cooldown: 5,
};

module.exports.run = async function({ api, event }) {
  const { messageID, threadID } = event;

  const downloadMessage = await api.sendMessage(formatFont("⌛ | Sending random JJK edit please wait..."), threadID);

  try {
    const response = await axios.get('https://kaizenji-rest-api.onrender.com/video/jjk', {
      responseType: 'arraybuffer'
    });

    const path = __dirname + `/cache/random_jjk.mp4`;
    fs.writeFileSync(path, Buffer.from(response.data, 'binary'), "binary");

    setTimeout(() => {
      api.sendMessage({
        body: formatFont(`Here's your Random JJK Video from TikTok`),
        attachment: fs.createReadStream(path)
      }, threadID, () => {
        api.unsendMessage(downloadMessage.messageID);
        fs.unlinkSync(path);
      });
    }, 5000);
    
  } catch (error) {
    api.sendMessage(formatFont(`Error fetching video: ${error.message}`), threadID, messageID);
  }
};