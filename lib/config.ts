// Configuration file for environment variables with fallbacks

// Supabase configuration
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
}

// Site configuration
export const siteConfig = {
  name: "AlienShipper",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  description: "Discounted shipping rates for businesses and individuals with alien technology",
}

// Payment configuration
export const paymentConfig = {
  paypalClientId:
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ||
    "AfrfdVghHIKwV7YqZi5g0ELyvc0CC8G0gNQQvDwELZM_hKuilZZn6fxoL1OCNYO24mr93wgqccB6YQHS",
  paypalSecretKey:
    process.env.PAYPAL_SECRET_KEY || "EDzqXm_Q-QhWO6ZtPxTlmerzpiD54CajhqQ6f78QhFVh-ODINzlRCv9ycEEk8V4EhOcphoEIuG22r_y1",
}

// Shipping configuration
export const shippingConfig = {
  shippoApiKey: process.env.SHIPPO_API_KEY || "shippo_test_e601c79fdd6830297dbcf441f951bbc0dbfadb2b", // Using the provided test key as fallback
  easypostApiKey: process.env.EASYPOST_API_KEY || "",
}

// Feature flags
export const featureFlags = {
  enableSocialLogin: false,
  enableShippoIntegration: true,
  enableEasypostIntegration: false,
  enablePaypalPayments: true,
}
