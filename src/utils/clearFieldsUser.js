function clearFieldsUser(user) {
  return {
    id: user._id,
    username: user.username,
    confirmed: user.confirmed
  }
}

module.exports = clearFieldsUser
