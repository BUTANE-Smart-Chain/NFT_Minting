import { ReactComponent as ArrowTrunDown } from "../assets/svg/arrow-turn-down.svg";
// import logo
import { ReactComponent as Logo } from "../assets/svg/eth.svg";
import { ReactComponent as TwitterIcon } from "../assets/svg/twitter.svg";
import { ReactComponent as TelegramIcon } from "../assets/svg/telegram.svg";
import { ReactComponent as MediumIcon } from "../assets/svg/medium.svg";
const footerLinks = [
  {
    title: "General",
    links: [
      {
        name: "Official Links",
        href: "https://docs.butane.tech/",
      },
      {
        name: "Whitepaper",
        href: "https://docs.butane.tech/",
      },
    ],
  },
  {
    title: "Social Links",
    links: [
      { name: "Telegram Channel (EN)", href: "https://t.me/butanenews" },
      { name: "Telegram Group (EN)", href: "https://t.me/butanechain" },
      { name: "Twitter", href: "https://twitter.com/Butane_Network" },
      { name: "Medium", href: "https://medium.com/@butanegas101" },
    ],
  },
  {
    title: "Useful Links",
    links: [
      { name: "For Tipsters", href: "https://github.com/BUTANE-Smart-Chain" },
      { name: "For Buyers", href: "https://fireflys.art/" },
    ],
  },
];

const socialLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/Butane_Network",
    icon: <TwitterIcon className="h-6 w-6" />,
  },
  {
    name: "Telegram",
    href: "https://t.me/butanechain",
    icon: <TelegramIcon className="h-6 w-6" />,
  },
  {
    name: "Medium",
    href: "https://medium.com/@butanegas101",
    icon: <MediumIcon className="h-6 w-6" />,
  },
];
const Footer = () => {
  return (
    <footer className="bg-[#14181C]/60 backdrop-blur-xl">
      <div className="h-px bg-gradient-to-r from-white/20 to-white/0" />
      <div className="container px-4 pt-12 lg:px-0 lg:pt-24">
       
        <div className="mb-6 grid grid-cols-1 gap-8 lg:mb-12 lg:grid-cols-3 lg:gap-32">
          <div className="order-last flex flex-col items-center gap-8 text-center lg:order-first lg:items-start lg:text-left">
          <img src="/butane.png" className="h-6 lg:h-16" />
            <p className="text-[#d8321a] lg:text-lg">
              GRAB YOUR NFT NOW AND HOLD YOUR SPOT IN THE BUTANE NETWORK
            </p>
            <div className="h-px w-full bg-white/10" />
            <div className="flex items-center gap-10 text-[#d8321a]">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  className="transition-all duration-300 hover:text-white"
                  title={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          <div className="col-span-1 grid grid-cols-1 gap-8 text-center lg:col-span-2 lg:grid-cols-3 lg:text-left">
            {footerLinks.map((link, index) => (
              <div key={index}>
                <h6 className="mb-4 text-xl lg:text-2xl">{link.title}</h6>
                <ul className="flex flex-col gap-4">
                  {link.links.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        target="_blank"
                        className="text-sm text-white transition-all duration-300 hover:opacity-75 lg:text-base"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex flex-wrap items-center justify-center gap-4 py-6 lg:justify-between">
          <span className="text-white/50">
            Copyright ©2023 Butane. All Rights Reserved.
          </span>
          {/* <div className="flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="transition-all duration-300 hover:opacity-75"
            >
              Privacy Policy
            </a>
            <svg
              viewBox="0 0 7 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-2 w-2 fill-primary"
            >
              <circle cx="3.5" cy="3.5" r="3.5" />
            </svg>

            <a
              href="#"
              className="transition-all duration-300 hover:opacity-75"
            >
              Terms & Conditions
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
