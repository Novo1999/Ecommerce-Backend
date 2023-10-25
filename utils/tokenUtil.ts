import jwt from 'jsonwebtoken'

export const createJwt = (payload: { userId: string; email: string }) => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_TIMEOUT,
  })
}

export const verifyJwt = (token: string) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET!)
  return decoded
}
