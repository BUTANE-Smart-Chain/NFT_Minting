
import { toast } from "react-toastify";
import { ConnectWallet, useConnectionStatus,ChainId } from "@thirdweb-dev/react";
import {  Contract, ethers, Signer } from "ethers";
import NFTABI from "../contracts/nft.json";
import TokenABI from "../contracts/tokenABI.json";
import { useSigner,useActiveChain,useAddress } from "@thirdweb-dev/react";
import {BigNumber} from 'bignumber.js'
import config from "../config";
import { useEffect, useRef, useState } from "react";
import { useChainId } from "wagmi";
const NFTForm = () => {
  const signer = useSigner();
  const address=useAddress();
  const isconnected=useConnectionStatus();
  const chainId = useActiveChain();
console.log(isconnected,chainId?.networkId)
const [totalsupply, settotalsupply] = useState("0");
const [maxsupply, setMaxsupply] = useState("0")
const [balance, setBalance] = useState("0");
const [amount, setAmount] = useState(1)
const [maxuserlimit, setMaxlimit] = useState("0");
const [nftprice, setNftprice] = useState("0");
const [hasallowance, setHasAllowance] = useState(false);
const [currency, setCurrency] = useState("")

const inpamount=useRef<HTMLInputElement>(null);

const provider = new ethers.providers.JsonRpcProvider(
  chainId?.networkId===56?"https://bsc-dataseed1.binance.org":"https://data-seed-prebsc-1-s2.binance.org:8545"
);

// "https://bsc-dataseed1.binance.org",
// "0x41138e96E6D10F6d5a5412a21c8780917bb34469"
// "0xddD99e4A8e03A6daA09a4382E91788bCf06EE8e3"
const nftaddress="0xddD99e4A8e03A6daA09a4382E91788bCf06EE8e3";
const nftContract = new Contract(nftaddress, NFTABI, signer);
async function loadAllowance()
{
  
  const tokenContract = new Contract(currency.toString(), TokenABI, signer);
  const allowance=await tokenContract.allowance(address,nftaddress);
if(new BigNumber(allowance).gte(new BigNumber(nftprice).multipliedBy(amount)))
setHasAllowance(true);
else
setHasAllowance(false)
}
async function loadData()
{
  
  
  const bal=await nftContract.balanceOf(address)
  const total=await nftContract.totalSupply()
  const max=await nftContract.maxSupply()
  const maxlimit=await nftContract.MAX_PER_WALLET()
  const price=await nftContract.mintPrice()
  const tokenaddr=await nftContract.currency();
  setCurrency(tokenaddr.toString())
  setBalance(bal.toString())
  settotalsupply(total.toString())
  setMaxsupply(max.toString())
  setMaxlimit(maxlimit.toString())
  setNftprice(price.toString())
}
useEffect(()=>{
  loadData()
},[isconnected,address])
useEffect(()=>{
  loadAllowance()
},[isconnected,address,amount])

  return (
    <div className="relative mx-auto w-full max-w-lg rounded-3xl bg-[#1a2025]/70 backdrop-blur-xl">
      

      
        <div className="absolute -top-8 w-full">
          <p className="mx-10 rounded-2xl border-2 border-white/10 bg-gradient-to-t from-black/20 to-transparent py-4 text-center text-2xl backdrop-blur-3xl">
            Mint NFT
          </p>
        </div>
    
      <div className="mb-6 flex flex-col gap-6 px-5 pt-16">
      <label className="text-sm">Amount</label>
          <div className="flex flex-row">
            
            <input
onChange={(e)=>{
setAmount(parseInt(e.currentTarget.value))
}}
              className="w-10/12 bg-transparent text-xl outline-none"
              type="number"
              step={1}
              placeholder={amount.toString()}
            />
          <button onClick={()=>{if(amount>1)setAmount(amount-1)}} className="btn w-7 h-7 m-auto rounded-full bg-primary text-lg font-semibold text-secondary">
  -
</button>

<button onClick={()=>{if((amount+parseInt(balance))<parseInt(maxuserlimit))setAmount(amount+1)}} className="btn w-7 h-7 rounded-full m-auto bg-primary text-lg font-semibold text-secondary">
  +
</button>
         
        </div>
       
        
        <div className="flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <span>
              <span className="text-2xl">
                
                {totalsupply}/
              </span>{maxsupply}
            </span>
          </div>
          <div className="relative h-4 overflow-hidden rounded-md bg-white">
            <div
              className="absolute inset-0 z-10 bg-gradient-to-r from-green-500/30 to-green-500"
              style={{ width: `${(parseInt(totalsupply)*100)/parseInt(maxsupply)}%` }}
            ></div>
          </div>
        </div>
        
        
        
          {isconnected==="connected"?hasallowance?<button
            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            onClick={async ()=>{
              await nftContract.mint(amount);
            }}
          >
            Mint
          </button>:
          <button
          className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
          onClick={async ()=>{
            const tokenContract = new Contract(currency.toString(), TokenABI, signer);
            await tokenContract.approve(nftaddress,new BigNumber(amount).multipliedBy(nftprice).toString());
          }}
        >
          Approve
        </button>
        :<ConnectWallet
        theme="dark"
        className=""
      ></ConnectWallet>}
        <br/>
        <div className="flex items-end justify-between">
            <span>
              <span className="text-2xl">
                
                Mint Price:
              </span>
            </span>
            <span>
              <span className="text-2xl">
                
              {parseInt(nftprice)/10**18}
              </span>
            </span>
            </div>
        <div className="flex items-end justify-between">
            <span>
              <span className="text-2xl">
                
                Max User Limit:
              </span>
            </span>
            <span>
              <span className="text-2xl">
                
              {maxuserlimit}
              </span>
            </span>
            </div>
          <div className="flex items-end justify-between">
            <span>
              <span className="text-2xl">
                
                Your Minted NFTs:
              </span>
            </span>
            <span>
              <span className="text-2xl">
                
              {balance}
              </span>
            </span>
            </div>
      </div>
      <br/>
      
    </div>
  );
};

export default NFTForm;
