import sodiumLib from "../utility/sodiumLib";
import webpush from "web-push";

const generateKeysJWT = async () => {
  const sodium = await sodiumLib.init();
  const keyPair = sodium.crypto_sign_keypair();
  return {
    publicKey: sodium.to_base64(keyPair.publicKey, sodium.base64_variants.URLSAFE_NO_PADDING),
    privateKey: sodium.to_base64(keyPair.privateKey, sodium.base64_variants.URLSAFE_NO_PADDING)
  }
}

const generateKeysAuth = async () => {
  const sodium = await sodiumLib.init();
  const keyPair = sodium.crypto_box_keypair();
  return {
    publicKey: sodium.to_base64(keyPair.publicKey, sodium.base64_variants.URLSAFE_NO_PADDING),
    privateKey: sodium.to_base64(keyPair.privateKey, sodium.base64_variants.URLSAFE_NO_PADDING)
  }
}

const generateKeysVAPID = async () => {
  return webpush.generateVAPIDKeys();
}

(async() => {
  const keysJWT = await generateKeysJWT();
  const keysAuth = await generateKeysAuth();
  const keysVAPID = await generateKeysVAPID();
  console.log(`JWT_PUB: ${keysJWT.publicKey}`);
  console.log(`JWT_PRV: ${keysJWT.privateKey}`);
  console.log(`AUTH_PUB: ${keysAuth.publicKey}`);
  console.log(`AUTH_PRV: ${keysAuth.privateKey}`);
  console.log(`VAPID_PUB: ${keysVAPID.publicKey}`);
  console.log(`VAPID_PRV: ${keysVAPID.privateKey}`);
})();