const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "waifu",
  version: "1.0",
  role: 0,
  credits: "Kaizenji",
  description: "Send a random waifu image from the API.",
  cooldown: 5,
  hasPrefix: true,
  usage: "waifu",
};

function applyFontMapping(text) {
  const fontMapping = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂", j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆",
    n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋", s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨", J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬",
    N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱", S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹"
  };

  let formattedText = "";
  for (const char of text) {
    formattedText += fontMapping[char] || char;
  }
  return formattedText;
}

module.exports.run = async function ({ api, event }) {
  const tid = event.threadID;
  const mid = event.messageID;

  try {
    const response = await axios.get('https://nash-rest-api.onrender.com/waifu?search=waifu');
    const data = response.data;

    if (data && data.data.images.length > 0) {
      const waifuImage = data.data.images[0].url;
      const outputPath = __dirname + `/cache/waifu_${tid}_${mid}.jpeg`;

      const imageResponse = await axios({
        method: 'get',
        url: waifuImage,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(outputPath);
      imageResponse.data.pipe(writer);

      writer.on("finish", () => {
        const waifuMessage = applyFontMapping("Here's your waifu 🌸");

        api.sendMessage({
          body: waifuMessage,
          attachment: fs.createReadStream(outputPath)
        }, tid, () => {
          fs.unlinkSync(outputPath);
        }, mid);
      });

      writer.on("error", err => {
        api.sendMessage(applyFontMapping(`Error while saving image: ${err.message}`), tid, mid);
      });
    } else {
      api.sendMessage(applyFontMapping('No waifu found at this moment.'), tid, mid);
    }
  } catch (error) {
    api.sendMessage(applyFontMapping(`Failed to fetch waifu: ${error.message}`), tid, mid);
  }
};