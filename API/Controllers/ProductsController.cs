
using API.Data;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class ProductsController: BaseApiController
    {
        private readonly StoreContext context;
        public ProductsController(StoreContext context) 
        {
            //represents the data context for the web application, 
            //which provides access to the database
            this.context = context;
        }
        
        //We must specify the of result we are returning
        [HttpGet] // api/products
        // if we do not specify a route parameter for the HTTP, then the API controller
        // is going to assume that we want to pass this "orderBy" as a query string value
        public async Task<ActionResult<List<Product>>> GetProducts(string orderBy, 
            string searchTerm) 
        {
            // convert  an array into an IQueryable object, it provide a additional
            // functionailty to enable querying data from the data source or collection 
            // in more efficent manner. (filter, sort, group) 
            var query = context.Products.Sort(orderBy).Search(searchTerm).AsQueryable();
            // query passed as first parameter to Sort & query string value as second
            // var sortedQuery = query.Sort(orderBy);
            // execute our query against the database & return the sorted products
            return await query.ToListAsync();
        }

        [HttpGet("{id}")] // api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await context.Products.FindAsync(id);
            if (product == null) return NotFound();
            return product;
        }
 
    }
}

/*
    In .NET, ActionResult is a class that represents the result of an action method 
    in an MVC or Web API controller. An action method is a method that handles a 
    request from a client and returns a response.

    ActionResult is used to represent different types of HTTP responses that a 
    controller can return. For example, a controller method might return an OkResult 
    with an HTTP status code of 200 to indicate that the request was successful, or 
    a BadRequestResult with a status code of 400 to indicate that the client sent an 
    invalid request.

    By returning an ActionResult from a controller method, you can control the HTTP 
    response that is sent back to the client. You can set the response status code, 
    add headers, and include a response body, depending on the specific type of 
    ActionResult that you return.

    In addition to the built-in ActionResult types, you can also create custom 
    ActionResult classes to handle specific types of responses.

    Using ActionResult allows you to have more control over the HTTP responses that 
    your application sends back to clients, and can make your code more modular and 
    maintainable.
*/