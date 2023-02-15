//defines a namespace named API.Entities. A namespace is a way to 
//organize code into logical groups and prevent naming conflicts 
//between different code elements that have the same name
namespace API.Entities
{
    //In Entity Framework, an entity type is a class that represents 
    //a database table or view, and provides a way to map between the 
    //database schema and the .NET objects used in your code. An entity 
    //type can be defined in your C# code as a regular class, with 
    //properties that correspond to the columns of the database table.
    public class Product
    {
        public int Id { get; set; }  
        public string Name { get; set; } 
        public string Description { get; set; }
        public long Price { get; set; }
        public string PictureUrl { get; set; }
        public string Type  { get; set; }
        public string Brand { get; set; }
        public int QuantityInStock { get; set; }
    }
}