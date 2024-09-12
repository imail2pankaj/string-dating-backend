
const generateOtp = () => {
  return Math.floor(Math.random() * 1000000);
}

const generateUsername = (name) => {
  return name.replaceAll(" ", "") + Math.floor(Math.random() * 100);
}

module.exports = {
  generateOtp,
  generateUsername
}