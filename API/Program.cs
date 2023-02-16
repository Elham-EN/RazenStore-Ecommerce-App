// Main program file to run the application
using API.Data;
using Microsoft.EntityFrameworkCore;
// Host and run our dotnet application (Setup web server)
var builder = WebApplication.CreateBuilder(args);

// Add services to the container(This also refer to dependency injection container)
// When we want to use particular service inside one of our classes in our project
// then we are going to use the facility called DIC to inject service to be available
// to be used in our application.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<StoreContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddCors();

// Build our application and store the result of that in the app var
var app = builder.Build();

// Configure the HTTP request pipeline. Inside the http request pipeline, as a request 
// comes into our API, is handled by our API and then in response is sent out of our 
// API. This give us the opportunity to add middleware to this request and use it in
// various stages inside the pipeline against that request and we can do something with
// that request. 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors(opt => 
{
    opt.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:5173");
});
app.UseAuthorization();

// Configures routing for controllers in an application. controllers are responsible
// for handling HTTP requests and generating HTTP responses. MapControllers() is a 
// method that maps incoming HTTP requests to the appropriate controller action methods 
// based on the routing rules you have defined.
app.MapControllers();

//The idea behind this we need to get hold of our DBContext service, but we cannot inject
//our storecontext into this class
var scope = app.Services.CreateScope();
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
//Log any error
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
try
{
    //When you make changes to your model and create a new migration using the 
    //dotnet ef migrations add command, the migration is added to the database 
    //but not applied until you explicitly call context.Database.Migrate() or 
    //run the dotnet ef database update command
    context.Database.Migrate();
    DbInitializer.Initialize(context);
}
catch (Exception ex)
{
    logger.LogError(ex, "A problem occured during migration");
}

app.Run();
