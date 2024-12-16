// This is a placeholder encryption implementation
// TODO: Replace with a proper encryption scheme suitable for your voting system

import { secretbox, randomBytes } from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

// Generate a random key for encryption (in a real application, this should be managed securely)
const key = new Uint8Array(secretbox.keyLength);
for (let i = 0; i < key.length; i++) key[i] = i & 0xff;

export const encrypt = async (vote: string): Promise<string> => {
    try {
        const messageUint8 = decodeUTF8(vote);
        const nonce = randomBytes(secretbox.nonceLength);
        const box = secretbox(messageUint8, nonce, key);

        const fullMessage = new Uint8Array(nonce.length + box.length);
        fullMessage.set(nonce);
        fullMessage.set(box, nonce.length);

        return encodeBase64(fullMessage);
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt vote');
    }
};

export const decrypt = async (encryptedVote: string): Promise<string> => {
    try {
        const messageWithNonceAsUint8Array = decodeBase64(encryptedVote);
        const nonce = messageWithNonceAsUint8Array.slice(0, secretbox.nonceLength);
        const box = messageWithNonceAsUint8Array.slice(secretbox.nonceLength);

        const decrypted = secretbox.open(box, nonce, key);
        if (!decrypted) {
            throw new Error('Failed to decrypt vote');
        }

        return encodeUTF8(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt vote');
    }
};
