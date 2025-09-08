import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.5.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new Response(err.message, { status: 400 });
  }

  try {
    const session = event.data.object as Stripe.Subscription;
    const customerId = session.customer as string;

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        await supabaseAdmin
          .from('usuarios')
          .update({
            stripe_subscription_id: session.id,
            stripe_subscription_status: session.status,
            tipo_plano: session.status === 'active' ? 'premium' : 'gratuito',
          })
          .eq('stripe_customer_id', customerId);
        break;
      }
      case 'customer.subscription.deleted': {
        await supabaseAdmin
          .from('usuarios')
          .update({
            stripe_subscription_status: session.status,
            tipo_plano: 'gratuito',
          })
          .eq('stripe_customer_id', customerId);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return new Response(JSON.stringify({ error: 'Webhook handler failed' }), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
