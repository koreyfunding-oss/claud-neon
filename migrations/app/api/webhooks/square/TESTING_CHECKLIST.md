# NEON21 Integration Testing Checklist

## ✅ Authentication Testing
- [ ] Signup creates new account
- [ ] Verification email sent
- [ ] Login works with correct credentials
- [ ] Session persists after reload
- [ ] Logout works

## ⏱️ Timer & Paywall Testing
- [ ] Timer starts at 1 hour
- [ ] Counts down every second
- [ ] Toast at 5 minutes: "⚠ 5 MINUTES REMAINING"
- [ ] Toast at 2 minutes: "🚨 2 MINUTES REMAINING"
- [ ] Toast at 0 minutes: "⏰ TRIAL EXPIRED"
- [ ] Paywall appears when trial expires
- [ ] Subscribe button clickable

## 💳 Square Payment Testing

### Test Card
- [ ] Payment form loads
- [ ] Can enter card details
- [ ] Form validates correctly
- [ ] Payment processes successfully
- [ ] Success message displays
- [ ] Paywall closes after payment

### Failed Payment Test
- [ ] Payment form loads
- [ ] Can enter card details
- [ ] Form validates correctly
- [ ] Payment processes successfully
- [ ] Success message displays
- [ ] Paywall closes after payment

### Failed Payment Test
- [ ] Shows error message
- [ ] Can retry payment

## 🗄️ Database Testing
- [ ] Supabase connection works
- [ ] Subscription columns exist:
  - [ ] subscription_id
  - [ ] square_customer_id
  - [ ] subscription_status
  - [ ] subscription_renewed_at

## 🔄 End-to-End Flow
1. [ ] Signup → Profile created
2. [ ] Trial starts → Timer counts down
3. [ ] 5 min warning → Toast appears
4. [ ] 2 min warning → Toast appears
5. [ ] Trial expires → Paywall shows
6. [ ] Payment → Square processes
7. [ ] After payment → Status = 'active'
8. [ ] Timer disabled → User accesses app

## 📱 Cross-Browser Testing
- [ ] Chrome (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Mac)
- [ ] Safari (iOS)
- [ ] Chrome (Android)

## 🚀 Vercel Deployment
- [ ] Push to GitHub
- [ ] Vercel auto-deploys
- [ ] All environment variables set
- [ ] Production URL works
- [ ] No console errors

## 🧪 Local Testing with Shortened Trial

Edit `.env.local`:
Then restore after testing.

## 📊 Square Webhook Testing
- [ ] Webhook endpoint registered
- [ ] Subscription events received
- [ ] Database updated on webhook
- [ ] No signature errors

## ✅ Final Verification
- [ ] All tests passing
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Ready for production

## 🎉 Launch Checklist
- [ ] All tests passing
- [ ] Database migration applied
- [ ] Vercel env vars configured
- [ ] Square webhook configured
- [ ] Support team ready
- [ ] Documentation complete
