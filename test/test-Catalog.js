const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Test Catalog page", async function () {
  beforeEach(async function () {
    await driver.get("http://intershop5.skillbox.ru/product-category/catalog/");
  });
  it("Сategories = Title", async function () {
    let numberOfCategory = 0;

    while (numberOfCategory < 13) {
      numberOfCategory++; // счетчик номера категории
      const nameOfCategoryButton = By.xpath(
        `//*[@class = 'product-categories'] / li[${numberOfCategory}] / a`
      ); // кнопка категории справа
      const expectedResult = await driver
        .findElement(nameOfCategoryButton)
        .getText();
      const expectedResultCat = await expectedResult.toLowerCase(); // текст категории справа
      await driver.findElement(nameOfCategoryButton).click(); // выбираем категорию
      const nameOfCategoryTitle = By.css(".entry-title");
      await driver.wait(
        until.elementIsVisible(await driver.findElement(nameOfCategoryTitle)),
        5000
      );
      const expectedTitle = await driver
        .findElement(nameOfCategoryTitle)
        .getText();
      const expectedTitletCat = await expectedTitle.toLowerCase(); // текст заголовка категории
      expect(expectedTitletCat).to.be.equal(
        expectedResultCat,
        "Wrong greeting text"
      ); // проверка соответствия выбранной категории и заголовка
    }
  });

  it("Name product equal product card", async function () {
    const catalogName = By.css(".products.columns-4 > *:nth-child(2) h3");
    const cardName = By.css("h1.product_title.entry-title");

    const textCatalog = await driver.findElement(catalogName).getText();
    await driver.findElement(catalogName).click();

    await driver.wait(
      until.elementIsVisible(await driver.findElement(cardName)),
      5000
    );
    const textCard = await driver.findElement(cardName).getText();
    expect(textCard).to.be.equal(textCatalog, "Wrong greeting text"); // проверка выбранного товара в каталоге и карточки товара
  });

  it("Product to basket", async function () {
    const catalogName = By.css(".products.columns-4 > *:nth-child(2) h3");
    const inBusketButton = By.css(
      ".products.columns-4 > *:nth-child(2) a.button"
    );
    const busketButton = By.css("ul.menu > li:nth-child(4) > a");
    const nameInBasket = By.css(".product-name > a");
    const productInBasket = By.css(
      ".products.columns-4 > *:nth-child(2) a.added_to_cart"
    ); // элемент добавления в корзину

    const textCatalog = await driver.findElement(catalogName).getText();
    await driver.findElement(inBusketButton).click(); // в корзину и ждем далее добавления в корзину
    await driver.wait(
      until.elementIsVisible(await driver.findElement(productInBasket)),
      5000
    );

    await driver.findElement(busketButton).click(); // корзина и ждем далее открытие корзины
    await driver.wait(
      until.elementIsVisible(await driver.findElement(nameInBasket)),
      5000
    );
    const textBasket = await driver.findElement(nameInBasket).getText();
    expect(textBasket).to.be.equal(textCatalog, "Wrong name in Basket!"); // проверка добавленного товара в корзину
  });
});
