# Base Buddies

Base Buddies is a decentralized mini app built on the Base blockchain that empowers users to create, join, and complete community-driven challenges. The platform encourages collaboration, accountability, and fun by supporting multiple proof submission types for verifying challenge completion.

## Features

- **Create New Challenges:** Launch your own challenge with custom requirements, rewards, and proof types.
- **Browse Challenges:** Explore active and completed challenges from the community.
- **Edit & Delete Challenges:** Manage your created challenges with full control.
- **Complete Challenges:** Submit proof via image upload, text response, or link submission.
- **Track Progress:** View your stats, rewards earned, and community participation.
- **Web3 Integration:** Connect your wallet and interact with smart contracts on Base.

## Technologies Used

- **Frontend:** Next.js, Tailwind CSS, JavaScript
- **Smart Contracts:** Solidity
- **Web3 Integration:** [@coinbase/onchainkit/minikit](https://www.base.org/build/mini-apps)
- **Deployment:** Vercel

## Project Structure

*
    ├── README.md
    ├── app
    │   ├── api
    │   │   └── webhook
    │   │       └── route.js
    │   ├── challenge
    │   │   └── [id]
    │   │       └── page.js
    │   ├── create
    │   │   └── page.js
    │   ├── dashboard
    │   │   └── page.js
    │   ├── layout.js
    │   └── page.js
    ├── components
    │   ├── ChallengeCard.js
    │   ├── Layout.js
    │   ├── Navbar.js
    │   └── WalletConnect.js
    ├── lib
    │   ├── abi.json
    │   ├── contract.js
    │   └── useContract.js
    ├── next.config.js
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── providers
    │   └── MiniKitProvider.js
    ├── public
    │   ├── favicon.ico
    │   ├── icon-192.svg
    │   ├── icon-512.svg
    │   ├── icon.png
    │   ├── icon.svg
    │   └── og-image.png
    ├── styles
    │   └── globals.css
    └── tailwind.config.js


## Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Sandile88/base-buddies.git
   cd base-buddies
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env` and set your variables.

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

5. Open **http://localhost:3000** in your browser.

## Usage

- **Connect Wallet:** Use MetaMask or any Base-compatible wallet.
- **Create Challenge:** Fill out the form, set requirements, and submit.
- **Browse & Join:** View available challenges and participate.
- **Submit Proof:** Depending on challenge type, upload an image, enter text, or provide a link.
- **Track Progress:** Visit your dashboard to see stats and manage challenges.

## Configuration

- **Smart Contract Address:** Set `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env`.
- **Coinbase OnchainKit API Key:** Set `NEXT_PUBLIC_CDP_CLIENT_API_KEY` in `.env`.
- **Base Chain:** Uses Base Sepolia testnet by default (see `lib/contract.js`).
- **Other Options:** Customize metadata, and Farcaster settings in `.env`.

## Troubleshooting

- **Challenges Not Visible:** Ensuring my contract address is correct and deployed on Base as well as checking wallet connection and refresh the dashboard.
- **Transaction Issues:** Verifying I have test ETH on Base Sepolia and use the Coinbase faucet.
- **Web3 Errors:** Confirming my wallet is connected and on the correct network.
- **General Issues:** Checking the browser console for errors and reviewing smart contract logs.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Commit your changes.
4. Push to your branch and open a pull request.

All contributions, bug reports, and feature requests are welcome!

## License

This project is licensed under the MIT License. See [LICENSE](https://opensource.org/license/mit) for details.

For questions or support, open an issue or reach out to me via email!