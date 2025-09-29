import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request) {
  const token = request.cookies.get('session')?.value

  if (!token) {

    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {

    await jwtVerify(token, secret)
    return NextResponse.next()

  } catch (error) {   
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'], 
}
