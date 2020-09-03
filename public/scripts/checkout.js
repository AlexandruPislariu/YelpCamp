var displayError = document.getElementById("card-errors");
function errorHandler(error)
{   
    changeLoadingState(false);
    displayError.textContent = error;
};

var stripe = Stripe("pk_test_51HNEmpAHYO2lcvLz9oxqXiEC6wwUJGszhQvCcYvtX6i1u0eOibA9yDr8TEYyGbd63z1W0iE6youoe170N8YMRCGY00JD6Fmho3");
var orderData = 
{
    items: [{id: "yelpcamp-payment"}],
    currency: "usd"
};

// Set up Stripe.js and Elements to use in checkout form
var elements = stripe.elements();
var style = {
    base: {
        color: "#32325d",
    }
};

var card = elements.create("card", { style: style });
card.mount("#card-element");

card.on('change', ({error}) => {
    // Disable the Pay button if there are no card details in the Element
    document.querySelector("button").disabled = event.empty;
    document.querySelector("#card-errors").textContent = event.error ? event.error.message : "";
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    stripe.createPaymentMethod("card", card)
        .then(function(result)
        {   
            if(result.error)
            {   
                errorHandler(result.error);
            }
            else
            {
                orderData.paymentMethodId = result.paymentMethod.id;
                return fetch("/pay",
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(orderData)
                });
            }
        })
        .then(function(result)
        {   
            return result.json();
        })
        .then(function(response)
        {
            if(response.error)
            {   
                errorHandler(response.error);
            }
            else
            {   
                changeLoadingState(false);
                window.location.href = "/campgrounds?paid=true";
            }
        })
});

// Show a spinner on payment submission
function changeLoadingState(isLoading) {
    if (isLoading) {
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
  };

