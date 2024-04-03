import fs from "node:fs";
import dotenv from "dotenv";
import * as Discord from "discord.js";
import { Node } from "./src/node.mjs";
import { getWord } from "./src/utils.mjs";

dotenv.config();
const wordlist = JSON.parse(fs.readFileSync("./wordlist.json").toString()).list,
  procenv = process.env,
  client = new Discord.Client({ intents: ["MessageContent", "GuildMessages"] }),
  node = new Node();

await node.init();

// setInterval(() => {
//   if (Date.now() % 3 != 0) return; // Do aggregation only on every third
//   second of UNIX epoch to ensure new randomness const currentWord =
//   getWord();
// }, 1000);
