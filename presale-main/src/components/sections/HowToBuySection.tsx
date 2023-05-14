import { useState } from "react";
import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
import { BuyWIthCardModal } from "../BuyWithCardModal";

const HowToBuySection = () => {
  const [isBuyWithCardModalOpen, setIsBuyWithCardModalOpen] = useState(false);

  const steps = [
    {
      title: "Connect to wallet",
      description:
        "Connect with your preferable crypto wallet, we offer options: MetaMask, Wallet Connect with more than 170+ wallets available!",
    },
    {
      title: "Choose payable token & chain",
      description:
        "You can participate on Butane pre-sale from Ethereum and Binance Smart Chain by using tokens like: BNB, ETH, USDT, USDC, BUSD and more.",
    },
    {
      title: "Receive tokens",
      description:
        "Butane tokens are locked in the smart contract after the purchase, tokens will be released at 2023 Q3-Q4.",
    },
  ];
  return (
    <section id="how-to-buy" className="py-12 lg:py-24">
      <div className="container flex flex-col items-center gap-8 px-4 lg:flex-row lg:gap-16 lg:px-0">
        <FadeLeft className="flex w-full flex-col gap-6 lg:w-1/2">
          {steps.map((step, index) => (
            <div
              key={index}
              className="gradient-border flex w-full flex-col items-center gap-6 rounded-2xl bg-[#1A2025]/70 p-8 backdrop-blur-xl transition-all duration-200 hover:scale-105 lg:flex-row"
            >
              <div className="gradient-border flex h-16 w-16 items-center justify-center text-3xl font-bold before:rounded-full lg:h-20 lg:w-20">
                {index + 1}.
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h4 className="text-gradient mb-4 text-xl font-medium">
                  {step.title}
                </h4>
                <p className="text-white/80">{step.description}</p>
              </div>
            </div>
          ))}
        </FadeLeft>
        <FadeRight className="w-full lg:w-1/2">
          <h2 className="text-gradient mb-4 text-center text-5xl leading-normal lg:text-left">
            How to buy
          </h2>
          <div className="mb-4 flex flex-col gap-4 text-center font-normal leading-relaxed text-white/80 lg:mb-8 lg:text-left lg:text-lg">
            <p>
              Refer a friend and you will receive a 10% USDT from their
              investment! In order to receive your bonus, your friend needs to
              purchase tokens worth of at least $10.
            </p>
            <p>
              Your bonus will be sent to you within 24 hours, to your crypto
              wallet that is related with your referral link.
            </p>
          </div>
          <button
            onClick={() => setIsBuyWithCardModalOpen(true)}
            className="mx-auto flex items-center gap-3 rounded-full bg-primary py-4 px-6 font-semibold text-black transition-opacity duration-200 hover:opacity-75 lg:mx-0"
          >
            Buy with Card
          </button>
        </FadeRight>
      </div>
      {isBuyWithCardModalOpen && (
        <BuyWIthCardModal closeModal={() => setIsBuyWithCardModalOpen(false)} />
      )}
    </section>
  );
};

export default HowToBuySection;
