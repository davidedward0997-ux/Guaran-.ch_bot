// ===============================
// Guarană.ch Mini App
// ===============================

// Telegram Mini App
const tg = window.Telegram?.WebApp;

// Start Telegram Mini App
if (tg) {
    tg.ready();
    tg.expand();
}


// ===============================
// VARIABLES
// ===============================

let currentStep = 1;
let selectedContact = "";
let cart = [];


// ===============================
// TELEGRAM USER
// ===============================

function getTelegramUser() {

    if (!tg || !tg.initDataUnsafe) {
        return null;
    }

    return tg.initDataUnsafe.user || null;
}


// ===============================
// STEP NAVIGATION
// ===============================

function goToStep(step) {

    currentStep = step;

    const step1 = document.getElementById("step1");
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");

    if (step1) step1.classList.add("hidden");
    if (step2) step2.classList.add("hidden");
    if (step3) step3.classList.add("hidden");

    const selectedStep = document.getElementById(
        "step" + step
    );

    if (selectedStep) {
        selectedStep.classList.remove("hidden");
    }

    updateSteps(step);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// UPDATE STEP CIRCLES
// ===============================

function updateSteps(step) {

    const circles = [
        document.getElementById("circle1"),
        document.getElementById("circle2"),
        document.getElementById("circle3")
    ];

    circles.forEach((circle, index) => {

        if (!circle) return;

        circle.classList.remove(
            "active",
            "done"
        );

        if (index + 1 < step) {
            circle.classList.add("done");
        }

        if (index + 1 === step) {
            circle.classList.add("active");
        }
    });
}


// ===============================
// CONTACT METHOD
// ===============================

function selectContact(method) {

    selectedContact = method;

    const signalButton =
        document.getElementById("signalButton");

    const threemaButton =
        document.getElementById("threemaButton");

    if (signalButton) {
        signalButton.classList.remove("selected");
    }

    if (threemaButton) {
        threemaButton.classList.remove("selected");
    }

    if (method === "Signal" && signalButton) {
        signalButton.classList.add("selected");
    }

    if (method === "Threema" && threemaButton) {
        threemaButton.classList.add("selected");
    }
}


// ===============================
// OPEN CATALOGUE
// ===============================

function unlockCatalogue() {

    const input =
        document.getElementById("contactInput");

    if (!input) return;

    const contact = input.value.trim();

    if (!selectedContact) {

        showMessage(
            "Please choose a contact method."
        );

        return;
    }

    if (!contact) {

        showMessage(
            "Please enter your contact."
        );

        return;
    }

    localStorage.setItem(
        "guarana_contact_method",
        selectedContact
    );

    localStorage.setItem(
        "guarana_contact",
        contact
    );

    showCatalogue();
}


// ===============================
// SHOW CATALOGUE
// ===============================

function showCatalogue() {

    const welcome =
        document.getElementById("welcome");

    const catalogue =
        document.getElementById("catalogue");

    const bottomNav =
        document.getElementById("bottomNav");

    if (welcome) {
        welcome.classList.add("hidden");
    }

    if (catalogue) {
        catalogue.classList.remove("hidden");
    }

    if (bottomNav) {
        bottomNav.classList.remove("hidden");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ===============================
// ADD PRODUCT
// ===============================

function addProduct(product, price = 0) {

    const existingProduct =
        cart.find(item => item.name === product);

    if (existingProduct) {

        existingProduct.quantity += 1;

    } else {

        cart.push({
            name: product,
            price: price,
            quantity: 1
        });
    }

    saveCart();

    showMessage(
        product + " added to your cart."
    );
}


// ===============================
// SAVE CART
// ===============================

function saveCart() {

    localStorage.setItem(
        "guarana_cart",
        JSON.stringify(cart)
    );
}


// ===============================
// LOAD CART
// ===============================

function loadCart() {

    const savedCart =
        localStorage.getItem("guarana_cart");

    if (!savedCart) {
        return;
    }

    try {

        cart = JSON.parse(savedCart);

    } catch (error) {

        cart = [];
    }
}


// ===============================
// CART COUNT
// ===============================

function getCartCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
}


// ===============================
// SHOW CART
// ===============================

function showCart() {

    const count = getCartCount();

    if (count === 0) {

        showMessage(
            "Your cart is empty."
        );

        return;
    }

    let cartText =
        "Your cart:\n\n";

    let total = 0;

    cart.forEach(item => {

        const itemTotal =
            item.price * item.quantity;

        total += itemTotal;

        cartText +=
            item.name +
            " × " +
            item.quantity +
            "\n";

    });

    if (total > 0) {

        cartText +=
            "\nTotal: " +
            total +
            " CHF";
    }

    showMessage(cartText);
}


// ===============================
// SHOW CONTACT
// ===============================

function showContact() {

    const method =
        localStorage.getItem(
            "guarana_contact_method"
        );

    const contact =
        localStorage.getItem(
            "guarana_contact"
        );

    if (method && contact) {

        showMessage(
            "Contact method: " +
            method +
            "\n\nContact: " +
            contact
        );

    } else {

        showMessage(
            "No contact information saved."
        );
    }
}


// ===============================
// MESSAGE
// ===============================

function showMessage(message) {

    // Use Telegram popup when available
    if (
        tg &&
        typeof tg.showPopup === "function"
    ) {

        tg.showPopup({
            title: "Guarană.ch",
            message: message,
            buttons: [
                {
                    id: "ok",
                    type: "ok",
                    text: "OK"
                }
            ]
        });

        return;
    }

    // Normal browser fallback
    alert(message);
}


// ===============================
// MENU
// ===============================

function openMenu() {

    showMessage(
        "Welcome to Guarană.ch"
    );
}


// ===============================
// TELEGRAM MAIN BUTTON
// ===============================

function setupTelegram() {

    if (!tg) {
        return;
    }

    tg.MainButton.setText(
        "Open Catalogue"
    );

    tg.MainButton.hide();

    tg.onEvent(
        "mainButtonClicked",
        function () {

            showCatalogue();

            tg.MainButton.hide();
        }
    );
}


// ===============================
// LOAD SAVED DATA
// ===============================

function loadSavedData() {

    const savedMethod =
        localStorage.getItem(
            "guarana_contact_method"
        );

    const savedContact =
        localStorage.getItem(
            "guarana_contact"
        );

    if (savedMethod) {

        selectedContact = savedMethod;

        if (savedMethod === "Signal") {

            const button =
                document.getElementById(
                    "signalButton"
                );

            if (button) {
                button.classList.add(
                    "selected"
                );
            }

        }

        if (savedMethod === "Threema") {

            const button =
                document.getElementById(
                    "threemaButton"
                );

            if (button) {
                button.classList.add(
                    "selected"
                );
            }
        }
    }

    if (savedContact) {

        const input =
            document.getElementById(
                "contactInput"
            );

        if (input) {
            input.value = savedContact;
        }
    }
}


// ===============================
// INITIALIZE APP
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCart();

        loadSavedData();

        setupTelegram();

        updateSteps(1);

    }
);
function updateSteps(activeStep) {

    for (let i = 1; i <= 3; i++) {

        const circle =
            document.getElementById("stepCircle" + i);

        circle.classList.remove("active");
        circle.classList.remove("completed");

        if (i < activeStep) {
            circle.classList.add("completed");
        }

        if (i === activeStep) {
            circle.classList.add("active");
        }
    }

    if (activeStep >= 3) {
        document.getElementById("line1")
            .style.background = "#2d9c73";

        document.getElementById("line2")
            .style.background = "#2d9c73";
    }

    else if (activeStep === 2) {
        document.getElementById("line1")
            .style.background = "#2d9c73";

        document.getElementById("line2")
            .style.background = "#44414f";
    }

    else {
        document.getElementById("line1")
            .style.background = "#44414f";

        document.getElementById("line2")
            .style.background = "#44414f";
    }
}


function selectContact(method) {

    selectedContact = method;

    document
        .getElementById("telegramOption")
        .classList.remove("selected");

    document
        .getElementById("whatsappOption")
        .classList.remove("selected");

    if (method === "Telegram") {

        document
            .getElementById("telegramOption")
            .classList.add("selected");

    }

    if (method === "WhatsApp") {

        document
            .getElementById("whatsappOption")
            .classList.add("selected");

    }

    document
        .getElementById("continueContact")
        .disabled = false;

    const label =
        document.getElementById("contactLabel");

    const input =
        document.getElementById("contactInput");

    label.textContent = method + " contact";

    input.placeholder =
        method === "Telegram"
            ? "Enter your Telegram username"
            : "Enter your WhatsApp number";
}


function unlockCatalogue() {

    const contact =
        document.getElementById("contactInput")
        .value
        .trim();

    if (!contact) {
        alert("Please enter your contact.");
        return;
    }

    document.getElementById("step3")
        .classList.add("hidden");

    document.getElementById("catalogue")
        .classList.remove("hidden");

    document.querySelector(".steps")
        .classList.add("hidden");
}


function orderProduct(productName) {

    const message =
        "I would like to order: " + productName;

    if (tg) {

        tg.showPopup({
            title: "Order",
            message: message,
            buttons: [
                {
                    id: "confirm",
                    type: "default",
                    text: "Continue"
                },
                {
                    id: "cancel",
                    type: "cancel",
                    text: "Cancel"
                }
            ]
        }, function(buttonId) {

            if (buttonId === "confirm") {

                tg.sendData(
                    JSON.stringify({
                        action: "order",
                        product: productName,
                        contact_method: selectedContact,
                        contact:
                            document.getElementById(
                                "contactInput"
                            ).value
                    })
                );
            }

        });

    } else {

        alert(message);
    }
}


function closeApp() {

    if (tg) {
        tg.close();
    }
}


function showMenu() {

    alert("Guaraná.ch menu");
  }
