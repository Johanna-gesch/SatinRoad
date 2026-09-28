using API;
using Infra;
using Infra.Entities;
using LinqToDB;
using Service;

var builder = WebApplication.CreateBuilder(args);
var connectionString = "Data Source=dev.db";
var options= new DataOptions().UseSQLite(connectionString);
var dataOptions = new DataOptions<MyDataConnection>(options);


builder.Services.AddScoped<MyDataConnection>(_ => new MyDataConnection(dataOptions));

builder.Services.AddScoped<ProductService>();

builder.Services.AddScoped<IRepository<Product>, ProductRepository>();

builder.Services.AddExceptionHandler<ProblemExceptionHandler>();
builder.Services.AddOpenApiDocument(settings => settings.SchemaSettings.SchemaProcessors.Add(new RequireNotNullableSchemaProcessor()));

builder.Services.AddCors();
builder.Services.AddProblemDetails();

builder.Services.AddScoped<MySeeder>();

builder.Services.AddScoped<IRepository<Category>, CategoryRepository>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(_ => true));

app.UseOpenApi();

app.UseSwaggerUi();

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<MySeeder>();
    seeder.Seed();
}

app.MapControllers();

app.Run();