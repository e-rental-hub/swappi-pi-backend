import StellarSdk from 'stellar-sdk';
import bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import readline from 'readline';

const server = new StellarSdk.Horizon.Server('https://api.mainnet.minepi.com');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createPiWalletFromMnemonic(mnemonic, passphrase = '') {
    const seed = await bip39.mnemonicToSeed(mnemonic, passphrase);
    const derivedKey = derivePath("m/44'/314159'/0'", seed);
    const privateKeySeed = derivedKey.key; 
    const keypair = StellarSdk.Keypair.fromRawEd25519Seed(privateKeySeed);
    return {
        publicKey: keypair.publicKey(),
        secretKey: keypair.secret()
    };
}

async function transferPi(passphrase, recipient, amount) {
    try {
        const wallet = await createPiWalletFromMnemonic(passphrase);
        const keypair = StellarSdk.Keypair.fromSecret(wallet.secretKey);
        const account = await server.loadAccount(keypair.publicKey());

        const availableBalance = parseFloat(account.balances.find(b => b.asset_type === 'native').balance);
        console.log("Account Balance is: ", availableBalance);
        
        if (availableBalance < parseFloat(amount)) {
            console.error("Insufficient balance for transfer");
            return;
        }

        const start = Date.now();
        const tx = new StellarSdk.TransactionBuilder(account, { 
            fee: "100000", 
            networkPassphrase: "Pi Network" 
        })
        .addOperation(StellarSdk.Operation.payment({ 
            destination: recipient, 
            asset: StellarSdk.Asset.native(), 
            amount: amount.toString()
        }))
        .setTimeout(3600)
        .build();

        tx.sign(keypair);
        console.log("Transaction created in:", Date.now() - start, "ms");

        const sendStart = Date.now();
        const response = await server.submitTransaction(tx);
        console.log("Transaction sent in:", Date.now() - sendStart, "ms");
        console.log("Transaction successful:", response.hash);

    } catch (error) {
        console.error("Transaction failed:", error.response?.data || error.message);
    }
}

// Interactive interface
rl.question("Enter your passphrase: ", (passphrase) => {
    rl.question("Enter recipient wallet address: ", (recipient) => {
        rl.question("Enter amount to send: ", async (amount) => {
            try {
                await transferPi(passphrase, recipient, amount);
            } catch (error) {
                console.error("Error:", error.message);
            }
            rl.close();
        });
    });
});