import React from "react";
import { isWallectConnected, connectWallet } from "../services/blockchain";
import { truncate, useGlobalState } from "../store/index";

function Header() {
  const [connectedAccount] = useGlobalState("connectedAccount");
  const handleConnectWallet = () => {
    connectWallet();
  };
  return (
    <header
      className="flex justify-between items-center
        p-5 bg-white shadow-lg fixed top-0 left-0 right-0"
    >
      <a
        href="#"
        className="flex justify-start items-center
      text-xl text-black space-x-1"
      >
        <h1 className="">Genesis</h1>
      </a>
      <div className="flex space-x-2 justify-center">
        {connectedAccount ? (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
          >
            {truncate(connectedAccount, 4, 4, 11)}
          </button>
        ) : (
          <button
            type="button"
            className="inline-block px-6 py-2.5 bg-green-600
            text-white font-medium text-xs leading-tight uppercase
            rounded-full shadow-md hover:bg-green-700"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
