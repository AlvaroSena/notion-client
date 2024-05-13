import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

interface Payload {
  sub: string
}

export async function verifyToken(
  request: Request,
  reply: Response,
  next: NextFunction,
) {
  const authHeader = request.headers.authorization
  const secret = process.env.JWT_SECRET as string

  if (!authHeader) {
    return reply.status(401).json({ error: 'Token is missing!' })
  }

  const [, accessToken] = authHeader.split(' ')

  try {
    const { sub } = verify(accessToken, secret) as Payload

    request.sub = {
      id: sub,
    }

    return next()
  } catch {
    return reply.status(401).json({ error: 'Token is invalid' })
  }
}
