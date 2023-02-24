using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        // Return Http error response and on the client, we can deal
        // with whatever error response.
        [HttpGet("not-found")] //unique route
        public ActionResult GetNotFound() 
        {
            // if we did not find something (send 404 response)
            return NotFound();
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() 
        {
            // client side bad request (send 400 response). The curly braces
            // in ProblemDetails object initialization represent an object 
            // initializer and allow you to create an object and set its 
            // properties in a single statement
            return BadRequest(new ProblemDetails{Title = "This is a bad request 2"});
        }

        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorised() 
        {
            // if user is not authenticated or have access to the resources 
            // (send 401 response)
            return Unauthorized();
        }

        [HttpGet("validation-error")]
        public ActionResult GetValidationError() 
        {
            // User filling a form, haven't supplied the required fields 
            // that we're looking for. Add error manually, it also return 
            // a 400 bad request and an array of errors
            ModelState.AddModelError("Problem1", "This is the first error");
            ModelState.AddModelError("Problem2", "This is the second error");
            return ValidationProblem();
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError() 
        {
            // Throw a new Exception
            throw new Exception("This is a server error");
        }
        
    }
}