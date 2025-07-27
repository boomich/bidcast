# Custom Clerk Authentication Setup

This project now includes beautiful, custom sign-in and sign-up pages built with Clerk and Tailwind CSS.

## Features

✨ **Modern Design**: Beautiful gradient backgrounds with animated decorative elements
🌙 **Dark Mode Support**: Fully responsive to light/dark theme preferences  
📱 **Mobile Responsive**: Optimized for all device sizes
🎨 **Custom Styling**: Tailored to match your brand with Tailwind CSS
🔄 **Smooth Animations**: Subtle motion effects for enhanced UX

## Setup Instructions

### 1. Clerk Dashboard Configuration

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Navigate to **Configure** → **Paths**
4. Set the following paths:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in URL: `/feed`
   - After sign-up URL: `/onboarding`

### 2. Environment Variables

Copy your Clerk keys from the dashboard and update `apps/web/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### 3. Social Providers (Optional)

To enable social login (Google, GitHub, etc.):

1. In Clerk Dashboard, go to **Configure** → **SSO Connections**
2. Enable your preferred providers
3. Configure OAuth credentials for each provider

## File Structure

```
apps/web/src/app/
├── sign-in/
│   ├── page.tsx          # Custom sign-in page
│   └── layout.tsx        # Sign-in layout with metadata
├── sign-up/
│   ├── page.tsx          # Custom sign-up page
│   └── layout.tsx        # Sign-up layout with metadata
└── middleware.ts         # Updated to include custom routes
```

## Customization

### Styling

The pages use Tailwind CSS classes and can be easily customized:

- **Colors**: Modify the gradient and color schemes in the component files
- **Animations**: Adjust the decorative element animations in `globals.css`
- **Layout**: Change the card size, spacing, and positioning

### Clerk Appearance

The `appearance` prop in both components allows deep customization of Clerk's UI elements:

```tsx
appearance={{
  elements: {
    formButtonPrimary: "bg-slate-900 hover:bg-slate-800",
    formFieldInput: "bg-white border border-slate-300",
    // ... more customizations
  },
}}
```

### Redirects

- **Sign-in redirect**: Currently set to `/feed`
- **Sign-up redirect**: Currently set to `/onboarding`
- Modify the `redirectUrl` prop in the components to change these

## Pages Included

### Sign-In Page (`/sign-in`)
- Email/password authentication
- Social provider buttons (if configured)
- Link to sign-up page
- Responsive design with gradient background

### Sign-Up Page (`/sign-up`)
- User registration form
- Email verification flow
- Terms of service and privacy policy links
- Link to sign-in page

## Integration

The custom pages are already integrated with:

- ✅ Middleware protection
- ✅ Existing hero and CTA components updated
- ✅ Proper routing and redirects
- ✅ Dark mode theming
- ✅ Mobile responsiveness

## Testing

To test the authentication flow:

1. Start the development server: `yarn dev`
2. Navigate to `/sign-up` to create a test account
3. Check email for verification (if enabled)
4. Navigate to `/sign-in` to test login
5. Verify redirects work correctly

## Troubleshooting

### Common Issues

1. **Environment variables not loaded**: Restart the dev server after updating `.env.local`
2. **Clerk keys not working**: Double-check keys from dashboard match your environment
3. **Redirects not working**: Verify paths in Clerk dashboard match your routes
4. **Styling issues**: Check Tailwind CSS is properly configured and building

### Support

For Clerk-specific issues, check:
- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Discord Community](https://discord.com/invite/b5rXHjAg7A)
- [Clerk GitHub Issues](https://github.com/clerkinc/clerk-react/issues)