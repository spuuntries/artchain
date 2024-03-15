require("dotenv").config();
const wordlist = require("./wordlist.json").list,
  procenv = process.env,
  Discord = require("discord.js"),
  client = new Discord.Client({ intents: ["MessageContent", "GuildMessages"] }),
  { createLibp2p } = require("libp2p"),
  { tcp } = require("@libp2p/tcp"),
  { webSockets } = require("@libp2p/websockets"),
  { noise } = require("@chainsafe/libp2p-noise"),
  { mplex } = require("@libp2p/mplex"),
  { multiaddr } = require("@multiformats/multiaddr"),
  { ping } = require("@libp2p/ping"),
  crypto = require("crypto");

/**
 * Generate random integer from drand's quicknet
 * @param {number} min - Minimum integer (inclusive)
 * @param {number} max - Maximum integer (inclusive)
 * @returns {Promise<number>}
 */
async function generateRandom(min, max) {
  return (
    (Number(
      BigInt(
        "0x" +
          (
            await (
              await fetch(
                "https://api.drand.sh/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971/public/latest"
              )
            ).json()
          ).randomness
      )
    ) %
      (max - min + 1)) +
    min
  );
}

/**
 *
 * @returns {string}
 */
async function getWord() {
  return wordlist[await generateRandom(0, wordlist.length - 1)];
}

const node = await createLibp2p({
  transports: [tcp(), webSockets()],
  connectionEncryption: [noise()],
  streamMuxers: [mplex()],
  services: { ping: ping({ protocolPrefix: "ach" }) },
});

node.start();

node.addEventListener("start");

// setInterval(() => {
//   if (Date.now() % 3 != 0) return; // Do aggregation only on every third second of UNIX epoch to ensure new randomness
//   const currentWord = getWord();
// }, 1000);
