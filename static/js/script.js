document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchResults = document.getElementById("search-results");

  // Function to handle search form
  async function searchProducts(event) {
    event.preventDefault();

    const searchInput = document.getElementById("search").value.trim();
    if (!searchInput) return;

    try {
      const response = await fetch(`/search_products?keyword=${searchInput}`);
      if (!response.ok) {
        throw new Error("Failed to search for products.");
      }

      const data = await response.json();
      console.log(data);
      displaySearchResults(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to display search results
  function displaySearchResults(products) {
    const productContainer = document.querySelector(".product-container");

    // Clear existing products
    productContainer.innerHTML = "";

    // Create a heading for the search results
    const searchResultHeading = document.createElement("h1");
    searchResultHeading.classList.add("heading");
    searchResultHeading.textContent = "Search Results";
    productContainer.appendChild(searchResultHeading);

    if (products.length === 0) {
      // If no products found, display an error message
      const errorMessage = document.createElement("p");
      errorMessage.classList.add("error-message");
      errorMessage.textContent = "Product not found";
      productContainer.appendChild(errorMessage);
    } else {
      // Create a div element for the product list
      const productListDiv = document.createElement("div");
      productListDiv.classList.add("product");

      // Iterate over each product and create product card elements
      products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const productName = document.createElement("h2");
        productName.textContent = product.name;

        const productDescription = document.createElement("p");
        productDescription.classList.add("product-description");
        productDescription.textContent = product.description;

        const productPrice = document.createElement("p");
        productPrice.classList.add("product-price");
        productPrice.textContent = `Price: $${product.price}`;

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const buyButton = document.createElement("button");
        buyButton.classList.add("buy-button");
        buyButton.textContent = "Buy";

        const cartButton = document.createElement("button");
        cartButton.classList.add("cart-button");
        cartButton.textContent = "Add to Cart";
        // Set data-product-id attribute to store the product ID
        cartButton.dataset.productId = product.id;

        // Append elements to product card
        buttonContainer.appendChild(buyButton);
        buttonContainer.appendChild(cartButton);

        productCard.appendChild(productName);
        productCard.appendChild(productDescription);
        productCard.appendChild(productPrice);
        productCard.appendChild(buttonContainer);

        // Append product card to product list
        productListDiv.appendChild(productCard);
      });

      // Append product list to the product container
      productContainer.appendChild(productListDiv);
    }
  }

  // Function to handle adding a product to the cart
  async function addToCart(event, message) {
    const productId = event.target.dataset.productId; // Extract product ID as string
    const userId = getUserIdFromUrl();

    try {
      const response = await fetch("/add_to_cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: productId, // Pass product ID as string
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add the product to the cart.");
      }

      const responseData = await response.json();
      if (responseData.error) {
        throw new Error(responseData.error);
      }

      // Display a pop-up message indicating success
      alert(`Added to ${message} successfully!`);

      // Redirect to /cart?user_id page with the message
      window.location.href = `/carts?user_id=${userId}&message=${message}`;
    } catch (error) {
      console.error(error.message);
    }
  }

  // Function to extract user ID from the URL query parameters
  function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("user_id");
  }

  

  // Add event listener to the parent container of "Add to Cart" buttons
  const productContainer = document.querySelector(".product-container");
  productContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("cart-button")) {
      addToCart(event, "cart");
    } else if (event.target.classList.contains("buy-button")) {
      addToCart(event, "buy");
    }
  });

  // Initially update the cart display
  async function getCart() {
    try {
      const response = await fetch("/cart?user_id=user1");
      if (!response.ok) {
        throw new Error("Failed to fetch the cart data.");
      }

      const cartData = await response.json();
      updateCart(cartData);
    } catch (error) {
      console.error(error.message);
    }
  }

  getCart();
  searchForm.addEventListener("submit", searchProducts);
});

// Function to create the "Delete from Cart" button
function createDeleteFromCartButton(productId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete from Cart";
  deleteButton.classList.add("delete-from-cart-btn");
  deleteButton.setAttribute("data-product-id", productId);
  deleteButton.addEventListener("click", deleteFromCart);
  return deleteButton;
}

async function getProducts() {
  try {
    const response = await fetch("/");
    if (!response.ok) {
      throw new Error("Failed to fetch products.");
    }

    const data = await response.json();
    updateProductsList(data.products);
  } catch (error) {
    console.error(error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("search-form");
  const searchResults = document.getElementById("search-results");

  // Function to handle search form submission
  async function searchProducts(event) {
    event.preventDefault();

    const searchInput = document.getElementById("search").value.trim();
    if (!searchInput) return;

    try {
      const response = await fetch(`/search_products?keyword=${searchInput}`);
      if (!response.ok) {
        throw new Error("Failed to search for products.");
      }

      const data = await response.json();
      displaySearchResults(data);
    } catch (error) {
      console.error(error.message);
    }
  }

  function displaySearchResults(products) {
    searchResults.innerHTML = "";

    if (products.length === 0) {
      searchResults.innerHTML = "<li>No products found.</li>";
    } else {
      products.forEach((product) => {
        const listItem = document.createElement("li");
        console.log("Product here", product);
        listItem.textContent = `${product.name} - Price: $${product.price} - ${product.description} - ID: ${product._id}`;
        searchResults.appendChild(listItem);
      });
    }
  }

  searchForm.addEventListener("submit", searchProducts);
});

async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("/add_product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, description }),
    });

    if (!response.ok) {
      throw new Error("Failed to add the product.");
    }

    // Fetch the updated product list after adding a new product
    await getProducts();

    // Clear the form after successful product addition
    document.getElementById("product-form").reset();
  } catch (error) {
    console.error(error.message);
  }
}

getProducts();
// Function to update the products list
function updateProductsList(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${product.name} - Price: $${product.price} - ${product.description}`;
    listItem.appendChild(createAddToCartButton(product.id));
    productList.appendChild(listItem);
  });
}
// Function to view the cart
async function viewCart(event) {
  try {
    const response = await fetch("/cart?user_id=user1");
    if (!response.ok) {
      throw new Error("Failed to fetch the cart data.");
    }

    const cartData = await response.json();

    const cartList = document.getElementById("cart-list");
    const totalAmountElement = document.getElementById("total-amount");

    cartList.innerHTML = "";
    cartData.cart_items.forEach((cartItem) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${cartItem.name} - Price: $${cartItem.price} - Quantity: ${cartItem.quantity} - Subtotal: $${cartItem.item_total}`;
      listItem.appendChild(createDeleteFromCartButton(cartItem.product_id));
      cartList.appendChild(listItem);
    });

    totalAmountElement.textContent = `Total: $${cartData.total_amount.toFixed(
      2
    )}`;

    // Show the cart list and total amount
    cartList.style.display = "block";
    totalAmountElement.style.display = "block";
  } catch (error) {
    console.error(error.message);
  }
}

async function deleteFromCart(event) {
  const productId = event.target.dataset.productId;

  try {
    const response = await fetch("/delete_from_cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: "user1",
        product_id: parseInt(productId),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to delete the product from the cart.");
    }

    const cartData = await response.json();
    updateCart(cartData);
  } catch (error) {
    console.error(error.message);
  }
}

// Function to update the cart list and total amount
async function updateCart(data) {
  const cartList = document.getElementById("cart-list");
  const totalAmountElement = document.getElementById("total-amount");
  let totalAmount = 0;

  cartList.innerHTML = "";
  data.cart_items.forEach((cartItem) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${cartItem.name} - Price: $${cartItem.price} - Quantity: ${cartItem.quantity} - Subtotal: $${cartItem.item_total}`;
    listItem.appendChild(createDeleteFromCartButton(cartItem.product_id));
    cartList.appendChild(listItem);
    totalAmount += cartItem.item_total;
  });

  totalAmountElement.textContent = `Total: $${totalAmount.toFixed(2)}`;

  // Show the cart list and total amount
  cartList.style.display = "block";
  totalAmountElement.style.display = "block";
}

// Function to create a "Delete from Cart" button
function createDeleteFromCartButton(productId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete from Cart";
  deleteButton.classList.add("delete-from-cart-btn");
  deleteButton.setAttribute("data-product-id", productId);
  deleteButton.addEventListener("click", deleteFromCart);
  return deleteButton;
}

// Function to handle product addition
async function addProduct(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const price = parseFloat(document.getElementById("price").value);
  const description = document.getElementById("description").value;

  try {
    const response = await fetch("/add_product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, description }),
    });

    if (!response.ok) {
      throw new Error("Failed to add the product.");
    }

    // Fetch the updated product list after adding a new product
    await getProducts();

    // Clear the form after successful product addition
    document.getElementById("product-form").reset();
  } catch (error) {
    console.error(error.message);
  }
}

// Function to handle viewing the cart
async function viewCart(event) {
  try {
    const response = await fetch("/cart?user_id=user1");
    if (!response.ok) {
      throw new Error("Failed to fetch the cart data.");
    }

    const cartData = await response.json();
    updateCart(cartData);
  } catch (error) {
    console.error(error.message);
  }
}

// Add event listener to the product form for submitting new products
document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  productForm.addEventListener("submit", addProduct);
});

// Add event listener to the view cart button
document.addEventListener("DOMContentLoaded", () => {
  const viewCartButton = document.getElementById("view-cart-btn");
  viewCartButton.addEventListener("click", viewCart);
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registration-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const address = document.getElementById("address").value; // New: Capture address value

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Create a FormData object and append form data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address); // New: Append address to form data

    // Send a POST request to the server
    fetch("/register", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Redirect to the login page after successful registration
        window.location.href = "/signin"; // Redirect to the login page
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send a POST request to the server
    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Redirect the user to the home page with the user_id parameter
        window.location.href = `/?user_id=${data.user_id}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("login-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Send a POST request to the server
    fetch("/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Redirect the user to the home page with the user_id parameter
        window.location.href = `/?user_id=${data.user_id}`;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const userId = getUserIdFromUrl(); // Get user ID from URL params

  // Function to fetch cart products from the server
  async function fetchCartProducts(userId) {
    try {
      const response = await fetch(`/cart?user_id=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cart products.");
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  // Function to display cart products in the UI
  function displayCartProducts(products) {
    // Display cart products in the UI
    const cartProductsContainer = document.getElementById("cart-products");
    cartProductsContainer.innerHTML = ""; // Clear existing products

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const productName = document.createElement("h2");
      productName.textContent = product.name;

      const productDescription = document.createElement("p");
      productDescription.textContent = product.description;

      const productPrice = document.createElement("p");
      productPrice.textContent = `Price: $${product.price}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => handleDelete(product._id));

      productCard.appendChild(productName);
      productCard.appendChild(productDescription);
      productCard.appendChild(productPrice);
      productCard.appendChild(deleteButton);

      cartProductsContainer.appendChild(productCard);
    });

    // Remove previous event listeners from delete buttons
    const previousDeleteButtons = document.querySelectorAll(
      ".product-card button"
    );
    previousDeleteButtons.forEach((button) => {
      button.removeEventListener("click", handleDelete);
    });
  }

  // Function to handle the click event on the delete button
  async function handleDelete(productId) {
    const deleteConfirmationModal = document.getElementById(
      "deleteConfirmationModal"
    );
    deleteConfirmationModal.style.display = "block";

    // Handle click on the close button of the modal
    const closeButton = document.querySelector(
      "#deleteConfirmationModal .close"
    );
    closeButton.addEventListener("click", () => {
      deleteConfirmationModal.style.display = "none";
    });

    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    confirmDeleteButton.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `/delete_from_cart?user_id=${userId}&product_id=${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product from cart.");
        }

        const products = await fetchCartProducts(userId);
        displayCartProducts(products);

        deleteConfirmationModal.style.display = "none";
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete product from cart.");
      }
    });
  }

  // Function to get user ID from URL parameters
  function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("user_id");
  }

  // Fetch user transactions from the server
  async function fetchTransactions(userId) {
    try {
      const response = await fetch(`/transactions?user_id=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user transactions.");
      }
      const data = await response.json();
      return data.transactions;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  // Function to display user transactions in the UI
  function displayTransactions(transactions) {
    // Display transactions in the UI
    const transactionsContainer = document.getElementById("transactions");
    transactionsContainer.innerHTML = ""; // Clear existing transactions

    transactions.forEach((transaction) => {
      const transactionItem = document.createElement("div");
      transactionItem.classList.add("transaction-item");

      const transactionInfo = document.createElement("p");
      transactionInfo.textContent = `Transaction ID: ${transaction.id}, Amount: $${transaction.amount}`;

      transactionItem.appendChild(transactionInfo);
      transactionsContainer.appendChild(transactionItem);
    });
  }

  // Fetch cart products and display them when the DOM is loaded
  fetchCartProducts(userId)
    .then((products) => {
      displayCartProducts(products);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  // Fetch user transactions and display them when the DOM is loaded
  fetchTransactions(userId)
    .then((transactions) => {
      displayTransactions(transactions);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.addEventListener("DOMContentLoaded", () => {
  const userId = getUserIdFromUrl(); // Get user ID from URL params

  // Function to fetch cart products from the server
  async function fetchCartProducts(userId) {
    try {
      const response = await fetch(`/cart?user_id=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch cart products.");
      }
      const data = await response.json();
      return data.products;
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  }

  // Function to display cart products in the UI
  function displayCartProducts(products) {
    // Display cart products in the UI
    const cartProductsContainer = document.getElementById("cart-products");
    cartProductsContainer.innerHTML = ""; // Clear existing products

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      const productName = document.createElement("h2");
      productName.textContent = product.name;

      const productDescription = document.createElement("p");
      productDescription.textContent = product.description;

      const productPrice = document.createElement("p");
      productPrice.textContent = `Price: $${product.price}`;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => handleDelete(product._id));

      productCard.appendChild(productName);
      productCard.appendChild(productDescription);
      productCard.appendChild(productPrice);
      productCard.appendChild(deleteButton);

      cartProductsContainer.appendChild(productCard);
    });

    // Add checkout and back buttons
    const totalAmountContainer = document.getElementById("total-amount");

    // Add checkout button
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Checkout";
    checkoutButton.classList.add("checkout-button");
    checkoutButton.style.fontSize = "12px"; // Smaller font size
    checkoutButton.style.backgroundColor = "#007bff"; // Different color
    checkoutButton.addEventListener("click", handleCheckout);

    // Add back button
    const backButton = document.createElement("button");
    backButton.textContent = "Back";
    backButton.classList.add("back-button");
    backButton.style.fontSize = "12px"; // Smaller font size
    backButton.style.backgroundColor = "#6c757d"; // Different color
    backButton.addEventListener("click", () => {
      window.location.href = `/?user_id=${userId}`;
    });

    // Append buttons to the total amount container
    totalAmountContainer.appendChild(checkoutButton);
    totalAmountContainer.appendChild(backButton);
  }// Function to display cart products in the UI
function displayCartProducts(products) {
  // Display cart products in the UI
  const cartProductsContainer = document.getElementById("cart-products");
  cartProductsContainer.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const productName = document.createElement("h2");
    productName.textContent = product.name;

    const productDescription = document.createElement("p");
    productDescription.textContent = product.description;

    const productPrice = document.createElement("p");
    productPrice.textContent = `Price: $${product.price}`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => handleDelete(product._id));

    productCard.appendChild(productName);
    productCard.appendChild(productDescription);
    productCard.appendChild(productPrice);
    productCard.appendChild(deleteButton);

    cartProductsContainer.appendChild(productCard);
  });

  // Clear existing buttons before adding new ones
  const totalAmountContainer = document.getElementById("total-amount");
  totalAmountContainer.innerHTML = "";

  // Add checkout and back buttons
  const checkoutButton = document.createElement("button");
  checkoutButton.textContent = "Checkout";
  checkoutButton.classList.add("checkout-button");
  checkoutButton.style.fontSize = "12px"; // Smaller font size
  checkoutButton.style.backgroundColor = "#007bff"; // Different color
  checkoutButton.addEventListener("click", handleCheckout);

  const backButton = document.createElement("button");
  backButton.textContent = "Back";
  backButton.classList.add("back-button");
  backButton.style.fontSize = "12px"; // Smaller font size
  backButton.style.backgroundColor = "#6c757d"; // Different color
  backButton.addEventListener("click", () => {
    window.location.href = `/?user_id=${userId}`;
  });

  // Append buttons to the total amount container
  totalAmountContainer.appendChild(checkoutButton);
  totalAmountContainer.appendChild(backButton);
}

  // Function to handle the click event on the checkout button
  // Function to handle the click event on the checkout button
  async function handleCheckout() {
    try {
      const products = await fetchCartProducts(userId);
      const productIds = products.map((product) => product._id); // Extract product IDs
      const requestBody = {
        user_id: userId,
        products: productIds,
      };

      const response = await fetch("/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Failed to complete checkout.");
      }

      // Delete all products from the user's cart
      await deleteProductsFromCart(productIds);

      const responseData = await response.json();
      alert(responseData.message); // Display success message

      // Redirect to home page with user ID in URL params
      window.location.href = `/?user_id=${userId}`;
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to complete checkout.");
    }
  }

  async function deleteProductsFromCart(productIds) {
    try {
      const response = await fetch("/delete_products_from_cart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_ids: productIds }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete products from cart.");
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("Failed to delete products from cart.");
    }
  }
  // Function to handle the click event on the delete button
  async function handleDelete(productId) {
    const deleteConfirmationModal = document.getElementById(
      "deleteConfirmationModal"
    );
    deleteConfirmationModal.style.display = "block";

    const closeButton = document.querySelector(
      "#deleteConfirmationModal .close"
    );
    closeButton.addEventListener("click", () => {
      deleteConfirmationModal.style.display = "none";
    });

    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    confirmDeleteButton.addEventListener("click", async () => {
      try {
        const response = await fetch(
          `/delete_from_cart?user_id=${userId}&product_id=${productId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete product from cart.");
        }

        const products = await fetchCartProducts(userId);
        displayCartProducts(products);

        deleteConfirmationModal.style.display = "none";
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to delete product from cart.");
      }
    });
  }

  // Function to get user ID from URL parameters
  function getUserIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("user_id");
  }

  // Fetch cart products and display them when the DOM is loaded
  fetchCartProducts(userId)
    .then((products) => {
      displayCartProducts(products);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);

  return urlParams.get("user_id");
}

async function fetchUserData(user_id) {
  try {
    const response = await fetch(`user_info?user_id=${user_id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch user data.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function displayUser(user) {
  const profileInfo = document.getElementById("profile-info");

  if (!user || !user.user_info) {
    profileInfo.innerHTML = "<p>Failed to load user data.</p>";
    return;
  }

  const userData = user.user_info;

  // Display user data using template literals
  profileInfo.innerHTML = `
    <p><strong>Username:</strong> ${userData.username}</p>
    <p><strong>Email:</strong> ${userData.email}</p>
    <p><strong>Address:</strong> ${userData.address}</p>
    <p><strong>Phone:</strong> ${userData.phone}</p>
  `;

  // Create a back button
  const backButton = document.createElement("a");
  backButton.textContent = "Back";
  backButton.classList.add("backBtn");
  backButton.href = "/?user_id=" + userData.user_id;

  // Append the back button to the profile info
  profileInfo.appendChild(backButton);
}

document.addEventListener("DOMContentLoaded", () => {
  const user_id = getUserIdFromUrl(); // Get user ID from URL params

  // Fetch user data and display it
  fetchUserData(user_id)
    .then((userData) => {
      displayUser(userData);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const editProfileForm = document.getElementById("edit-profile-form");
  const cancelEditBtn = document.getElementById("cancel-edit-btn");

  // Function to populate form fields with existing user data
  function populateFormFields(userData) {
    document.getElementById("username").value = userData.username;
    document.getElementById("email").value = userData.email;
    document.getElementById("phone").value = userData.phone;
    document.getElementById("address").value = userData.address;
  }

  editProfileBtn.addEventListener("click", function () {
    // Hide profile info
    document.getElementById("profile").style.display = "none";
    // Show edit profile form
    editProfileForm.style.display = "block";

    // Assuming you have access to the user ID
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");

    // Fetch user data from the server
    fetch(`/user_data?user_id=${userId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((userData) => {
        // Populate form fields with existing user data
        populateFormFields(userData);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Optionally, display an error message to the user
      });
  });

  // Hide edit profile form and show profile when cancel button is clicked
  cancelEditBtn.addEventListener("click", function () {
    // Show profile
    document.getElementById("profile").style.display = "block";
    // Hide edit profile form
    editProfileForm.style.display = "none";
  });

  // Reload the page after successfully updating user profile
  function reloadPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user_id");
    window.location.href = `/profile?user_id=${userId}`;
  }

  // Handle response from server after updating user profile
  function handleUpdateResponse(responseData) {
    if (
      responseData &&
      responseData.message === "User profile updated successfully"
    ) {
      // Reload the page
      reloadPage();
    } else {
      console.error("Failed to update user profile.");
      // Optionally, display an error message to the user
    }
  }

  // Assuming you have a function to handle the form submission and send the request to the server
  // Replace this with your actual form submission logic
  function submitProfileUpdateForm(formData) {
    // Send the form data to the server
    fetch("/update_profile", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        // Handle the response from the server
        handleUpdateResponse(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Optionally, display an error message to the user
      });
  }

  // Assuming you have a function to handle form submission
  // Replace 'submitProfileUpdateForm' with your actual function name
  document
    .getElementById("update-profile-form")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      submitProfileUpdateForm(formData);
    });
});
