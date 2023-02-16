
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    // specify the base URL for the API controller. In this case, the "[controller]" 
    //placeholder is used to specify that the name of the controller should be 
    //included in the URL. For example, if the name of the controller is 
    //ProductsController, the base URL for the controller will be "/api/products".
    [Route("api/[controller]")]
    public class ProductsController: ControllerBase
    {
        private readonly StoreContext context;
        public ProductsController(StoreContext context) 
        {
            //represents the data context for the web application, 
            //which provides access to the database
            this.context = context;
        }
        
        //We must specify the of result we are returning
        [HttpGet]
        //The GetProducts method returns a list of all products in the 
        //database in response to an HTTP GET request to the associated URL
        public async Task<ActionResult<List<Product>>> GetProducts() 
        {
            //to retrieve all products from the database and return 
            //them as a list of Product objects
            var products = await context.Products.ToListAsync();
            //return HTTP 200 OK along with the list of products
            return Ok(products); 
        }

        [HttpGet("{id}")] // api/products/3
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            return await context.Products.FindAsync(id);
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