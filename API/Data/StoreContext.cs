using Microsoft.EntityFrameworkCore;
using API.Entities;

namespace API.Data
{
    //A DbContext instance represents a session with the database 
    //and can be used to query and save instances of your entitie
    //We can use it to add new product, to remove a product from
    //our database or to update a product or get a list of products
    //We do not query to DB directly, we go via the DBContext and
    //that's responsible for translating our C# code into SQL quries
    public class StoreContext : DbContext
    {
        //This class is deriving from a DBContext class and the base
        //class is DBContext
        public StoreContext(DbContextOptions options): base(options)
        {

        }
        //This DbSet respresent a table in our database
        public DbSet<Product> Products { get; set; }
    }
}