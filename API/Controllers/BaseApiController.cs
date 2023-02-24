
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    //specify the base URL for the API controller. In this case, the "[controller]" 
    //placeholder is used to specify that the name of the controller should be 
    //included in the URL. For example, if the name of the controller is 
    //ProductsController, the base URL for the controller will be "/api/products".
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        
    }
}