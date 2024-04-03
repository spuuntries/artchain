/**
 * Generate random integer from drand's quicknet
 * @param {number} min - Minimum integer (inclusive)
 * @param {number} max - Maximum integer (inclusive)
 * @returns {Promise<number>}
 */
export async function generateRandom(min, max) {
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
 * @param {string[]} wordlist - List of words
 * @returns {string}
 */
export async function getWord(wordlist) {
  return wordlist[await generateRandom(0, wordlist.length - 1)];
}
