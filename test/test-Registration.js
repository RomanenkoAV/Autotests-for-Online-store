const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const generateLogin = require("../GenerateLogin.js");
// данные для регистрации пользователя и авторизации
const testNewName = generateLogin(); // генерация нового логина
const testNewEmail = testNewName + "@test.ru";
const testPassword = "123456";
const actualLogin = "autotest1";
const actualPassword = "123456";
const wrongEmail = "@Test.ru";
const wrongPassword = "123";
//все локаторы для тестов
const loginButtonLocator = By.css(".account");
const registerButtonLocator = By.css(".custom-register-button");
const fieldNameRegisterLocator = By.id("reg_username");
const fieldEmailRegisterLocator = By.id("reg_email");
const fieldPasswordRegisterLocator = By.id("reg_password");
const registerSubmitButtonLocator = By.css(
  ".woocommerce-form-register__submit"
);
const registerMessageLocator = By.css(".content-page > div");
const userNameLocator = By.css(".woocommerce-MyAccount-content strong");
const fieldLoginNameLocator = By.id("username");
const fieldLoginPasswordLocator = By.id("password");
const buttonLoginSubmitLocator = By.css(".woocommerce-form-login__submit");
const errorLoginMessage = By.css(".woocommerce-error > li");
const logoutButtonLocator = By.css(".logout");
const forgotPasswordMessageLinkLocator = By.css(".woocommerce-error > li a");
const forgotPasswordButtonLocator = By.css(".lost_password a");
const forgotPasswordFieldLocator = By.id("user_login");
const forgotPasswordSubmitButton = By.css(".button");
const forgotPasswordMessageAlertLocator = By.xpath("//*[@role = 'alert']");
const registerErrorMessageLocator = By.xpath("//*[@role = 'alert'] // li");

describe("Test  Registration and Authorization", async function () {
  beforeEach(async function () {
    await driver.get("http://intershop5.skillbox.ru/");
  });
  it("Should register a new user and verify the user name and registration message", async function () {
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(registerButtonLocator).click();
    await driver.findElement(fieldNameRegisterLocator).sendKeys(testNewName);
    await driver.findElement(fieldEmailRegisterLocator).sendKeys(testNewEmail);
    await driver
      .findElement(fieldPasswordRegisterLocator)
      .sendKeys(testPassword);
    await driver.findElement(registerSubmitButtonLocator).click();

    expect(await driver.findElement(registerMessageLocator).isDisplayed()).to.be
      .true; // проверка появления сообщения об успешной регистрации
    await driver.findElement(logoutButtonLocator).click();
  });

  it("Should login a user and verify the user name", async function () {
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(fieldLoginNameLocator).sendKeys(actualLogin);
    await driver
      .findElement(fieldLoginPasswordLocator)
      .sendKeys(actualPassword);
    await driver.findElement(buttonLoginSubmitLocator).click();
    await driver.wait(
      until.elementIsVisible(await driver.findElement(userNameLocator)),
      5000
    );
    expect(await driver.findElement(userNameLocator).getText()).to.be.equal(
      actualLogin
    ); // проверка совпадения логина и имени в Моем аккаунте
    await driver.findElement(logoutButtonLocator).click();
  });

  it("Should display error message when wrong password is entere", async function () {
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(fieldLoginNameLocator).sendKeys(actualLogin);
    await driver.findElement(fieldLoginPasswordLocator).sendKeys(wrongPassword);
    await driver.findElement(buttonLoginSubmitLocator).click();

    expect(
      await driver.findElement(forgotPasswordMessageLinkLocator).isDisplayed()
    ).to.be.true; // проверка появления ссылки на восстановление пароля
  });

  it("Should display error message when wrong email is entered", async function () {
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(fieldLoginNameLocator).sendKeys(wrongEmail);
    await driver
      .findElement(fieldLoginPasswordLocator)
      .sendKeys(actualPassword);
    await driver.findElement(buttonLoginSubmitLocator).click();

    expect(await driver.findElement(errorLoginMessage).isDisplayed()).to.be
      .true; // проверка появления ошибки в логине
  });

  it("Should display message about new password being sent to email", async function () {
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(forgotPasswordButtonLocator).click();
    await driver.findElement(forgotPasswordFieldLocator).sendKeys(actualLogin);
    await driver.findElement(forgotPasswordSubmitButton).click();

    expect(
      await driver.findElement(forgotPasswordMessageAlertLocator).isDisplayed()
    ).to.be.true; // проверка появления сообщения об отправки нового пароля на email
  });

  it("Should show error Registration Using Existing Email Test", async function () {
    const expectedResult =
      "Error: Учетная запись с такой почтой уже зарегистировавана. Пожалуйста авторизуйтесь.";
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(registerButtonLocator).click();
    await driver.findElement(fieldNameRegisterLocator).sendKeys(actualLogin);
    await driver.findElement(fieldEmailRegisterLocator).sendKeys(testNewEmail);
    await driver
      .findElement(fieldPasswordRegisterLocator)
      .sendKeys(actualPassword);
    await driver.findElement(registerSubmitButtonLocator).click();
    expect(
      await driver.findElement(registerErrorMessageLocator).getText()
    ).to.be.equal(expectedResult); // проверка появления ошибки об уже зарегистрированной почте
  });
});
