import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Allow auth routes without check
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }

  // Get session token from cookies
  const token = req.cookies.get('sb-token')?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL('/auth', req.url));
  }

  // Check user status for protected routes
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/game')) {
    try {
      const supabase = createClient();
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return NextResponse.redirect(new URL('/auth', req.url));
      }

      // Get user profile with trial/subscription status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.redirect(new URL('/auth', req.url));
      }

      // Check trial expiration
      if (profile.subscription_status === 'trial' && profile.trial_started_at) {
        const trialStart = new Date(profile.trial_started_at).getTime();
        const now = Date.now();
        const trialDuration = 60 * 60 * 1000; // 1 hour
        
        if (now - trialStart > trialDuration) {
          // Trial expired — block access
          return NextResponse.redirect(new URL('/trial-expired', req.url));
        }
      }

      // Block if subscription expired and not in trial
      if (profile.subscription_status === 'cancelled' || profile.subscription_status === 'past_due') {
        return NextResponse.redirect(new URL('/subscription-required', req.url));
      }

    } catch (err) {
      console.error('[NEON21 Middleware]', err);
      return NextResponse.redirect(new URL('/auth', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/game/:path*', '/auth/:path*']
};