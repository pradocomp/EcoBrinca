/*
          # [Stripe Integration]
          Adds Stripe customer and subscription details to the 'usuarios' table to manage Premium plans.

          ## Query Description: [This operation alters the 'usuarios' table to support Stripe integration. It adds columns to track customer IDs, subscription IDs, and subscription status. This change is non-destructive and essential for processing payments and managing user plans. No data will be lost.]
          
          ## Metadata:
          - Schema-Category: "Structural"
          - Impact-Level: "Low"
          - Requires-Backup: false
          - Reversible: true
          
          ## Structure Details:
          - Table 'usuarios':
            - ADD COLUMN stripe_customer_id TEXT UNIQUE
            - ADD COLUMN stripe_subscription_id TEXT UNIQUE
            - ADD COLUMN stripe_subscription_status TEXT
          
          ## Security Implications:
          - RLS Status: Enabled
          - Policy Changes: No
          - Auth Requirements: None for this migration.
          
          ## Performance Impact:
          - Indexes: Adds unique indexes on 'stripe_customer_id' and 'stripe_subscription_id'.
          - Triggers: None
          - Estimated Impact: Negligible performance impact on existing operations.
          */

ALTER TABLE public.usuarios
ADD COLUMN stripe_customer_id TEXT UNIQUE,
ADD COLUMN stripe_subscription_id TEXT UNIQUE,
ADD COLUMN stripe_subscription_status TEXT;

COMMENT ON COLUMN public.usuarios.stripe_customer_id IS 'Stores the Stripe Customer ID for the user.';
COMMENT ON COLUMN public.usuarios.stripe_subscription_id IS 'Stores the Stripe Subscription ID for the user''s active plan.';
COMMENT ON COLUMN public.usuarios.stripe_subscription_status IS 'Stores the current status of the user''s Stripe subscription (e.g., active, canceled).';
