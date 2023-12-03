import config from './src/utils/config';
import * as crypto from 'crypto';

const encryptionTransformerConfig = {
	// AES-256-CBC requires specifically a 256 bit/64 byte key
	// SHA256 generates a 256 bit/64 byte hash from a secret
	key: crypto.createHash('sha256').update(String(config.secret)).digest('hex'),
	algorithm: 'aes-256-cbc',
	ivLength: 16,
};

export default encryptionTransformerConfig;
