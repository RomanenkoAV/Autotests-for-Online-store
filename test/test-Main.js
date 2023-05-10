const { By, until } = require("selenium-webdriver");
const { expect } = require("chai");

describe("Test Main page", async function () {
  beforeEach(async function () {
    await driver.get("http://intershop5.skillbox.ru/");
  });
  it("Searching product", async function () {
    const apple = "apple";

    const searchField = By.css("input.search-field"); // строка поиска
    const searchButton = By.css("button.searchsubmit"); // кнопка поиска
    const searchTitleMain = By.css("h1.entry-title.ak-container"); // заголовок результатов поиска
    const searchTitleResult = By.css(
      "ul.products.columns-4 li:first-of-type h3"
    ); // 1-ый продукт в результате поиска

    await driver.findElement(searchField).sendKeys(apple); // ввод в строку поиска

    await driver.findElement(searchButton).click(); // поиск

    await driver.wait(
      until.elementIsVisible(await driver.findElement(searchTitleMain)),
      5000
    ); // ожидаем появление результатов поиска
    const resTitle = await driver.findElement(searchTitleMain).getText(); // сохраняем текст заголовка и продукта
    const resTitleProduct = await driver
      .findElement(searchTitleResult)
      .getText();
    const titleText = await resTitle.toLowerCase(); // в нижний регистр
    const titleTextProduct = await resTitleProduct.toLowerCase();
    expect(titleText).to.be.contains(apple, "Wrong greeting text title!"); // проверка на совпадение заголовка
    expect(titleTextProduct).to.be.contains(
      apple,
      "Wrong greeting text product!"
    ); // проверка на совпадение продукта
  });

  it("Click on Catalog", async function () {
    const catalogButton = By.css("ul.menu > li:nth-child(2) > a"); // Кнопка в меню "Каталог"
    const titleMain = By.css("h1.entry-title");
    await driver.findElement(catalogButton).click(); //

    await driver.wait(async () => {
      return (
        (await driver.getCurrentUrl()) ===
        "http://intershop5.skillbox.ru/product-category/catalog/"
      );
    }, 5000); // ожидаем перехода по ссылке

    const resTitle = await driver.findElement(titleMain).getText(); // Текст заголовка

    expect(resTitle).to.be.equal("КАТАЛОГ", "Wrong greeting text"); // проверка на совпадение заголовка
  });

  it("Click on My Account", async function () {
    const enterButton = By.css("div.login-woocommerce > a.account"); // Кнопка "Войти"
    const titleMain = By.css("h2.post-title");
    await driver.findElement(enterButton).click(); //

    await driver.wait(async () => {
      return (
        (await driver.getCurrentUrl()) ===
        "http://intershop5.skillbox.ru/my-account/"
      );
    }, 5000); // ожидаем перехода по ссылке

    const resTitle = await driver.findElement(titleMain).getText(); // Текст заголовка

    expect(resTitle).to.be.equal("Мой аккаунт", "Wrong greeting text"); // проверка на совпадение заголовка
  });

  it("Label New exist", async function () {
    const labelNew = By.xpath(
      "//*[@id = 'accesspress_store_product-3']//*[@data-slick-index = '0']//*[@class = 'label-new'] "
    ); // Значок "Новый"
    const newProduct = By.css("#accesspress_store_product-3"); // Новые поступления
    const newProductCards = By.css(
      "#accesspress_store_product-3 .new-prod-slide"
    );
    await driver.executeScript(
      "arguments[0].scrollIntoView(true)",
      await driver.findElement(newProduct)
    ); // скроллим до Новые поступления
    await driver.wait(
      until.elementIsVisible(await driver.findElement(newProductCards)),
      5000
    ); // ожидаем появления карточек товаров
    expect(
      await driver.findElement(labelNew).isDisplayed(),
      "Label NEW is not displayed"
    ).to.be.true; // проверка наличия значка "Новый"
  });

  it("Promo product name", async function () {
    const promoName = By.css("div.promo-desc-title"); // Название промо товара
    const promoButton = By.css("#accesspress_store_full_promo-2 a"); // кнопка "Посмотреть товар"
    const productName = By.css("div.summary > h1.product_title"); // Название товара в карточке

    const promoTitle = await driver.findElement(promoName).getText();
    await driver.findElement(promoButton).click(); //

    await driver.wait(
      until.elementIsVisible(await driver.findElement(productName)),
      5000
    ); // ожидаем появление результатов поиска

    const productTitle = await driver.findElement(productName).getText();

    expect(productTitle).to.be.contains(
      promoTitle,
      "Wrong greeting text title!"
    ); // проверка на совпадение заголовка
  });
});
