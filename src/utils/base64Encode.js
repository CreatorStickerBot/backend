function base64Encode (str) {
  return Buffer.from(str).toString('base64url')
}

function base64EncodeObj (obj) {
  return base64Encode(JSON.stringify(obj))
}

function base64Decode (value) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function base64DecodeObj (value) {
  return JSON.parse(base64Decode(value))
}

module.exports = {
  base64Decode,
  base64Encode,
  base64EncodeObj,
  base64DecodeObj
}
