const INVENTORY_LOCATORS = {
  selectors: {
    pageTitle: { type: 'css', value: '.title' },
    addToCartBackpack: { type: 'id', value: 'add-to-cart-sauce-labs-backpack' },
    cartBadge: { type: 'css', value: '.shopping_cart_badge' },
    cartLink: { type: 'css', value: '.shopping_cart_link' },
    checkoutButton: { type: 'id', value: 'checkout' },
    firstName: { type: 'id', value: 'first-name' },
    lastName: { type: 'id', value: 'last-name' },
    postalCode: { type: 'id', value: 'postal-code' },
    continueButton: { type: 'id', value: 'continue' },
    finishButton: { type: 'id', value: 'finish' },
    completeHeader: { type: 'css', value: '.complete-header' }
  }
};
module.exports = INVENTORY_LOCATORS;