using pos.Models;

namespace pos.Services;

/// <summary>
/// Static holder for the authenticated cashier session.
/// Set once on login, read everywhere in the app.
/// </summary>
public static class SessionManager
{
    public static string?   AccessToken { get; set; }
    public static UserInfo? Cashier     { get; set; }

    public static bool IsAuthenticated => !string.IsNullOrEmpty(AccessToken) && Cashier != null;

    public static void Clear()
    {
        AccessToken = null;
        Cashier     = null;
    }
}
