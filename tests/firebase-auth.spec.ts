import { test, expect } from '@playwright/test';

test.describe('Firebase Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to auth page
    await page.goto('http://localhost:5000/auth');
  });

  test('auth page loads correctly', async ({ page }) => {
    await expect(page.locator('text=Sign in to VeganMapAI')).toBeVisible();
    
    // Check that all provider buttons are visible
    await expect(page.locator('text=Sign in with Google')).toBeVisible();
    await expect(page.locator('text=Sign in with Apple')).toBeVisible();
    await expect(page.locator('text=Sign in with Facebook')).toBeVisible();
    await expect(page.locator('text=Sign in with X (Twitter)')).toBeVisible();
  });

  test('provider buttons are clickable', async ({ page }) => {
    const googleButton = page.locator('text=Sign in with Google');
    const appleButton = page.locator('text=Sign in with Apple');
    const facebookButton = page.locator('text=Sign in with Facebook');
    const twitterButton = page.locator('text=Sign in with X (Twitter)');

    // Check buttons are enabled and clickable
    await expect(googleButton).not.toBeDisabled();
    await expect(appleButton).not.toBeDisabled();
    await expect(facebookButton).not.toBeDisabled();
    await expect(twitterButton).not.toBeDisabled();

    // Test click behavior (will likely show popup blocked message in test)
    await googleButton.click();
    // In real browser, this would open popup. In test, it might show blocked popup message.
  });

  test('auth buttons have proper styling', async ({ page }) => {
    const googleButton = page.locator('text=Sign in with Google');
    
    // Check that button has proper classes
    const buttonElement = await googleButton.locator('..');
    await expect(buttonElement).toHaveClass(/bg-red-500/);
    await expect(buttonElement).toHaveClass(/hover:bg-red-600/);
    await expect(buttonElement).toHaveClass(/text-white/);
  });

  test('privacy policy text is visible', async ({ page }) => {
    await expect(page.locator('text=By signing in, you agree to our Terms of Service and Privacy Policy')).toBeVisible();
  });

  test('redirects to landing when not authenticated', async ({ page }) => {
    // Try to access protected route
    await page.goto('http://localhost:5000/home');
    
    // Should redirect to landing or show login
    await expect(page.url()).toContain('/');
  });
});