import { useEffect, useState } from "react";
import "./App.css";
import contract from "./contracts/nftMint.json";
import { ethers } from "ethers";

const contractAddress = "0xcd15e2e21d65c59afd710cea69e1deb1982f4514";
const abi = contract.abi;

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
      setWalletAddress(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const nftContract = new ethers.Contract(contractAddress, abi, signer);

        alert("Initialize payment");
        let nftTxn = await nftContract.mintNFTs(1, {
          value: ethers.utils.parseEther("0.01"),
        });

        alert("Mining... please wait");
        await nftTxn.wait();

        alert(
          `Mined, see transaction: https://explorer.alt.technology//tx/${nftTxn.hash}?network=https%3A%2F%2Finfinity40314ab9-alt-producer-rpc.alt.technology&rpcUrl=https%3A%2F%2Finfinity40314ab9-alt-producer-rpc.alt.technology`
        );
      } else {
        alert("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <div>
        <button
          onClick={connectWalletHandler}
          className="cta-button connect-wallet-button"
        >
          Connect Wallet{" "}
        </button>{" "}
      </div>
    );
  };

  const mintNftButton = () => {
    return (
      <div>
        <h3 className="text-style"> Wallet Address: {walletAddress} </h3>{" "}
        <button onClick={mintNftHandler} className="cta-button mint-nft-button">
          Mint NFT{" "}
        </button>{" "}
      </div>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);
  return (
    <div className="main-app">
      <h1 className="text-color"> MintLayer Minting DApp </h1>{" "}
      <div> {currentAccount ? mintNftButton() : connectWalletButton()} </div>{" "}
    </div>
  );
}

export default App;
