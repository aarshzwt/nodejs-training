function mailTemplate({ orderDetails }) {
    console.log("fetched orderDetails", orderDetails);
  return `
   <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
  <style>
    body {
      background-color: #f9fafb;
      font-family: 'Arial', sans-serif;
    }
    .min-h-screen {
      min-height: 100vh;
    }
    .bg-gray-50 {
      background-color: #f9fafb;
    }
    .py-12 {
      padding-top: 3rem;
      padding-bottom: 3rem;
    }
    .px-4 {
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .sm\:px-6 {
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
    .lg\:px-8 {
      padding-left: 2rem;
      padding-right: 2rem;
    }
    .max-w-4xl {
      max-width: 48rem;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .bg-white {
      background-color: #ffffff;
    }
    .rounded-lg {
      border-radius: 0.5rem;
    }
    .shadow-lg {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .p-8 {
      padding: 2rem;
    }
    .text-center {
      text-align: center;
    }
    .mb-8 {
      margin-bottom: 2rem;
    }
    .h-12 {
      height: 3rem;
    }
    .w-12 {
      width: 3rem;
    }
    .bg-green-100 {
      background-color: #d1fae5;
    }
    .rounded-full {
      border-radius: 9999px;
    }
    .flex {
      display: flex;
    }
    .items-center {
      align-items: center;
    }
    .justify-center {
      justify-content: center;
    }
    .mx-auto {
      margin-left: auto;
      margin-right: auto;
    }
    .mb-4 {
      margin-bottom: 1rem;
    }
    .h-6 {
      height: 1.5rem;
    }
    .w-6 {
      width: 1.5rem;
    }
    .text-green-600 {
      color: #16a34a;
    }
    .text-3xl {
      font-size: 1.875rem;
    }
    .font-bold {
      font-weight: 700;
    }
    .text-gray-900 {
      color: #1f2937;
    }
    .text-gray-600 {
      color: #4b5563;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
    .border-t {
      border-top-width: 1px;
    }
    .border-b {
      border-bottom-width: 1px;
    }
    .border-gray-200 {
      border-color: #e5e7eb;
    }
    .py-4 {
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    .grid {
      display: grid;
    }
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    .md\:grid-cols-3 {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
    .gap-4 {
      gap: 1rem;
    }
    .text-sm {
      font-size: 0.875rem;
    }
    .font-semibold {
      font-weight: 600;
    }
    .ml-4 {
      margin-left: 1rem;
    }
    .flex-1 {
      flex: 1;
    }
    .text-gray-600 {
      color: #4b5563;
    }
    .font-semibold {
      font-weight: 600;
    }
    .text-lg {
      font-size: 1.125rem;
    }
    .space-y-2 {
      margin-top: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .justify-between {
      justify-content: space-between;
    }
    .border-t {
      border-top-width: 1px;
    }
    .pt-2 {
      padding-top: 0.5rem;
    }
    .mt-2 {
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div class="text-center mb-8">
        <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8.293 9.293a1 1 0 011.414 0l2 2 4-4a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
        <p class="text-gray-600 mt-2">Thank you for your purchase</p>
      </div>

      <div class="border-t border-b border-gray-200 py-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p class="text-sm text-gray-600">Order Number</p>
            <p class="font-semibold">${orderDetails.order.id}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Order Date</p>
            <p class="font-semibold">${new Date(orderDetails.order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Estimated Delivery</p>
            <p class="font-semibold">${new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      
         <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Order Summary</h2>
        ${orderDetails?.order?.OrderItems && orderDetails.order.OrderItems.length > 0 ? (
          orderDetails.order.OrderItems.map((product) => {
            return `
              <div class="flex items-center py-4 border-b border-gray-200">
                <img
                  src="http://localhost:5000${product.Product.image_url}"
                  alt="${product.Product.name}"
                  class="h-20 w-20 object-cover rounded-lg"
                  onError="this.src='https://images.unsplash.com/photo-1580870069867-74c57ee1bb07'"
                />
                <div class="ml-4 flex-1">
                  <h3 class="font-medium">${product.Product.name}</h3>
                  <p class="text-gray-600">Quantity: ${product.quantity}</p>
                </div>
                <p class="font-semibold">
                  ₹${(product.price * product.quantity).toFixed(2)}
                </p>
              </div>
            `;
          }).join('')
        ) : (
          '<p>No items found in your order.</p>'
        )}
      </div>

      <div class="bg-gray-50 rounded-lg p-6 mb-8">
        <div class="space-y-2">
          <div class="flex justify-between">
            <p class="text-gray-600">Subtotal</p>
            <p class="font-medium"> ₹${parseFloat(orderDetails?.order?.total_price).toFixed(2)}</p>
          </div>
          <div class="flex justify-between">
            <p class="text-gray-600">Tax</p>
            <p class="font-medium">0.00</p>
          </div>
          <div class="flex justify-between">
            <p class="text-gray-600">Shipping</p>
            <p class="font-medium">FREE</p>
          </div>
          <div class="border-t border-gray-200 pt-2 mt-2">
            <div class="flex justify-between">
              <p class="text-lg font-semibold">Total</p>
              <p class="text-lg font-semibold">₹${parseFloat(orderDetails?.order?.total_price).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>

  `;
}

module.exports = mailTemplate;