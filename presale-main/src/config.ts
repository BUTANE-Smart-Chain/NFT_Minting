import { bsc, bscTestnet } from "wagmi/chains";

const config = {
  chains: [bscTestnet],
  presaleStartTime: 1680912000,
  presaleContract: {
    [bscTestnet.id]: "0x15B07111193A778BDFa84109e742a7c772Ca418b",
    [bsc.id]: "0xdf0510D063e83f342e8bdd8d5785058D39580B6A",
  }, // presale contract address

  saleToken: {
    [bscTestnet.id]: {
      address: "0x0e4574025f73fc059631C9dA7bCea0e72afd3b1F", // token address
      symbol: "BETX", // token symbol
      name: "Betix", // token name
      image: "/icon.png", // token image
      decimals: 18, // token decimals
    },
    [bsc.id]: {
      address: "0xbb512218ba9a7C5595cc2c55AD3102a88F280b29", // token address
      symbol: "BETX", // token symbol
      name: "Betix", // token name
      image: "/img/tokens/betix.svg", // token image
      decimals: 18, // token decimals
    },
  },

  displayPrice: {
    [bscTestnet.id]: "USDT",
    [bsc.id]: "USDT",
  },

  extraSoldAmount: 0,

  whitelistedTokens: {
    [bscTestnet.id]: [
      {
        address: null,
        symbol: "BNB",
        name: "Binance Token",
        image: "/img/tokens/bnb.webp",
        decimals: 18,
      },
      {
        address: "0x44117cF8A84de275e0a9267147e5268A1edfF42F",
        symbol: "BUSD",
        name: "Binance-Peg BUSD Token",
        image: "/img/tokens/busd.webp",
        decimals: 18,
      },
    ] as Token[],
    [bsc.id]: [
      {
        address: null,
        symbol: "BNB",
        name: "Binance Token",
        image: "/img/tokens/bnb.webp",
        decimals: 18,
      },
      
      {
        address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
        symbol: "BUSD",
        name: "Binance-Peg BUSD Token",
        image: "/img/tokens/busd.webp",
        decimals: 18,
      }
    ] as Token[],
  },
};

export default config;
