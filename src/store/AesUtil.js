const AesUtil = function () {
    this.keySize = 128 / 32;
    this.iterationCount = 1000;
};

AesUtil.prototype.generateKey = function (salt, passPhrase) {
    var key = CryptoJS.PBKDF2(
        passPhrase,
        CryptoJS.enc.Hex.parse(salt),
        {
            keySize: this.keySize,
            iterations: this.iterationCount,
            hasher: CryptoJS.algo.SHA1
        });
    return key;
}

AesUtil.prototype.encrypt = function (passPhrase, plainText) {
    // Legacy fixed values
    var salt = "31323334353637383930313233343536"; // "1234567890123456" in hex
    var iv = "31323334353637383930313233343536";   // "1234567890123456" in hex

    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
        plainText,
        key,
        {
            iv: CryptoJS.enc.Hex.parse(iv)
        });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
}

export default AesUtil;
