
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace API.Middleware
{
    // Exception Handling Middleware
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        // RequestDelegate - may generate an HTTP response or pass the 
        // request along to the next middleware component in the pipeline
        // ILogger for logging messages, The ExceptionMiddleware is a middleware
        // component that is responsible for catching unhandled exception that occur
        // during the process of an HTTP request and generating an approraite HTTP
        // Response. 
        public ExceptionMiddleware(RequestDelegate next, 
            ILogger<ExceptionMiddleware> logger, IHostEnvironment env) 
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        // Goal: Catch any exceptions inside our application
        public async Task InvokeAsync(HttpContext context) 
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = 500;
                var response = new ProblemDetails
                {
                    Status = 500,
                    Detail = _env.IsDevelopment() ? ex.StackTrace?.ToString() : null,
                    Title = ex.Message
               };
               //Create options for JSON Serializer, we are returing our format in JSON
               //format (because we are outside the context of an API controller, we 
               //lose some of the defualts that does for us.)
               var options = new JsonSerializerOptions
               {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
               };
               var json = JsonSerializer.Serialize(response, options);
               await context.Response.WriteAsync(json);
            }
        } 
    }
}