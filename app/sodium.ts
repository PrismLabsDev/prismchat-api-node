import _sodium from 'libsodium-wrappers';

const init = async () => {
    await _sodium.ready;
    return _sodium;
}

export default {
  init
};