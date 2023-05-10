const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");
const promo = "SERT500";

describe("Test Basket page", async function () {
  // для всех тестов выносим добавление товаров и переход из каталога в корзину
  beforeEach(async function () {
    await driver.get("http://intershop5.skillbox.ru/product-category/catalog/");

    const inBusketButtonW = By.css(
      ".products.columns-4 > *:nth-child(2) a.button"
    ); // в корзину - Watch
    const inBusketButtonIp = By.css(
      ".products.columns-4 > *:nth-child(4) a.button"
    ); // в корзину - Ipad
    const busketButton = By.css("ul.menu > li:nth-child(4) > a");
    const productInBasket = By.css(
      ".products.columns-4 > *:nth-child(4) a.added_to_cart"
    ); // элемент добавления в корзину

    await driver.findElement(inBusketButtonW).click();
    await driver.findElement(inBusketButtonIp).click(); // в корзину и ждем далее добавления в корзину
    await driver.wait(
      until.elementIsVisible(await driver.findElement(productInBasket)),
      5000
    );
    await driver.findElement(busketButton).click(); // корзина и ждем далее открытие корзины
    await driver.wait(async () => {
      return (
        (await driver.getCurrentUrl()) === "http://intershop5.skillbox.ru/cart/"
      );
    }, 5000); // ожидаем перехода по ссылке
  });
  it("Sum in basket", async function () {
    const priseW = By.css(
      "tbody > .cart_item:nth-child(1) td.product-subtotal bdi"
    );
    const priseIp = By.css(
      "tbody > .cart_item:nth-child(2) td.product-subtotal bdi"
    );
    const priseSum = By.css(".order-total bdi");

    const num1 = await driver.findElement(priseW).getText();
    const num2 = await driver.findElement(priseIp).getText();
    const numOrderTotal = await driver.findElement(priseSum).getText();
    const sum =
      parseFloat(num1.replace(",", ".")) + parseFloat(num2.replace(",", ".")); // складываем сумму корзины
    const sumOrderTotal = parseFloat(numOrderTotal.replace(",", "."));
    expect(sum).to.be.equal(sumOrderTotal, "Wrong sum in Basket!"); // проверка совпадения сумм
  });

  it("Promocode Positive", async function () {
    const insertPromo = By.css("input#coupon_code");
    const buttonPromo = By.xpath("//button[@name='apply_coupon']");
    const trPromo = By.css(".cart-discount.coupon-sert500"); //строка промокода
    const priseSum = By.css(".order-total bdi");

    const sumWithoutPromoText = await driver.findElement(priseSum).getText();
    const sumWithoutPromo = parseFloat(sumWithoutPromoText.replace(",", ".")); // без промокода

    await driver.findElement(insertPromo).sendKeys(promo); // вводим промокод
    await driver.findElement(buttonPromo).click(); // применить промокод
    await driver.wait(
      until.elementIsVisible(await driver.findElement(trPromo)),
      5000
    );
    const sumWithPromoText = await driver.findElement(priseSum).getText();
    const sumWithPromo = parseFloat(sumWithPromoText.replace(",", ".")); // с промокодом
    expect(sumWithPromo).to.be.equal(
      sumWithoutPromo - 500,
      "Wrong sum in Basket - Promocode is not apply!"
    ); // проверка примененного промокода на итоговой сумме (вычитаем 500)
  });
  it.only("Promocode Apply and Delete", async function () {
    const insertPromo = By.css("input#coupon_code");
    const buttonPromo = By.xpath("//button[@name='apply_coupon']");
    const trPromo = By.css(".cart-discount.coupon-sert500"); //строка промокода
    const removePromo = By.xpath(
      "//a[@class='woocommerce-remove-coupon'][@data-coupon='sert500']"
    ); // кнопка промокода

    await driver.findElement(insertPromo).sendKeys(promo); // вводим промокод
    await driver.findElement(buttonPromo).click(); // применить промокод

    await driver.wait(
      until.elementIsVisible(await driver.findElement(trPromo)), // ожидание строки промокода
      5000
    );

    await driver.findElement(removePromo).click(); // удалить промокод

    await driver.wait(async () => {
      // ожидание исчезновения элемента - строки промокода
      const elements = await driver.findElements(trPromo);
      if (elements.length == 0) {
        // ("Элемент отсутствует");
        return true;
      } else {
        // ("Элемент присутствует");
        return false;
      }
    }, 3000);
  });

  it("Promocode Negative", async function () {
    const wrongPromo = "SERT5000";
    const insertPromo = By.css("input#coupon_code");
    const buttonPromo = By.xpath("//button[@name='apply_coupon']");
    const textNotification = By.css(".woocommerce-error li");

    await driver.findElement(insertPromo).sendKeys(wrongPromo); // вводим промокод
    await driver.findElement(buttonPromo).click(); // применить промокод
    await driver.wait(
      until.elementIsVisible(await driver.findElement(textNotification)),
      5000
    );
    const text = await driver.findElement(textNotification).getText();
    expect(text).to.be.equal("Неверный купон.", "Wrong error text"); // проверка уведомления о неверном купоне
  });
});
