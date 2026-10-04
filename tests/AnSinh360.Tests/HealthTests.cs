using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace AnSinh360.Tests;

public sealed class HealthTests
{
    [Fact]
    public async Task Health_returns_process_liveness_without_a_database()
    {
        await using var app = new WebApplicationFactory<Program>();
        using var client = app.CreateClient();
        var response = await client.GetAsync("/health");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("healthy", body.RootElement.GetProperty("status").GetString());
        Assert.Equal("liveness", body.RootElement.GetProperty("check").GetString());
        Assert.Equal(1, body.RootElement.GetProperty("phase").GetInt32());
    }
}
