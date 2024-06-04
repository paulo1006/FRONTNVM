const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const updateProductId = document.querySelector('#update-id');
const updateProductName = document.querySelector('#update-name');
const updateProductPrice = document.querySelector('#update-price');

// Function to fetch all products from the server
async function fetchProducts() {
  try {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();

    // Clear product list
    productList.innerHTML = '';

    // Add each product to the list
    products.forEach(product => {
      const li = document.createElement('li');
      li.innerHTML = `${product.name} - $${product.price}`;

      // Add delete button for each product
      const deleteButton = document.createElement('button');
      deleteButton.innerHTML = 'Delete';
      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
        await fetchProducts();
      });
      li.appendChild(deleteButton);

      // Add update button for each product
      const updateButton = document.createElement('button');
      updateButton.innerHTML = 'Update';
      updateButton.addEventListener('click', () => {
        updateProductId.value = product.id;
        updateProductName.value = product.name;
        updateProductPrice.value = product.price;
      });
      li.appendChild(updateButton);

      productList.appendChild(li);
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}

// Event listener for Add Product form submit button
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const name = addProductForm.elements['name'].value;
  const price = addProductForm.elements['price'].value;
  await addProduct(name, price);
  addProductForm.reset();
  await fetchProducts();
});

// Event listener for Update Product form submit button
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();
  const id = updateProductId.value;
  const name = updateProductName.value;
  const price = updateProductPrice.value;
  await updateProduct(id, name, price);
  updateProductForm.reset();
  await fetchProducts();
});

// Function to add a new product
async function addProduct(name, price) {
  try {
    const response = await fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price })
    });
    return response.json();
  } catch (error) {
    console.error('Failed to add product:', error);
  }
}

// Function to delete a product
async function deleteProduct(id) {
  try {
    const response = await fetch('http://localhost:3000/products/' + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.json();
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
}

// Function to update a product
async function updateProduct(id, name, price) {
  try {
    const response = await fetch('http://localhost:3000/products/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, price })
    });
    return response.json();
  } catch (error) {
    console.error('Failed to update product:', error);
  }
}

// Fetch all products on page load
fetchProducts();
