import bcrypt from 'bcrypt'
import env from '../../env.ts'

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, env.BYCRYPT_ROUNDS)
}
