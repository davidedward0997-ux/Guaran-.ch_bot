let currentStep = 1;
let selectedContact = "";

const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
}

function showStep(step) {

    currentStep = step;

    document.getElementById("step1").classList.add("hidden");
    document.getElementById("step2").classList.add("hidden");
    document.getElementById("step3").classList.add("hidden");

    document
        .getElementById("step" + step)
        .classList.remove("hidden");

    updateSteps(step);
}


function nextStep(step) {

    if (step === 3 && !selectedContact) {
        alert("Please choose a contact method first.");
        return;
    }

    showStep(step);
}


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
