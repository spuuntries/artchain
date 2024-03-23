import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";
const wordlist = JSON.parse(fs.readFileSync("./wordlist.json").toString()).list;

import * as Discord from "discord.js";
import { joinRoom } from "trystero";

const procenv = process.env,
  client = new Discord.Client({ intents: ["MessageContent", "GuildMessages"] });

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

const room = joinRoom({ appId: "art_chain_rocks" }, "primary");

room.onPeerJoin((peerId) => console.log(`${peerId} joined`));
room.onPeerLeave((peerId) => console.log(`${peerId} left`));

// setInterval(() => {
//   if (Date.now() % 3 != 0) return; // Do aggregation only on every third
//   second of UNIX epoch to ensure new randomness const currentWord =
//   getWord();
// }, 1000);
