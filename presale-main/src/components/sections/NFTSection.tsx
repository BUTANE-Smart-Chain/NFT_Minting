import { toast } from "react-toastify";
import { ConnectWallet, useConnectionStatus,ChainId } from "@thirdweb-dev/react";
import {  Contract, ethers, Signer } from "ethers";
import NFTABI from "../../contracts/nft.json";
import TokenABI from "../../contracts/tokenABI.json";
import { useSigner,useActiveChain,useAddress } from "@thirdweb-dev/react";
import {BigNumber} from 'bignumber.js'
import config from "../../config";
import { useEffect, useRef, useState } from "react";

const NFTSection = () => {
  const signer = useSigner();
  const address=useAddress();
  const isconnected=useConnectionStatus();
  const chainId = useActiveChain();
//console.log(isconnected,chainId?.networkId)
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
// "0x7EA134Ad03d683eA9bd2bA6A1C87edb525d8AcC4"
const nftaddress="0x7EA134Ad03d683eA9bd2bA6A1C87edb525d8AcC4";
const nftContract = new Contract(nftaddress, NFTABI, signer);
const [updatecounter, setUpdatecounter] = useState(0);
async function loadAllowance()
{
  
  const tokenContract = new Contract(currency.toString(), TokenABI, signer);
  const allowance=await tokenContract.allowance(address,nftaddress);
  
if(new BigNumber(allowance.toString()).gte(new BigNumber(nftprice).multipliedBy(amount)))
setHasAllowance(true);
else
setHasAllowance(false)
}
loadAllowance();
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
},[isconnected,address,updatecounter])
useEffect(()=>{
  loadAllowance()
},[isconnected,address,amount,updatecounter])
setInterval(() => {setUpdatecounter(updatecounter+1)}, 10000);
  return (
    <section className="py-12 lg:py-24"> 
      <div className="container align-center items-center gap-16 px-4  ">
       
      <div className="md:max-w-3xl w-full bg-transparent filter backdrop-blur-sm py-4 rounded-md px-2 md:px-10 flex flex-col items-center m-auto">
      <h1 className="font-coiny uppercase font-bold text-5xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-red-500 to-red-500 leading-none tracking-tighter mb-4 mt-3 shadow-lg">Mint NFT</h1>
    <h3 className="text-sm text-pink-200 tracking-widest"></h3>
    <div className="flex flex-col md:flex-row md:space-x-14 w-full mt-10 md:mt-14">
      <div className="relative w-full"><div className="font-coiny z-10 absolute top-2 left-2 opacity-80 filter backdrop-blur-lg text-base px-3 py-1 bg-black border border-brand-purple rounded-md flex items-center justify-center text-white font-semibold">
        <p><span className="text-brand-pink">{totalsupply}</span> / {maxsupply}</p>
        </div>
        <img alt="nft-Img" src="/nft.png" className="object-cover mint-img w-full sm:h-[280px] md:w-[250px] rounded-md "/>
        </div>
        <div className="flex flex-col items-center w-full px-4 mt-16 md:mt-0">
          <div className="font-coiny flex items-center justify-between w-full">
          <button onClick={()=>{if(amount>1)setAmount(amount-1)}} className="btn w-7 h-7 m-auto rounded-full bg-primary text-lg font-semibold text-secondary">
  -
</button>
                <p className="flex items-center justify-center flex-1 grow text-center font-bold text-brand-pink text-3xl md:text-4xl">{amount.toString()}</p>
               

<button onClick={()=>{if((amount+parseInt(balance))<parseInt(maxuserlimit))setAmount(amount+1)}} className="btn w-7 h-7 rounded-full m-auto bg-primary text-lg font-semibold text-secondary">
  +
</button>
                    </div><p className="text-sm text-pink-200 tracking-widest mt-3">Max Mint Amount:  {maxuserlimit}</p>
                    <div className="border-t border-b py-4 mt-6 w-full">
                      <div className="w-full text-xl font-coiny flex items-center justify-between mb-2">
                        <p className="text-brand-yellow">Available Supply</p><div className="flex items-center space-x-3">
                          <p className="text-white">{totalsupply} /{maxsupply}</p>
                          </div>
                          </div>
                          <div className="w-full text-xl font-coiny flex items-center justify-between mb-2">
                            <p className="text-brand-yellow">Wallet Balance</p>
                            <div className="flex items-center space-x-3">
                              <p className="text-white">{balance}</p>
                              </div>
                              </div>
                              <div className="w-full text-xl font-coiny flex items-center justify-between">
                                <p className="text-brand-yellow">Total Price</p>
                                <div className="flex items-center space-x-3">
                                  <p className="text-white">{parseInt(new BigNumber(amount).multipliedBy(nftprice).toString())/10**18} BUSD</p>&nbsp;<span className="text-gray-400"> + GAS</span>
                                  </div>
                                  </div>
                                  </div>
                                  <br/>
                                  {isconnected==="connected"?hasallowance?<button
            className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
            onClick={()=>{
              nftContract.mint(amount);
              setUpdatecounter(updatecounter+1);
            }}
          >
            Mint
          </button>:
          <button
          className="relative flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 px-6 text-lg font-semibold text-secondary transition-opacity duration-200 hover:opacity-75 disabled:cursor-not-allowed disabled:opacity-80 lg:text-xl"
          onClick={()=>{
            const tokenContract = new Contract(currency.toString(), TokenABI, signer);
            tokenContract.approve(nftaddress,new BigNumber(amount).multipliedBy(nftprice).toString());
            setUpdatecounter(updatecounter+1);
          }}
        >
          Approve
        </button>
        :<ConnectWallet
        theme="dark"
        className=""
      ></ConnectWallet>}
                                  </div>
                                  </div>
                                  <div className="border-t border-gray-800 flex flex-col items-center mt-10 py-2 w-full">
                                    <h3 className="font-coiny text-2xl text-brand-pink uppercase mt-6">Contract Address</h3>
                                    <a href={"https://bscscan.com/address/".concat(nftaddress)} target="_blank" rel="noopener noreferrer" className="text-gray-400 mt-4">
                                      <span className="break-all ...">{nftaddress}</span></a>
                                      </div>
                                      </div>
        
      </div>
    </section>
  );
};

export default NFTSection;
