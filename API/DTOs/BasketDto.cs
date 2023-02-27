
namespace API.DTOs
{
    // Create object that shape our data, that we are going
    // to return (Data Transfer object), they are simple plain
    // object that contains properties that we want to extract
    // from our entities and return with our response. So instead
    // of returning Basket from the controller, we return from dto
    public class BasketDto
    {
        public int Id { get; set; }
        public string BuyerId { get; set; } 
        public List<BasketItemDto> items { get; set; }  
    }
}