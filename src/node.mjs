import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { unixfs } from "@helia/unixfs";
import { bootstrap } from "@libp2p/bootstrap";
import { identify } from "@libp2p/identify";
import { tcp } from "@libp2p/tcp";
import { gossipsub } from "@chainsafe/libp2p-gossipsub";
import { MemoryBlockstore } from "blockstore-core";
import { MemoryDatastore } from "datastore-core";
import { mdns } from "@libp2p/mdns";
import { createHelia } from "helia";
import { createLibp2p } from "libp2p";

export class Node {
  async init() {
    const blockstore = new MemoryBlockstore(),
      datastore = new MemoryDatastore(),
      libp2p = await createLibp2p({
        datastore,
        addresses: {
          listen: ["/ip4/127.0.0.1/tcp/0"],
        },
        transports: [tcp()],
        connectionEncryption: [noise()],
        streamMuxers: [yamux()],
        peerDiscovery: [
          mdns({
            interval: 1000,
          }),
          bootstrap({
            list: [
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
              "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
            ],
          }),
        ],
        services: {
          identify: identify(),
          pubsub: gossipsub(),
        },
      });

    this.helia = await createHelia({
      datastore,
      blockstore,
      libp2p,
    });
  }
}
