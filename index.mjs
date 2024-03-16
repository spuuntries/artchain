import dotenv from "dotenv";
dotenv.config();

import fs from "node:fs";
const wordlist = JSON.parse(fs.readFileSync("./wordlist.json")).list;

import * as Discord from "discord.js";
import { createLibp2p } from "libp2p";
import { tcp } from "@libp2p/tcp";
import { webSockets } from "@libp2p/websockets";
import { noise } from "@chainsafe/libp2p-noise";
import { mplex } from "@libp2p/mplex";
import { multiaddr } from "@multiformats/multiaddr";
import { ping } from "@libp2p/ping";
import crypto from "node:crypto";

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

createLibp2p({
  addresses: {
    listen: ["/ip4/127.0.0.1/tcp/0"],
  },
  transports: [tcp(), webSockets()],
  connectionEncryption: [noise()],
  streamMuxers: [mplex()],
  services: { ping: ping() },
}).then(async (node) => {
  await node.start().then(() => {
    console.log("listening on addresses:");
    node.getMultiaddrs().forEach((addr) => {
      console.log(addr.toString());
    });
  });
});

// setInterval(() => {
//   if (Date.now() % 3 != 0) return; // Do aggregation only on every third
//   second of UNIX epoch to ensure new randomness const currentWord =
//   getWord();
// }, 1000);
