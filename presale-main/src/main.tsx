import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import App from "./App";
import "./index.css";
import { wagmiClient } from "./utils/wagmi";

import { Provider } from "react-redux";
import { store } from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThirdwebProvider } from "@thirdweb-dev/react";
const activeChain = "ethereum";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    
    <WagmiConfig client={wagmiClient}>
    <ThirdwebProvider activeChain={activeChain}>
      <App />
      </ThirdwebProvider>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </WagmiConfig>
  </Provider>
);
