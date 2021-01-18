const menuWrapper = document.getElementById("menu-wrap")
const productsWrapper = document.getElementById("products-wrap");
const productInfoWrapper = document.getElementById("product-info-wrap");
const buyWrapper = document.getElementById("buy-wrap");
const deliveryCities = [{"code": 1, "name": "Kyiv"}, {"code": 2, "name": "Odessa"}, {"code": 3, "name": "Lviv"}];

let buySelectionCallback = function (event) {
	buyWrapper.innerHTML = "";
	showBuyProductForm(buyWrapper, event.currentTarget.dataset.productId, deliveryCities);
}

let productSelectionCallback = function (event) {
	productInfoWrapper.innerHTML = "";
	buyWrapper.innerHTML = "";
	showProductInfo(productInfoWrapper, event.currentTarget.dataset.categoryId, event.currentTarget.dataset.productId, buySelectionCallback);
}

let menuItemSelectionCallback = function (event) {
	productsWrapper.innerHTML = "";
	productInfoWrapper.innerHTML = "";
	buyWrapper.innerHTML = "";
	showProducts(productsWrapper, event.currentTarget.dataset.categoryId, productSelectionCallback);
	event.preventDefault();
}

createMenu(menuWrapper, categories, menuItemSelectionCallback);

function createMenu(menuElementWrapper, categories, menuItemSelectionCallback) {
	const menuElement = document.createElement("ul");
	for (let i = 0; i < categories.length; i++) {
		const menuLink = document.createElement("a");
		menuLink.href = "#";
		menuLink.innerText = categories[i].name;
		menuLink.dataset.categoryId = categories[i].id;
		menuLink.className = "categoryLink";
		menuLink.addEventListener("click", menuItemSelectionCallback);

		const menuItem = document.createElement("li");
		menuItem.append(menuLink);
		menuElement.append(menuItem);
	}

	menuElementWrapper.append(menuElement);
}

function showProducts(productsWrapper, categoryId, productSelectionCallback) {
	const products = getProductsByCategoryId(categoryId);

	for (let i = 0; i < products.length; i++) {
		const productElement = document.createElement("div");
		productElement.dataset.categoryId = categoryId;
		productElement.dataset.productId = products[i].id;
		productElement.className = "product";

		const productImageElement = createAndAppendElement(productElement, "img");
		productImageElement.src = products[i].photo;

		const nameElement = createAndAppendElement(productElement, "p");
		nameElement.innerText = products[i].name

		const priceElement = createAndAppendElement(productElement, "p");
		priceElement.innerText = products[i].cost
		priceElement.className = "price";

		productsWrapper.append(productElement);

		productElement.addEventListener("click", productSelectionCallback);
	}
}

function showProductInfo(productInfoWrapper, categoryId, productId, buySelectionCallback) {
	const product = getProduct(categoryId, productId);

	const productInfoElement = document.createElement("div");
	productInfoElement.className = "productInfo";

	const productImageElement = createAndAppendElement(productInfoElement, "img");
	productImageElement.src = product.photo;
	productImageElement.className = "productImage";

	const nameElement = createAndAppendElement(productInfoElement, "p");
	nameElement.innerText = product.name

	const descriptionElement = createAndAppendElement(productInfoElement, "p");
	descriptionElement.innerText = product.description;

	const priceElement = createAndAppendElement(productInfoElement, "p");
	priceElement.innerText = product.cost
	priceElement.className = "price";

	productInfoWrapper.append(productInfoElement);

	let buyButton = createAndAppendElement(productInfoWrapper, "input", "button");
	buyButton.value = "Buy";
	buyButton.dataset.productId = productId;
	buyButton.addEventListener("click", buySelectionCallback);
}

function showBuyProductForm(buyElementWrapper, productId, deliveryCities) {
	createAndAppendElement(buyElementWrapper, "h2").innerText = "Confirm order";

	const buyForm = createAndAppendElement(null, "form");
	const clientFio = createAndAppendElement(buyForm, "input", "text", "Full name", true, "clientFio");

	const deliveryCity = createAndAppendElement(buyForm, "select", null, "Full name", true, "deliveryCity");
	for (let i = 0; i < deliveryCities.length; i++) {
		const option = document.createElement("option");
		option.text = deliveryCities[i].name;
		option.value = deliveryCities[i].code;
		deliveryCity.add(option);
	}
	deliveryCity.id = "sel-deliveryCity";

	const deliveryCityLabel = createAndAppendElement(buyForm, "label");
	deliveryCityLabel.htmlFor = "sel-deliveryCity";
	deliveryCityLabel.innerText = "City for delivery";

	const storeNum = createAndAppendElement(buyForm, "input", "text", "Store number", true, "storeNum");

	const cardPayment = createAndAppendElement(buyForm, "input", "radio", "", true, "paymentType");
	cardPayment.checked = true;
	cardPayment.value = "cardPayment";
	cardPayment.id = "rb-cardPaymentType";

	const cardPaymentLabel = createAndAppendElement(buyForm, "label");
	cardPaymentLabel.htmlFor = "rb-cardPaymentType";
	cardPaymentLabel.innerText = "Card payment";

	const codPayment = createAndAppendElement(buyForm, "input", "radio", "", true, "paymentType");
	codPayment.value = "codPayment";
	codPayment.id = "rb-codPaymentType";

	const codPaymentLabel = createAndAppendElement(buyForm, "label");
	codPaymentLabel.htmlFor = "rb-codPaymentType";
	codPaymentLabel.innerText = "Cash on delivery";

	const productCount = createAndAppendElement(buyForm, "input", "number", "Product count", true, "productCount");
	productCount.value = 1;
	productCount.min = 1;

	createAndAppendElement(buyForm, "textarea", null, "Order comment", false, "orderComment");

	const confirmOrder = createAndAppendElement(buyForm, "input", "button", null, false, "confirmOrder");
	confirmOrder.value = "Confirm order";
	confirmOrder.addEventListener("click", function () {
		validationResult.innerHTML = "";

		if (clientFio.value === "") {
			createAndAppendElement(validationResult, "p").innerText = "Enter a full name.";
		}
		if (deliveryCity.value === "") {
			createAndAppendElement(validationResult, "p").innerText = "Enter a city fot delivery.";
		}
		if (storeNum.value === "") {
			createAndAppendElement(validationResult, "p").innerText = "Enter a store number.";
		}
		if (productCount.value === "" || productCount.value <= 0) {
			createAndAppendElement(validationResult, "p").innerText = "Product count must be grate than 0.";
		}

		if (validationResult.innerHTML === "") {
			createAndAppendElement(validationResult, "p").innerText = "Order confirmed.";
		}
	});

	let validationResult = createAndAppendElement(buyForm, "div");

	buyElementWrapper.append(buyForm);
}

function getProductsByCategoryId(categoryId) {
	for (let i = 0; i < categories.length; i++) {
		if (parseInt(categoryId) === categories[i].id) {
			return categories[i].items;
		}
	}

	throw "Unknown category " + categoryId;
}

function getProduct(categoryId, productId) {
	let products = getProductsByCategoryId(categoryId);

	for (let i = 0; i < products.length; i++) {
		if (parseInt(productId) === products[i].id) {
			return products[i];
		}
	}

	throw "Unknown product " + productId;
}

function createAndAppendElement(parentElement, tagName, type, placeholder, isRequired, name) {
	const element = document.createElement(tagName);

	if (type) {
		element.type = type;
	}
	if (placeholder) {
		element.placeholder = placeholder;
	}
	if (isRequired) {
		element.required = isRequired;
	}
	if (name) {
		element.name = name;
	}

	if (parentElement) {
		parentElement.append(element);
	}

	return element;
}