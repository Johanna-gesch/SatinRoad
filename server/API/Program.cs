using Infra;
using LinqToDB;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "Data Source=dev.db";

var options= new DataOptions().UseSQLite(connectionString);

var dataOptions = new DataOptions<MyDataConnection>(options);

builder.Services.AddScoped<MyDataConnection>(_ => new MyDataConnection(dataOptions));

//Create services here

builder.Services.AddOpenApiDocument(settings => settings.SchemaSettings.SchemaProcessors.Add(new RequireNotNullableSchemaProcessor()));

builder.Services.AddCors();

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors(config => config.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin().SetIsOriginAllowed(_ => true));

app.UseOpenApi();

app.UseSwaggerUi();

//Create tables here

app.MapControllers();

app.Run();