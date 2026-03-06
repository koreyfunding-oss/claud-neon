import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-square-hmac-sha256') || '';
    const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || '';

    const hash = crypto
      .createHmac('sha256', signatureKey)
      .update(body)
      .digest('base64');

    if (hash !== signature) {
      console.warn('Invalid webhook signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    const event = JSON.parse(body);
    const eventType = event.type;

    console.log(`Processing webhook: ${eventType}`);

    switch (eventType) {
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data.object.subscription);
        break;
      case 'subscription.deleted':
        await handleSubscriptionDeleted(event.data.object.subscription);
        break;
      case 'payment.created':
        await handlePaymentCreated(event.data.object.payment);
        break;
      case 'payment.updated':
        await handlePaymentUpdated(event.data.object.payment);
        break;
      default:
        console.log(`Unhandled event: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('square_customer_id', subscription.customerId)
      .single();

    if (!profile) return;

    const status = subscription.status === 'ACTIVE' ? 'active' : 'inactive';

    await supabase
      .from('profiles')
      .update({
        subscription_status: status,
        subscription_renewed_at: new Date().toISOString(),
      })
      .eq('id', profile.id);

    console.log(`✓ Subscription updated: ${subscription.id}`);
  } catch (error) {
    console.error('Error updating subscription:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('square_customer_id', subscription.customerId)
      .single();

    if (!profile) return;

    await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        subscription_id: null,
      })
      .eq('id', profile.id);

    console.log(`✓ Subscription deleted: ${subscription.id}`);
  } catch (error) {
    console.error('Error deleting subscription:', error);
  }
}

async function handlePaymentCreated(payment: any) {
  try {
    const amount = payment.amount_money?.amount || 0;
    console.log(`✓ Payment created: ${amount}`);
  } catch (error) {
    console.error('Error processing payment:', error);
  }
}

async function handlePaymentUpdated(payment: any) {
  try {
    console.log(`✓ Payment updated: ${payment.id}`);
  } catch (error) {
    console.error('Error updating payment:', error);
  }
}
