// import icons

import { ReactComponent as WalletIcon } from "../assets/svg/wallet.svg";
import { ReactComponent as BNBIcon } from "../assets/svg/bnb.svg";
import { ReactComponent as DownArrowIcon } from "../assets/svg/down-arrow.svg";
import { ConnectWallet, useConnectionStatus } from "@thirdweb-dev/react";
import config from "../config";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount, useNetwork } from "wagmi";



const Navbar = () => {
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  return (
    <div className="container px-4 lg:px-0">
      <div className="flex items-center justify-between py-6">
        
        <img src="/butane.png" className="h-6 lg:h-16" />
        <div className="flex items-center gap-20">
          <nav className="hidden lg:block">
            <ul className="flex gap-14">
              
              <li>
                <a
                  href="https://medium.com/@butanegas101"
                  className="animate-pulse text-lg font-medium text-primary transition-opacity duration-200 hover:opacity-75"
                  target="_blank"
                >
                  $5K Giveaway
                </a>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={() => open({ route: "SelectNetwork" })}
              className="hidden items-center gap-2 rounded-full border border-red/10 bg-transparent py-4 px-4 font-semibold lg:flex"
            >
              <BNBIcon className="h-6 w-6" />
              <span>{chain?.name || config.chains[0].name}</span>
              <DownArrowIcon className="h-3 w-3" />
            </button>
            <WalletIcon className="h-8 w-8 lg:hidden" />
          
            <ConnectWallet
          theme="dark"
          className=""
          
        ></ConnectWallet>
          </div>
        </div>
      </div>
      <div className="h-px bg-gradient-to-r from-white/0 to-white/20" />
    </div>
  );
};

export default Navbar;
