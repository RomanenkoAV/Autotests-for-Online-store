const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const generateLogin = require("../GenerateLogin.js");
// данные для заполнения формы оформления заказа
const testPassword = "123456";
const clientName = "Илон";
const clientSurname = "Маск";
const clientAddress = "ул.Мира, д.13, кв. 999";
const clientCity = "Красноярск";
const clientRegion = "Красноярский";
const clientZIPCode = "660000";
const clientPhone = "+79999999999";
const clientComment = "Оставить у двери";
const SuccessfulOrderMessage = "Заказ получен";
const discountCoupon = "SERT500";
// все локаторы для тестов
const loginButtonLocator = By.css(".account");
const registerButtonLocator = By.css(".custom-register-button");
const fieldNameRegisterLocator = By.id("reg_username");
const fieldEmailRegisterLocator = By.id("reg_email");
const fieldPasswordRegisterLocator = By.id("reg_password");
const registerSubmitButtonLocator = By.css(
  ".woocommerce-form-register__submit"
);
const headerCatalogButtonLocator = By.id("menu-item-46");
const firstProductLocator = By.xpath(
  "//*[@class = 'products columns-4'] // li[2] // *[@class = 'inner-img'] /a"
);
const cardProductButtonAddToBasketLocator = By.name("add-to-cart");
const headerButtonBasketLocator = By.id("menu-item-29");
const checkoutButtonLocator = By.css(".checkout-button");
const nameFieldLocator = By.id("billing_first_name");
const surnameFieldLocator = By.id("billing_last_name");
const addressFieldLocator = By.id("billing_address_1");
const cityFieldLocator = By.id("billing_city");
const regionFieldLocator = By.id("billing_state");
const zipCodeFieldLocator = By.id("billing_postcode");
const phoneFieldLocator = By.id("billing_phone");
const commentFieldLocator = By.id("order_comments");
const emailFieldLocator = By.id("billing_email");
const payMethodBankLocator = By.id("payment_method_bacs");
const orderSubmitButtonLocator = By.id("place_order");
const orderSuccessfulMessageLocator = By.css(".post-title");
const orderSuccessful = By.css(".woocommerce-thankyou-order-received");
const addCouponButtonLocator = By.css(".showcoupon");
const addCouponFieldLocator = By.id("coupon_code");
const addCouponApplyButtonLocator = By.name("apply_coupon");
const alertCouponMessageLocator = By.xpath("//*[@role = 'alert']");
const alertFieldEmptyMessageLocator = By.xpath(
  "//*[@role = 'alert'] // li // strong"
);
const accountUserHeaderButtonLocator = By.id("menu-item-30");
const accountUserOrdersButtonLocator = By.css(
  ".woocommerce-MyAccount-navigation-link--orders a"
);
const ordersNumberInAccountUserLocator = By.css(
  ".woocommerce-orders-table__cell-order-number a"
);

describe("Test ordering", async function () {
  beforeEach(async function () {
    // генерация логина и почты при каждом тесте
    const testNewName = generateLogin();
    const testNewEmail = testNewName + "@ts.ru";
    await driver.get("http://intershop5.skillbox.ru/");
    // регистрируемся
    await driver.findElement(loginButtonLocator).click();
    await driver.findElement(registerButtonLocator).click();
    await driver.findElement(fieldNameRegisterLocator).sendKeys(testNewName);
    await driver.findElement(fieldEmailRegisterLocator).sendKeys(testNewEmail);
    await driver
      .findElement(fieldPasswordRegisterLocator)
      .sendKeys(testPassword);
    await driver.findElement(registerSubmitButtonLocator).click();
    // добавляем товар в корзину
    await driver.findElement(headerCatalogButtonLocator).click();
    await driver.findElement(firstProductLocator).click();
    await driver.findElement(cardProductButtonAddToBasketLocator).click();
    await driver.findElement(headerButtonBasketLocator).click();
    await driver.findElement(checkoutButtonLocator).click();
    // заполняем форму оформления заказа
    await driver.findElement(nameFieldLocator).sendKeys(clientName);
    await driver.findElement(surnameFieldLocator).sendKeys(clientSurname);
    await driver.findElement(addressFieldLocator).sendKeys(clientAddress);
    await driver.findElement(cityFieldLocator).sendKeys(clientCity);
    await driver.findElement(regionFieldLocator).sendKeys(clientRegion);
    await driver.findElement(zipCodeFieldLocator).sendKeys(clientZIPCode);
    await driver.findElement(phoneFieldLocator).sendKeys(clientPhone);
    await driver.findElement(commentFieldLocator).sendKeys(clientComment);
  });

  it("Placement of order positive test", async function () {
    await driver.findElement(payMethodBankLocator).click();
    await driver.findElement(orderSubmitButtonLocator).click();

    await driver.wait(
      until.elementIsVisible(await driver.findElement(orderSuccessful)),
      5000
    );
    
    const actualMessage = await driver
      .findElement(orderSuccessfulMessageLocator)
      .getText();
    expect(actualMessage).to.be.equal(SuccessfulOrderMessage); // проверка сообщения об успешном заказе
  });

  it("Add discount coupon positive test", async function () {
    const expectedResult = "Купон успешно добавлен.";

    await driver.findElement(payMethodBankLocator).click();
    await driver.findElement(addCouponButtonLocator).click();
    await driver.findElement(addCouponFieldLocator).sendKeys(discountCoupon);
    await driver.findElement(addCouponApplyButtonLocator).click();

    expect(await driver.findElement(alertCouponMessageLocator).isDisplayed()).to
      .be.true;
    expect(
      await driver.findElement(alertCouponMessageLocator).getText()
    ).to.be.equal(expectedResult); // проверка сообщения о добавлении купона
  });

  it("Negative test - empty field name", async function () {
    const expectedResult = "Имя для выставления счета";

    await driver.findElement(nameFieldLocator).clear();
    await driver.findElement(orderSubmitButtonLocator).click();

    await driver.wait(
      until.elementIsVisible(
        await driver.findElement(alertFieldEmptyMessageLocator)
      ),
      5000
    );

    expect(
      await driver.findElement(alertFieldEmptyMessageLocator).isDisplayed()
    ).to.be.true;
    expect(
      await driver.findElement(alertFieldEmptyMessageLocator).getText()
    ).to.be.equal(expectedResult); // проверка ошибки на отсутствие имени
  });

  it("Negative test - empty field address", async function () {
    const expectedResult = "Адрес для выставления счета";

    await driver.findElement(addressFieldLocator).clear();
    await driver.findElement(orderSubmitButtonLocator).click();

    await driver.wait(
      until.elementIsVisible(
        await driver.findElement(alertFieldEmptyMessageLocator)
      ),
      5000
    );

    expect(
      await driver.findElement(alertFieldEmptyMessageLocator).isDisplayed()
    ).to.be.true;
    expect(
      await driver.findElement(alertFieldEmptyMessageLocator).getText()
    ).to.be.equal(expectedResult); // проверка ошибки на отсутствие адреса
  });

  it("Negative test - empty field email", async function () {
    const expectedResult = "Адрес почты для выставления счета";

    await driver.findElement(emailFieldLocator).clear();
    await driver.findElement(orderSubmitButtonLocator).click();

    await driver.wait(
      until.elementIsVisible(
        await driver.findElement(alertFieldEmptyMessageLocator)
      ),
      5000
    );

    expect(
      await driver.findElement(alertFieldEmptyMessageLocator).isDisplayed()
    ).to.be.true;
    expect(
      await driver.findElement(alertFieldEmptyMessageLocator).getText()
    ).to.be.equal(expectedResult); // проверка ошибки на отсутствие почты
  });

  it("Check order in account user", async function () {
    await driver.findElement(orderSubmitButtonLocator).click();
    await driver.wait(
      until.elementIsVisible(await driver.findElement(orderSuccessful)),
      5000
    );

    await driver.findElement(accountUserHeaderButtonLocator).click();

    await driver.findElement(accountUserOrdersButtonLocator).click();
    await driver.wait(
      until.elementIsVisible(
        await driver.findElement(ordersNumberInAccountUserLocator)
      ),
      5000
    );

    expect(
      await driver.findElement(ordersNumberInAccountUserLocator).isDisplayed()
    ).to.be.true; // проверка наличия заказа в личном кабинете
  });
});
