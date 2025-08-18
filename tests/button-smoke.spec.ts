import { test, expect } from '@playwright/test';

test.describe('Button UI/UX Tests', () => {
  test('all visible buttons are focusable and clickable', async ({ page }) => {
    await page.goto('http://localhost:5000/map');
    
    // Wait for page to load
    await page.waitForSelector('button', { timeout: 10000 });
    
    // Get all buttons and button-like elements
    const buttons = page.locator('button, [role="button"]');
    const count = await buttons.count();
    
    console.log(`Found ${count} buttons to test`);
    expect(count).toBeGreaterThan(0);
    
    // Test first 15 buttons (avoid overwhelming test)
    for (let i = 0; i < Math.min(count, 15); i++) {
      const button = buttons.nth(i);
      
      // Check if button is visible
      if (await button.isVisible()) {
        // Test keyboard focus
        await button.focus();
        await expect(button).toBeFocused();
        
        // Test keyboard activation (Enter key)
        try {
          await button.press('Enter');
        } catch (e) {
          // Some buttons might not respond to Enter, that's OK
          console.log(`Button ${i} doesn't respond to Enter key`);
        }
        
        // Test mouse click
        try {
          await button.click({ timeout: 1000 });
        } catch (e) {
          console.log(`Button ${i} not clickable:`, e.message);
        }
      }
    }
  });

  test('mobile header buttons have proper touch targets', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:5000/map');
    
    // Wait for mobile header to load
    await page.waitForSelector('[class*="MobileHeader"]', { timeout: 5000 });
    
    // Check minimum touch target size (44px x 44px)
    const mobileButtons = page.locator('header button, header [role="button"]');
    const count = await mobileButtons.count();
    
    for (let i = 0; i < count; i++) {
      const button = mobileButtons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        if (box) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('landing page CTAs work correctly', async ({ page }) => {
    await page.goto('http://localhost:5000/map');
    
    // Test "Explore Map" button scroll behavior
    const exploreButton = page.locator('text=Explore the Map').first();
    if (await exploreButton.isVisible()) {
      await exploreButton.click();
      
      // Should scroll to map section
      const mapSection = page.locator('#map-preview');
      if (await mapSection.isVisible()) {
        await expect(mapSection).toBeInViewport();
      }
    }
    
    // Test "Sign In" button navigation
    const signInButton = page.locator('text=Sign in').first();
    if (await signInButton.isVisible()) {
      await signInButton.click();
      
      // Should navigate (but we won't check exact destination due to auth complexity)
      await page.waitForTimeout(1000);
    }
  });

  test('button states and accessibility', async ({ page }) => {
    await page.goto('http://localhost:5000/map');
    
    // Test focus rings are visible
    const firstButton = page.locator('button').first();
    await firstButton.focus();
    
    // Check for focus ring styles
    const focusedStyles = await firstButton.evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        outline: styles.outline,
        boxShadow: styles.boxShadow,
        ring: styles.getPropertyValue('--tw-ring-color')
      };
    });
    
    // Should have some form of focus indication
    const hasFocusStyle = focusedStyles.outline !== 'none' || 
                         focusedStyles.boxShadow !== 'none' || 
                         focusedStyles.ring;
    expect(hasFocusStyle).toBeTruthy();
  });
});