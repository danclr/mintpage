'use client';

import { ConnectButton, MediaRenderer, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "./client";
import { defineChain, getContract, toEther } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { getContractMetadata } from "thirdweb/extensions/common";
import { claimTo, getActiveClaimCondition, getTotalClaimedSupply, nextTokenIdToMint } from "thirdweb/extensions/erc721";
import { useState } from "react";

export default function Home() {
  const account = useActiveAccount();

  // Replace the chain with the chain you want to connect to
  const chain = defineChain(2340);

  const [quantity, setQuantity] = useState(1);

  // Replace the address with the address of the deployed contract
  const contract = getContract({
    client: client,
    chain: chain,
    address: "0xE45757fc796E4F8BAcea3F3440F1056A31610770"
  });

  const { data: contractMetadata, isLoading: isContractMetadataLoading } = useReadContract(getContractMetadata,
    { contract: contract }
  );

  const { data: claimedSupply, isLoading: isClaimedSupplyLoading } = useReadContract(getTotalClaimedSupply,
    { contract: contract }
  );

  const { data: totalNFTSupply, isLoading: isTotalSupplyLoading } = useReadContract(nextTokenIdToMint,
    { contract: contract }
  );

  const { data: claimCondition } = useReadContract(getActiveClaimCondition,
    { contract: contract }
  );

  const getPrice = (quantity: number) => {
    const total = quantity * parseInt(claimCondition?.pricePerToken.toString() || "0");
    return toEther(BigInt(total));
  }

  return (
    <main className="p-4 pb-10 min-h-[100vh] flex main-container">
      <div className="flex flex-row items-center mb-6">
        <div className="text-left mr-8 mt-8">
          <p className="intro-text">Join the adventure by minting your first NFT for a discount!</p>
          <p className="info-text mt-5">
            Discover a unique collection of NFTs, By minting your first NFT, you&apos;ll be part of an exclusive community that values creativity and innovation.
            <br /><br />
            <span style={{ color: 'cyan' }}>Total supply: 2000</span>
            <br /><br />
            <span style={{ color: 'cyan', fontWeight: 'bold' }}>NFT Price: 5 $ATLA</span>
            <br /><br />
            10 max per wallet
          </p>
        </div>
        <div className="frame-container">
          <div className="image-container">
            <MediaRenderer
              client={client}
              src={contractMetadata?.image}
              className="rounded-xl"
            />
          </div>
          <div className="connect-wallet-container">
            <ConnectButton
              client={client}
              chain={chain}
              connectButton={{
                style: {
                  backgroundColor: '#09090b',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  width: '100%',
                  textAlign: 'center',
                }
              }}
            />
          </div>
          <div className="balance-mint-container">
            <div className="balance-text">
              {isClaimedSupplyLoading || isTotalSupplyLoading ? (
                <p>Loading...</p>
              ) : (
                <p className="text-lg font-bold">
                  {claimedSupply?.toString()}/{totalNFTSupply?.toString()}
                </p>
              )}
            </div>
            <div className="separator"></div>
            <div className="mint-text">
              <TransactionButton
                transaction={() => claimTo({
                  contract: contract,
                  to: account?.address || "",
                  quantity: BigInt(quantity),
                })}
                onTransactionConfirmed={async () => {
                  alert("NFT Claimed!");
                  setQuantity(1);
                }}
                unstyled
                style={{
                  color: 'white',
                  padding: '10px 10px',
                  borderRadius: '5px',
                  width: '120%',
                  height: '60%',
                  textAlign: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              >
                {`CLAIM`}
              </TransactionButton>
            </div>
          </div>
        </div>
      </div>
      <div className="py-20 text-center">
        <div className="flex flex-col items-center mt-4">
          <div className="flex flex-row items-center justify-center my-4">
            {/* Additional content here if needed */}
          </div>
        </div>
      </div>
    </main>
  );
}

function Header() {
  return null;
}
