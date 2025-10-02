# PostHog Integration Test Guide

## 🧪 **Testing Steps:**

### 1. **Check App is Running**

- ✅ App should be running on http://localhost:3000
- ✅ You should see a blue "PostHog Test Panel" at the top of the homepage

### 2. **Open Browser Console**

- Press F12 or right-click → Inspect → Console
- Look for PostHog initialization messages

### 3. **Test PostHog Integration**

1. **Click "Check Status"** button in the test panel
2. **Look in console** for:
   ```
   🔍 PostHog Status Check:
   - PostHog loaded: true
   - PostHog instance: [object]
   - PostHog key configured: true
   - PostHog host: https://app.posthog.com
   ```

### 4. **Test Events**

1. **Click "Test Basic Event"** - should see: `✅ Test event sent to PostHog`
2. **Click "Test Analytics Service"** - should see: `✅ Analytics Service events sent`
3. **Click "Test User ID"** - should see: `✅ User identified in PostHog`

### 5. **Check PostHog Dashboard**

1. Go to https://app.posthog.com
2. Login to your account
3. Select your TalentHub project
4. Look for:
   - **Live events** in the Events tab
   - **Session recordings** in the Recordings tab
   - **Live users** in the Live tab

## 🔍 **What to Look For:**

### ✅ **Success Indicators:**

- Console shows "PostHog loaded"
- Test buttons show success messages
- Events appear in PostHog dashboard
- Session recordings are being captured

### ❌ **Error Indicators:**

- Console shows PostHog errors
- "PostHog loaded: false" in status check
- No events in PostHog dashboard
- Network errors in browser dev tools

## 🚨 **Common Issues:**

1. **API Key Issues:**

   - Check if key is correctly set in .env.local
   - Verify key format starts with "phc\_"

2. **Network Issues:**

   - Check browser console for network errors
   - Ensure no ad blockers are blocking PostHog

3. **Environment Issues:**
   - Restart dev server after changing .env.local
   - Check if NODE_ENV is set to development

## 📊 **Expected Events in PostHog:**

After testing, you should see these events:

- `$pageview` - Page view events
- `Test Event` - Custom test event
- `Job Search` - From analytics service test
- `CV Download` - From analytics service test
- `Dark Mode Toggle` - From analytics service test

## 🎯 **Next Steps After Testing:**

1. **If working:** Remove test panel and start using real features
2. **If not working:** Check console errors and API key configuration
3. **Monitor dashboard:** Watch for real user events as you browse the app
