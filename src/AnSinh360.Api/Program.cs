var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
// Process liveness only; does not claim PostgreSQL readiness or dataset import completion.
app.MapGet("/health", () => Results.Ok(new { status = "healthy", service = "AnSinh360.Api", phase = 1, check = "liveness" }));
app.Run();

public partial class Program;
