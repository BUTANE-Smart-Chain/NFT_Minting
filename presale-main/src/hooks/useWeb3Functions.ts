import config from "../config";
import presaleABI from "../contracts/presaleABI.json";
import tokenABI from "../contracts/tokenABI.json";
import { BigNumber, Contract, ethers, Signer } from "ethers";
import { RootState } from "../store";
import { useSelector, useDispatch } from "react-redux";
import {
  setTokenPrice,
  setTotalTokensforSale,
  setTotalTokensSold,
  setMinBuyLimit,
  setMaxBuyLimit,
} from "../store/presale";
import { useState } from "react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { setBalance } from "../store/wallet";
import { parseUnits, formatUnits } from "ethers/lib/utils";
import { toast } from "react-toastify";
import { storeReferralTransaction, storeTransaction } from "../utils/apis";

const useWeb3Functions = () => {
  const chainId = useSelector(
    (state: RootState) => state.presale.chainId as ChainId
  );
  const presaleContract = new Contract(
    config.presaleContract[chainId],
    presaleABI
  );
  const [loading, setLoading] = useState(false);
  const tokens = useSelector((state: RootState) => state.presale.tokens);
  const dispatch = useDispatch();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const fetchIntialData = async () => {
    setLoading(true);
    const provider = new ethers.providers.JsonRpcProvider(
      config.chains[0].rpcUrls.default.http[0]
    );

    const contract = presaleContract.connect(provider);

    const [totalTokensSold, totalTokensforSale] = await Promise.all([
      contract.totalTokensSold(),
      contract.totalTokensforSale(),
      fetchTokenPrices(contract),
    ]);

    dispatch(setTotalTokensSold(+format(totalTokensSold)));
    dispatch(setTotalTokensforSale(+format(totalTokensforSale)));

    setLoading(false);
  };

  const fetchMinMaxBuyLimits = async () => {
    const contract = presaleContract.connect(provider);

    const [minBuyLimit, maxBuyLimit] = await Promise.all([
      contract.minBuyLimit(),
      contract.maxBuyLimit(),
    ]);

    dispatch(setMinBuyLimit(+format(minBuyLimit)));
    dispatch(setMaxBuyLimit(+format(maxBuyLimit)));
  };

  const fetchTotalTokensSold = async () => {
    const totalTokensSold = await presaleContract
      .connect(provider)
      .totalTokensSold();
    dispatch(setTotalTokensSold(+format(totalTokensSold)));

    return totalTokensSold;
  };

  const fetchLockedBalance = async () => {
    if (!address) return;

    const { symbol, decimals } = config.saleToken[chainId];
    const buyerAmount = await presaleContract
      .connect(provider)
      .buyersAmount(address);
    const balance = +formatUnits(buyerAmount["amount"], decimals);

    dispatch(setBalance({ symbol: symbol, balance }));

    return balance;
  };

  const fetchTokenBalances = async () => {
    if (!address) return;

    for await (const token of tokens[chainId]) {
      let balance: BigNumber;
      if (token.address) {
        const tokenContract = new Contract(token.address, tokenABI, provider);
        balance = await tokenContract.balanceOf(address);
      } else {
        balance = await provider.getBalance(address);
      }

      dispatch(
        setBalance({
          symbol: token.symbol,
          balance: +formatUnits(balance, token.decimals),
        })
      );
    }
  };

  const fetchTokenPrices = async (presaleContract: Contract) => {
    for await (const token of tokens[chainId]) {
      const rate = token.address
        ? await presaleContract.tokenPrices(token.address)
        : await presaleContract.rate();

      dispatch(
        setTokenPrice({
          symbol: token.symbol,
          price: +formatUnits(rate, token.decimals),
        })
      );
    }
  };

  const checkAllowance = async (
    token: Token,
    owner: string,
    spender: string
  ) => {
    if (!token.address) return;

    const tokenContract = new Contract(
      token.address,
      tokenABI,
      signer as Signer
    );
    const allowance = await tokenContract.allowance(owner, spender);

    if (!Number(allowance)) {
      const txSpend = await tokenContract.approve(
        spender,
        parseUnits("9999999999999999999999999999"),
        { from: owner }
      );
      await txSpend.wait();
      toast.success("Spend approved");
    }
  };

  const buyToken = async (value: string | number, token: Token) => {
    setLoading(true);
    let success = false;

    try {
      const amount = parseUnits(`${value}`, token.decimals);
      const contract = presaleContract.connect(signer as Signer);
      let tx;

      if (token.address) {
        await checkAllowance(
          token,
          address as string,
          config.presaleContract[chainId]
        );
        tx = await contract.buyToken(token.address, amount, { from: address });
      } else {
        tx = await contract.buyToken(ethers.constants.AddressZero, amount, {
          from: address,
          value: amount,
        });
      }

      await tx.wait();

      const purchased_amount = token.address
        ? await contract.getTokenAmount(token.address, amount)
        : await contract.getTokenAmount(ethers.constants.AddressZero, amount);

      storeTransaction({
        wallet_address: address,
        purchased_amount: +format(purchased_amount),
        paid_amount: value,
        transaction_hash: tx.hash,
        paid_with: token.symbol,
      });

      storeReferralTransaction({
        purchased_amount: +format(purchased_amount),
        paid: value,
        transaction_hash: tx.hash,
        payable_token: token.symbol,
      });

      fetchTokenBalances();
      fetchLockedBalance();
      fetchTotalTokensSold();

      toast.success(
        `You have successfully purchased $${config.saleToken[chainId].symbol} Tokens. Thank you!`
      );

      success = true;
    } catch (error: any) {
      if (
        error?.error?.code === -32603 &&
        error?.error?.message.includes("reverted")
      ) {
        toast.error(error.error.message?.replace("execution reverted:", ""));
      } else toast.error("Signing failed, please try again!");
    }

    setLoading(false);

    return { success };
  };

  const addTokenAsset = async (token: Token) => {
    if (!token) return;
    try {
      await window.ethereum?.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals ?? 18,
            image: token.image.includes("http")
              ? token.image
              : `${window.location.origin}${token.image}`,
          },
        },
      } as any);
      toast.success("Token imported to metamask successfully");
    } catch (e) {
      toast.error("Token import failed");
    }
  };

  const parse = (value: string | number) =>
    parseUnits(`${value}`, config.saleToken[chainId].decimals);

  const format = (value: string) =>
    formatUnits(`${value}`, config.saleToken[chainId].decimals);

  return {
    loading,
    parse,
    format,
    buyToken,
    addTokenAsset,
    fetchIntialData,
    fetchLockedBalance,
    fetchTokenBalances,
    fetchMinMaxBuyLimits,
  };
};

export default useWeb3Functions;
