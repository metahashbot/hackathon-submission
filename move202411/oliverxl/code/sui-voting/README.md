# SUI Blockchain Voting System

A secure and transparent voting system built on the SUI blockchain with encrypted vote storage using Walrus.

## Features

- Secure vote encryption using Walrus
- On-chain vote storage with SUI blockchain
- Transparent voting process
- Authorized-only vote decryption
- Time-bound elections
- Admin controls for election management

## Prerequisites

- SUI CLI
- Node.js and npm
- Rust (for Walrus integration)
- SUI Wallet

## Project Structure

```
sui-voting/
├── sources/         # Smart contracts
│   └── voting.move  # Main voting contract
├── tests/          # Test files
├── frontend/       # Web interface
└── Move.toml       # Package manifest
```

## Smart Contract Features

1. Election Creation
   - Set election parameters
   - Define voting period
   - Configure eligible voters

2. Vote Casting
   - Encrypted vote submission
   - Voter authentication
   - Double-voting prevention

3. Vote Tallying
   - Secure decryption process
   - Authorized counting
   - Result verification

## Security Features

- Vote encryption using Walrus
- On-chain vote verification
- Time-locked voting periods
- Admin-only vote tallying
- Transparent audit trail

## Getting Started

1. Install dependencies:
   ```bash
   sui client install
   ```

2. Build the project:
   ```bash
   sui move build
   ```

3. Deploy the contract:
   ```bash
   sui client publish --gas-budget 10000000
   ```

## Usage

1. Create an election:
   - Set election parameters
   - Define voting period
   - Deploy election contract

2. Cast votes:
   - Connect wallet
   - Submit encrypted vote
   - Verify transaction

3. Tally results:
   - Admin initiates counting
   - Decrypt votes
   - Publish results

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License
