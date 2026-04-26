# Saanjh Security Specification

## Data Invariants
1. A review must belong to an existing product.
2. A user can only write reviews for products they have purchased (optional, but 1 review per user per product).
3. Orders can only be read by the owner or an admin.
4. Product inventory can only be updated by admins.

## The Dirty Dozen (Test Cases)
1. Unauthenticated user attempts to create a product. (Denied)
2. User attempts to update a product price. (Denied)
3. User attempts to read another user's order. (Denied)
4. User attempts to write a review for a non-existent product. (Denied)
5. User attempts to set rating > 5. (Denied)
6. Fake admin attempts to delete a product. (Denied)
7. User attempts to change his own order status to "delivered". (Denied)
8. User attempts to spoof `authorId` in a review. (Denied)
9. User attempts to write a 1MB string into product name. (Denied)
10. User attempts to read the list of all orders. (Denied)
11. User attempts to delete a review they didn't write. (Denied)
12. User attempts to create an order with negative total. (Denied)
