import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hubspotAuthUrl = new URL('https://app.hubspot.com/oauth/authorize')
  hubspotAuthUrl.searchParams.set('client_id', process.env.HUBSPOT_CLIENT_ID!)
  hubspotAuthUrl.searchParams.set('redirect_uri', process.env.HUBSPOT_REDIRECT_URI!)
  hubspotAuthUrl.searchParams.set('scope', 'contacts')
  hubspotAuthUrl.searchParams.set('state', session.user.email)

  return NextResponse.redirect(hubspotAuthUrl.toString())
}
