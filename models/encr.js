import crypto from 'crypto';
var    algorithm = 'aes-256-ctr',
    password = 'd6F3Esddascxxc2w244t5$%&^%@!*&feq';

function  encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
export {encrypt,decrypt};