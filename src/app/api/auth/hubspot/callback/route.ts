import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // This is the user email

  if (!code || !state) {
    return NextResponse.json({ error: 'Missing code or state' }, { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.HUBSPOT_CLIENT_ID!,
        client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
        redirect_uri: process.env.HUBSPOT_REDIRECT_URI!,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()

    // Update user with HubSpot tokens
    await prisma.user.update({
      where: { email: state },
      data: {
        hubspotAccessToken: tokenData.access_token,
        hubspotRefreshToken: tokenData.refresh_token,
      },
    })

    // Redirect to dashboard with success message
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?hubspot=connected`)
  } catch (error) {
    console.error('HubSpot OAuth error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/dashboard?hubspot=error`)
  }
}
