using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities
{
    // We have relationship between the basketItem and the Product
    // Now each basketItem is going to have one-to-one relationship
    // with product itself. 
    [Table("BasketItems")]
    public class BasketItem
    {
        public int Id { get; set; } // Auto-generated id
        public int Quantity { get; set; }
        // Need a relation between our basketItem and the product
        // navigation properties
        public int ProductId { get; set; }
        public Product Product {get; set;}

        public int BasketId { get; set; }
        public Basket Basket {get; set;}
    }
}