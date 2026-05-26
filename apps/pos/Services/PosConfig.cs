using System.IO;

namespace pos.Services;

/// <summary>Reads appsettings.json so the API base URL can be changed without recompiling.</summary>
public static class PosConfig
{
    public static string ApiBaseUrl { get; private set; } = "http://localhost:8000/api/v1";

    static PosConfig()
    {
        try
        {
            var path = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "appsettings.json");
            if (!File.Exists(path)) return;

            var json = File.ReadAllText(path);
            var doc  = System.Text.Json.JsonDocument.Parse(json);
            if (doc.RootElement.TryGetProperty("ApiBaseUrl", out var val))
                ApiBaseUrl = val.GetString() ?? ApiBaseUrl;
        }
        catch { /* use default */ }
    }
}
