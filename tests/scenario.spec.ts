import { test, expect } from '@playwright/test';

test.describe('Test Scenarios', () => {
  // Common setup before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-practice.netlify.app/bugs-form');
  });

  test('fill out the form correctly and submit', async ({ page }) => {
    try {
      const firstNameInput = page.locator('input#firstName');
      await firstNameInput.fill('Juan', { timeout: 1000 });
  
      const lastNameInput = page.locator('input#lastName');
      await lastNameInput.fill('Dela Cruz', { timeout: 1000 });
  
      const phoneInput = page.locator('input#phone');
      await phoneInput.fill('1234567890', { timeout: 1000 });
  
      const countryDropdown = page.locator('#countries_dropdown_menu');
      await countryDropdown.selectOption({ label: 'Philippines' }, { timeout: 1000 });
  
      const emailInput = page.locator('#emailAddress');
      await emailInput.fill('john.doe@example.com', { timeout: 1000 });
  
      const passwordInput = page.locator('#password');
      await passwordInput.fill('SecurePassword123', { timeout: 1000 });
      
      const termsCheckbox = page.locator('#exampleCheck1');
      await termsCheckbox.check({ timeout: 1000 }); // Bug 10 - disabled checkbox
  
      const registerButton = page.locator('#registerBtn');
      await registerButton.click();
  
      // Assuming that all fields are working properly
      const successMessage = page.locator('.success-message');
      await expect(successMessage).toBeVisible();
  
    } catch (error) {
      console.error('Test failed due to an error:', error);
      await page.screenshot({ path: 'form_submission_failure.png' });
      throw error;
    }
  });

  test('should have the register button disabled when required fields are empty', async ({ page }) => {
    try {
      // Assuming that this is the approved criteria for the Register button
      const registerButton = page.locator('#registerBtn');
      await expect(registerButton).toBeDisabled();
  
    } catch (error) {
      console.log('Error while checking the Register button state:', error);
      await page.screenshot({ path: 'register_button_disabled_error.png' });
      throw error;
    }
  });

  test('should show error for phone number when it has less than 10 digits', async ({ page }) => {
    try {
      await page.fill('input#firstName', 'Juan');
      await page.fill('input#lastName', 'Dela Cruz');
      await page.fill('input#phone', '123456789'); // Inputted less than 10 digits
      await page.selectOption('#countries_dropdown_menu', { label: 'Philippines' });
      await page.fill('#emailAddress', 'test@example.com');
      await page.fill('#password', 'password123');
      
      // Skipping terms and conditions field
  
      const registerButton = page.locator('#registerBtn');
      await registerButton.click();
  
      const phoneError = page.locator('#message'); // The error message is inside the div with id "message"
      await expect(phoneError).toHaveText('The phone number should contain at least 10 characters!');
  
    } catch (error) {
      console.log('Error occurred during the form submission or validation check:', error);
      await page.screenshot({ path: 'phone_number_error.png' });
      throw error;
    }
  });

  test('should show error for password when it is less than 6 or more than 20 characters', async ({ page }) => {    
    try {
      await page.fill('input#firstName', 'Juan');
      await page.fill('input#lastName', 'Dela Cruz');
      await page.fill('input#phone', '123456789');
      await page.selectOption('#countries_dropdown_menu', { label: 'Philippines' });
      await page.fill('#emailAddress', 'test@example.com');
      await page.fill('#password', 'short'); // Password is less than 6 characters
      
      // Skipping terms and conditions field
  
      const registerButton = page.locator('#registerBtn');
      await registerButton.click();
      
      const passwordError = page.locator('#message'); // The error message is inside the div with id "message"
      await expect(passwordError).toHaveText('The password should contain between [6,20] characters!');
  
    } catch (error) {
      console.log('Error occurred during form submission or validation check:', error);
      await page.screenshot({ path: 'password_error.png' });
      throw error;
    }
  
  });
  
});
