import { useMemo } from "react";
import { ReactComponent as ArrowToRightIcon } from "../../assets/svg/arrow-to-right.svg";
import FadeLeft from "../animations/FadeLeft";
import FadeRight from "../animations/FadeRight";
import NFTSection from "./NFTSection";

const headerText = "Mint Your Future";
const paragraphText = "We invite you to be an early adopter in this paradigm shift, harnessing the raw potential of decentralized technology. Dive into our sale now to secure your own piece of the metaverse. Our collection of unique character NFTs, each crafted with exquisite detail and rich backstory, await your discovery. These aren't just assets; they're tickets to a new digital reality, giving you exclusive access to a vibrant, evolving universe unlike any other.";

const links = [
  {
    href: "https://fireflys.art/",
    className: "group flex items-center gap-1 rounded-full bg-primary py-4 px-6 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-75 lg:text-base",
    text: "NFT MarketPlace",
  },
  {
    href: "https://t.me/butanechain",
    className: "group flex items-center gap-1 rounded-full border-2 border-white/10 bg-dark py-4 px-6 text-sm font-semibold transition-opacity duration-200 hover:opacity-75 lg:text-base",
    text: "Telegram",
  },
];

const HeaderSection = () => {
  const renderLinks = useMemo(() => links.map((link) => (
    <a key={link.href} href={link.href} className={`${link.className} group-hover:bg-blue-500 hover:text-white`}>
      <span>{link.text}</span>
      <ArrowToRightIcon className="h-6 w-6 transition-all duration-300 group-hover:translate-x-2" />
    </a>
  )), []);

  return (
    <section className="py-12 lg:py-24">
      <div className="container flex flex-col items-center gap-16 px-4 lg:flex-row lg:gap-4 lg:px-0">
        <FadeLeft className="w-full lg:w-1/2">
          <h2 className="mb-6 text-center text-4xl leading-normal lg:text-left lg:text-6xl font-extrabold tracking-wide text-white">{headerText}</h2>
          <p className="mb-8 text-center font-normal leading-relaxed text-white/80 lg:text-left lg:text-xl tracking-wide">{paragraphText}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
            {renderLinks}
          </div>
        </FadeLeft>
        <FadeRight className="relative flex w-full justify-center lg:w-1/2">
          <NFTSection />
        </FadeRight>
      </div>
    </section>
  );
};

export default HeaderSection;