namespace API.Entities
{
    // In the Basket entity we have a list of basketItems, for each basket
    // it has many items (this is one-to-many relationship)
    public class Basket
    {
       public int Id { get; set; } 
       // Allow users to add items to their basket without
       // signing in, give random generated id, so that we 
       // can keep a track of who's basket belongs to who.
       public string BuyerId { get; set; }
       // List of items they have inside their basket and initialize a new
       // list of basketItems whenever we create a new basket and this help
       // us prevent any list being undefined
       public List<BasketItem> Items { get; set; } = new List<BasketItem>();


       public void AddItem(Product product, int quantity) 
       {
        // Check to see the product is not in our list of items
        if (Items.All(item => item.ProductId != product.Id))
        {
            // Add a new item to the list
            Items.Add(new BasketItem
            {
                Product = product, Quantity = quantity
            }
            );
        }

            var existingItem = Items.FirstOrDefault(item => item.ProductId == product.Id);
            if (existingItem != null) existingItem.Quantity += quantity;
       }

       public void RemoveItem(int productId, int quantity) 
       {
        // Get the item based on the product id
        var item = Items.FirstOrDefault(item => item.ProductId == productId);
        if (item == null) return;
        // Reduce quantity
        item.Quantity -= quantity;
        // If quantity is zero then remove from the list
        if (item.Quantity == 0) Items.Remove(item);
       }
    }
}