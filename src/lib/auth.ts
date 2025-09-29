import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (existingUser) {
            // Update tokens if user exists
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                googleAccessToken: account.access_token,
                googleRefreshToken: account.refresh_token,
              },
            })
          } else {
            // Create new user
            await prisma.user.create({
              data: {
                email: user.email!,
                googleAccessToken: account.access_token,
                googleRefreshToken: account.refresh_token,
              },
            })
          }
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
    async session({ session, token }) {
      if (session.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: {
            id: true,
            email: true,
            googleAccessToken: true,
            hubspotAccessToken: true,
          },
        })
        
        if (user) {
          session.user.id = user.id
          session.user.googleConnected = !!user.googleAccessToken
          session.user.hubspotConnected = !!user.hubspotAccessToken
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
