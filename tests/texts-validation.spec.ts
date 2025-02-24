import { test, expect } from '@playwright/test';

test.describe('QA Practice Form Validation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://qa-practice.netlify.app/bugs-form');
  });

  test('page loading', async ({ page }) => {
    try {
      const title = await page.title();
      expect(title).toBe('QA Practice | Learn with RV');

      const form = page.locator('form');
      await expect(form).toBeVisible();

    } catch (error) {
      console.error('Error in page loading test:', error);
      // This to capture a screenshot of the current state of the page whenever a failure occurs in the test
      await page.screenshot({ path: 'page_loading_failure.png' });
      throw error;
    }
  });

  test('navigation to home page', async ({ page }) => {
    try {
      const homeLink = page.locator('text=Home');
      await homeLink.click();

      // Wait for the page to load completely (no network activity)
      await page.waitForLoadState('networkidle');

      const homeHeading = page.locator('h1');
      await expect(homeHeading).toHaveText('Welcome!');

    } catch (error) {
      console.error('Error navigating to home page:', error);
      await page.screenshot({ path: 'home_page_navigation_failure.png' });
      throw error;
    }
  });

  test('navigation to contact page', async ({ page }) => {
    try {
      const contactLink = page.locator('text=Contact');
      await contactLink.click();
  
      // Wait for the page to load completely (no network activity)
      await page.waitForLoadState('networkidle');
  
      const contactHeading = page.locator('h2');
      await expect(contactHeading).toHaveText('Contact us');
  
      const url = page.url();
      expect(url).toContain('/contact-us');

    } catch (error) {
      console.error('Error during navigation to the contact page:', error);
      await page.screenshot({ path: 'navigation_to_contact_failure.png' });
      throw error;
    }
  });

  test('challenge header and help text', async ({ page }) => {
    try {
      const challengeHeader = page.locator('h2');
      await expect(challengeHeader).toHaveText('CHALLENGE - Spot the BUGS!');
  
      const challengeHelpText = page.locator('small#challengeHelp');
      await expect(challengeHelpText).toHaveText('This page contains at least 15 bugs. How many of them can you spot?');

    } catch (error) {
      console.error('Error during challenge header and help text validation:', error);
      await page.screenshot({ path: 'challenge_header_help_text_failure.png' });
      throw error;
    }
  });

  test('first name field', async ({ page }) => {
    try {
      // Ensure the label for the "First Name" field contains the required asterisk (*), indicating that this field is mandatory
      const firstNameLabel = page.locator('label[for="firstName"]');
      await expect(firstNameLabel).toHaveText("First Name*"); // Bug 1

      const firstNameInput = page.locator('input#firstName');
      await expect(firstNameInput).toHaveAttribute('placeholder', 'Enter first name');

      // Ensure the mandatory note is visible inside the "First Name" form group, as it is the first required field
      const formGroupDiv = page.locator('div.form-group');
      const firstNameFormGroup = formGroupDiv.locator('label[for="firstName"]');
      const mandatoryNoteInsideFormGroup = firstNameFormGroup.locator('small#lnHelp');
      await expect(mandatoryNoteInsideFormGroup).toBeVisible(); // Bug 2

    } catch (error) {
      console.error('Error in first name field test:', error);
      await page.screenshot({ path: 'first_name_field_failure.png' });
      throw error;
    }
  });

  test('last name field', async ({ page }) => {
    try {
      const lastNameLabel = page.locator('label[for="lastName"]');
      await expect(lastNameLabel).toHaveText("Last Name*"); // Bug 3 - multiple label

      const lastNameInput = page.locator('input#lastName');
      await expect(lastNameInput).toHaveAttribute('placeholder', 'Enter last name');

    } catch (error) {
      console.error('Error in last name field test:', error);
      await page.screenshot({ path: 'last_name_field_failure.png' });
      throw error;
    }
  });

  test('phone number field', async ({ page }) => {
    try {
      const phoneLabel = page.locator('label[for="phone"]'); // Bug 4 - label should be phone instead of lastName
      await expect(phoneLabel).toHaveText('Phone Number*'); // Bug 5 - Phone Number spelling

      const phoneInput = page.locator('input#phone');
      await expect(phoneInput).toHaveAttribute('placeholder', 'Enter phone number');

      const phoneHelpNote = page.locator('small#phoneHelp');
      await expect(phoneHelpNote).toHaveText('Phone length validation: at least 10 digits'); // Assuming it is the approved message

    } catch (error) {
      console.error('Error in phone number field test:', error);
      await page.screenshot({ path: 'phone_number_field_failure.png' });
      throw error;
    }
  });

  test('country field', async ({ page }) => {
    try {
      // Ensure the label for the "Country" field contains the required asterisk (*), indicating that this field is mandatory
      const countryLabel = page.locator('label[for="countries_dropdown_menu"]');
      await expect(countryLabel).toHaveText('Country*'); // Bug 6

      const countryDropdown = page.locator('#countries_dropdown_menu');
      await expect(countryDropdown).toBeVisible();

      // Assuming that the first option is "Select a country..." so it should act as the placeholder
      const firstOption = countryDropdown.locator('option:first-child');
      await expect(firstOption).toHaveText('Select a country...');

    } catch (error) {
      console.error('Error in country field test:', error);
      await page.screenshot({ path: 'country_field_failure.png' });
      throw error;
    }
  });

  test('email address field', async ({ page }) => {
    try {
      const emailLabel = page.locator('label[for="exampleInputEmail1"]');
      await expect(emailLabel).toHaveText('Email Address*'); // Bug 7 - Email Address proper capitalization

      const emailInput = page.locator('#emailAddress');
      await expect(emailInput).toHaveAttribute('placeholder', 'Enter email');

    } catch (error) {
      console.error('Error in email field test:', error);
      await page.screenshot({ path: 'email_field_failure.png' });
      throw error;
    }
  });

  test('password field', async ({ page }) => {
    try {
      const passwordLabel = page.locator('label[for="exampleInputPassword1"]');
      await expect(passwordLabel).toHaveText('Password*');

      const passwordInput = page.locator('#password');
      await expect(passwordInput).toHaveAttribute('placeholder', 'Password');

      const passwordHelpNote = page.locator('small#pwHelp');
      await expect(passwordHelpNote).toHaveText('Psw length validation: [6,20] characters');

    } catch (error) {
      console.error('Error in password field test:', error);
      await page.screenshot({ path: 'password_field_failure.png' });
      throw error;
    }
  });

  test('terms and conditions field', async ({ page }) => {
    try {
      const termsCheckbox = page.locator('#exampleCheck1');
      await expect(termsCheckbox).toBeDisabled();

      // Missing step where the user needs to read the T&C in order to enable the checkbox
      // await page.locator('#termsModal').click();

      // Once read and clicked:
      await expect(termsCheckbox).toBeEnabled(); // Bug 8

      const termsLabel = page.locator('label[for="exampleCheck1"]');
      await expect(termsLabel).toHaveText('I agree with the terms and conditions');

    } catch (error) {
      console.error('Error in terms and conditions field test:', error);
      await page.screenshot({ path: 'terms_conditions_field_failure.png' });
      throw error;
    }
  });

  test('register button', async ({ page }) => {
    try {
      const registerButton = page.locator('#registerBtn');
      await expect(registerButton).toHaveText('Register');

      // Assuming that the approved criteria is that the button should be disabled if the required fields are not yet populated
      await expect(registerButton).toBeDisabled(); // Bug 9

      const buttonType = await registerButton.getAttribute('type');
      expect(buttonType).toBe('submit');
      
    } catch (error) {
      console.error('Error in register button test:', error);
      await page.screenshot({ path: 'register_button_failure.png' });
      throw error;
    }
  });

});
