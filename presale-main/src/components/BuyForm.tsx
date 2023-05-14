import { useEffect, useMemo, useState } from "react";
import { ReactComponent as ETHIcon } from "../assets/svg/eth.svg";
import { ReactComponent as DownArrowIcon } from "../assets/svg/down-arrow.svg";
import { ReferralModal } from "./ReferralModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import config from "../config";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";
import useWeb3Functions from "../hooks/useWeb3Functions";
import Loading from "./Loading";
import { toast } from "react-toastify";
import presale, { presaleSlice, setCurrentChain } from "../store/presale";
import { SelectTokenModal } from "./SelectTokenModal";
import { ConnectWallet, useConnectionStatus,ChainId } from "@thirdweb-dev/react";
import { useSigner,useActiveChain,useAddress } from "@thirdweb-dev/react";
import {BigNumber} from 'bignumber.js'
import {  Contract, ethers, Signer } from "ethers";
import TokenABI from "../contracts/tokenABI.json";
import PresaleABI from "../contracts/presaleABI.json";

const BuyForm = () => {
  const signer = useSigner();
  const address=useAddress();
  const isconnected=useConnectionStatus();
  const chainId = useActiveChain();
const [totalsupply, settotalsupply] = useState("0");
const [maxsupply, setMaxsupply] = useState("0")
const [balance, setBalance] = useState("0");
const [amount, setAmount] = useState(1)
const [maxuserlimit, setMaxlimit] = useState("0");
const [nftprice, setNftprice] = useState("0");
const [hasallowance, setHasAllowance] = useState(false);
const [currency, setCurrency] = useState("")
const [updatecounter, setUpdatecounter] = useState(0);
const [isAllowanceReq, setIsAllowanceReq] = useState(false)

  //const chainId = useSelector((state: RootState) => state.presale.chainId);
  const tokens = useSelector((state: RootState) => state.presale.tokens);
  const balances = useSelector((state: RootState) => state.wallet.balances);
  const tokenPrices = useSelector((state: RootState) => state.presale.prices);
  const totalTokensSold = useSelector(
    (state: RootState) => state.presale.totalTokensSold
  );
  const totalTokensForSale = useSelector(
    (state: RootState) => state.presale.totalTokensforSale
  );
  const minBuyLimit = useSelector(
    (state: RootState) => state.presale.minBuyLimit
  );
  const maxBuyLimit = useSelector(
    (state: RootState) => state.presale.maxBuyLimit
  );
  const tokenBalance = useSelector((state: RootState) => state.wallet.balances);
  const saleToken = config.saleToken;

  const [fromToken, setFromToken] = useState<Token>(tokens[97][0]);
  const [toToken, setToToken] = useState<Token>(
    saleToken[97] as Token
  );

  const [fromValue, setFromValue] = useState<string | number>("");
  const [toValue, setToValue] = useState<string | number>("");

  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isSelectTokenModalOpen, setIsSelectTokenModalOpen] = useState(false);

  const {
    fetchIntialData,
    fetchLockedBalance,
    fetchTokenBalances,
    fetchMinMaxBuyLimits,
    buyToken,
    loading,
  } = useWeb3Functions();

  const { open } = useWeb3Modal();


  const tokenPrice = useMemo(
    () => tokenPrices[config.displayPrice[97]] || 1,
    [tokenPrices]
  );

  const fixedNumber = (num: number, decimals = 6) =>
    +parseFloat((+num).toFixed(decimals));

  const formatNumber = (num: number) =>
    Intl.NumberFormat().format(fixedNumber(num, 2));

  const soldPercentage = useMemo(
    () =>
      fixedNumber(
        ((totalTokensSold * tokenPrice + config.extraSoldAmount) /
          (totalTokensForSale * tokenPrice)) *
          100,
        2
      ) || 0,
    [totalTokensSold, totalTokensForSale, tokenPrice]
  );

  const lockedToken = useMemo(
    () => formatNumber(balances[toToken.symbol]),
    [balances]
  );

  const insufficientBalance = useMemo(() => {
    if (!fromValue) return false;
    return +fromValue > tokenBalance[fromToken.symbol];
  }, [fromValue, tokenBalance]);

  const fromValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (!value) {
      emptyValues();
      return;
    }

    setFromValue(fixedNumber(+value));
    if (tokenPrices[fromToken.symbol] !== 0) {
      setToValue(fixedNumber(+value / tokenPrices[fromToken.symbol], 4));
    }
  };

  const toValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value) {
      emptyValues();
      return;
    }

    setToValue(fixedNumber(+value, 4));
    if (tokenPrices[fromToken.symbol] !== 0) {
      setFromValue(fixedNumber(+value * tokenPrices[fromToken.symbol]));
    }
  };

  const emptyValues = () => {
    setFromValue("");
    setToValue("");
  };
  




  const dispatch = useDispatch();
  const { chain } = useNetwork();

  useEffect(() => {
    // if (!isPresaleStarted) return;
    if (!chain) return;
    dispatch(setCurrentChain(chain?.id || config.chains[0].id));
  }, [chain]);

  useEffect(() => {
    // if (!isPresaleStarted) return;
    if (!address || !chain) return;
    fetchLockedBalance();
    fetchTokenBalances();
    fetchMinMaxBuyLimits();
  }, [address, chain]);

  useEffect(() => {
    // if (!isPresaleStarted) return;
    fetchIntialData();
  }, []);

  useEffect(()=>{
    if(fromToken.address)
    setIsAllowanceReq(true)
      else
      setIsAllowanceReq(false)
  },[tokenPrices[fromToken.symbol]])
  async function loadAllowance()
  {
    
    const tokenContract = new Contract(fromToken.address?fromToken.address:"", TokenABI, signer);
    const allowance=await tokenContract.allowance(address,config.presaleContract[97]);
    console.log(new BigNumber(allowance.toString()).toString(),(new BigNumber(fromValue.toString()).multipliedBy(10**18)).toString(),new BigNumber(allowance.toString()).gte(new BigNumber(fromValue.toString()).multipliedBy(10**18)))
  if(new BigNumber(allowance.toString()).gte(new BigNumber(fromValue.toString()).multipliedBy(10**18)))
  setHasAllowance(true);
  else
  setHasAllowance(false)
  }
  useEffect(()=>{
    loadAllowance()
  },[isconnected,address,fromValue,updatecounter])
  setInterval(() => {setUpdatecounter(updatecounter+1)}, 10000);
  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-[#1a2025]/70 backdrop-blur-xl">
      {loading && <Loading />}

      {!loading && (
        <div className="absolute -top-8 w-full">
          <p className="mx-10 rounded-2xl border-2 border-white/10 bg-gradient-to-t from-black/20 to-transparent py-4 text-center text-2xl backdrop-blur-3xl">
            GET <span className="font-semibold text-red-500">15%</span> BONUSS
          </p>
        </div>
      )}
      <div  className="mb-6 flex flex-col gap-6 px-5 pt-16">
        <div
          className={`flex gap-4 rounded-xl border-2 border-transparent bg-[#232c3a]/50 py-2.5 pr-2.5 pl-6 ring-4 ring-transparent focus-within:border-primary/50 focus-within:ring-primary/20 ${
            insufficientBalance
              ? "!border-red-500/50 !text-red-400 !ring-red-500/20"
              : ""
          }`}
        >
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm">You send</label>
            <input
              className="w-full bg-transparent text-xl outline-none"
              type="number"
              step={0.0001}
              placeholder="0.0"
              value={fromValue}
              onChange={fromValueChange}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#2F3B4F] py-2.5 px-4 transition-opacity duration-200 hover:opacity-75"
            onClick={() => setIsSelectTokenModalOpen(true)}
          >
            <img
              src={fromToken.image}
              alt={fromToken.symbol}
              className="h-7 w-7 object-contain"
            />
            <span>{fromToken.symbol}</span>
            <DownArrowIcon />
          </button>
        </div>
        
        <div className="flex gap-4 rounded-xl border-2 border-transparent bg-[#232c3a]/50 py-2.5 pr-2.5 pl-6 ring-4 ring-transparent focus-within:border-primary/50 focus-within:ring-primary/20">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-sm">You get</label>
            <input
              type="number"
              value={toValue}
              onChange={toValueChange}
              className="w-full bg-transparent text-xl outline-none"
              placeholder="0.0"
              step={0.0001}
            />
          </div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-xl bg-[#2F3B4F] py-2.5 px-4 transition-opacity duration-200 hover:opacity-75"
            disabled
          >
            <img
              src={toToken.image}
              alt={toToken.symbol}
              className="h-7 w-7 object-contain"
            />

            <span>{toToken.symbol}</span>
          </button>
        </div>
        {insufficientBalance && (
          <p className="text-sm text-red-500">
            Oops! It looks like you don't have enough {fromToken.symbol} to pay
            for that transaction. Please reduce the amount of {fromToken.symbol}{" "}
            and try again.
          </p>
        )}
        <div className="-mx-5 h-0.5 bg-[#30353A]"></div>
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <span>
              <span className="text-2xl">
                $
                {formatNumber(
                  totalTokensSold * tokenPrice + config.extraSoldAmount
                )}
                /
              </span>
              ${formatNumber(totalTokensForSale * tokenPrice)}
            </span>
            <span>{soldPercentage}%</span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-md bg-white">
            <div
              className="absolute inset-0 z-10 bg-gradient-to-r from-green-500/30 to-green-500"
              style={{ width: `${soldPercentage}%` }}
            ></div>
          </div>
        </div>
        <p className="text-center text-sm font-medium uppercase text-[#D1D3FF]">
          {isconnected
            ? `you purchased ${lockedToken} ${toToken.symbol} TOKENS`
            : `Connect your wallet to buy ${toToken.symbol}`}
        </p>
        <div className="-mx-5 h-[2px] bg-[#30353A]"></div>
        {isconnected==="connected"?!isAllowanceReq||hasallowance?<button
            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            onClick={async ()=>{
              const presaleContract = new Contract(config.presaleContract[97], PresaleABI, signer);
              
              presaleContract.buyToken(!isAllowanceReq?"0x0000000000000000000000000000000000000000":fromToken.address,address,toValue.toString(),{value:!isAllowanceReq?new BigNumber(fromValue.toString()).multipliedBy(10**18).toString():"0"});
              
              setUpdatecounter(updatecounter+1);
            }}
          >
            Buy
          </button>:
          <button
          className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
          onClick={()=>{
            const tokenContract = new Contract(fromToken.address?fromToken.address:"", TokenABI, signer);
            tokenContract.approve(config.presaleContract[97],new BigNumber(fromValue.toString()).multipliedBy(10**18).toString());
            setUpdatecounter(updatecounter+1);
          }}
        >
          Approve
        </button>
        :<ConnectWallet
        theme="dark"
        className=""
      ></ConnectWallet>}
        {/* <p className="text-center text-sm text-white/50">
          By clicking Exhchange you agree with{" "}
          <a
            href="#"
            className="text-primary transition-opacity duration-200 hover:opacity-75"
          >
            Terms of Use
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="text-primary transition-opacity duration-200 hover:opacity-75"
          >
            Privacy Policy
          </a>
        </p> */}
        
      </div>
      {isSelectTokenModalOpen && (
        <SelectTokenModal
          closeModal={() => setIsSelectTokenModalOpen(false)}
          selectToken={(token: Token) => {
            setFromToken(token);
            setFromValue("");
            setToValue("");
            setIsSelectTokenModalOpen(false);
          }}
        />
      )}
      {isReferralModalOpen && (
        <ReferralModal closeModal={() => setIsReferralModalOpen(false)} />
      )}
    </div>
  );
};

export default BuyForm;
