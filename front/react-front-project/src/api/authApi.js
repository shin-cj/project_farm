import httpClient from './httpClient.js'

const authApi = {
  verifyPassword(email, passwordHash) {
    return httpClient.post('/auth/login', {
      email,
      passwordHash,
    })
  },
}

export default authApi
