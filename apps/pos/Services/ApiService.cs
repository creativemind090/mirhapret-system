using pos.Models;
using RestSharp;
using Newtonsoft.Json;

namespace pos.Services;

/// <summary>
/// Singleton HTTP client that talks to the MirhaPret backend API.
/// All methods return null / empty on failure so callers can show user-friendly errors.
/// </summary>
public class ApiService
{
    private static ApiService? _instance;
    public static ApiService Instance => _instance ??= new ApiService();

    private readonly RestClient _client;

    private ApiService()
    {
        var options = new RestClientOptions(PosConfig.ApiBaseUrl)
        {
            ThrowOnAnyError = false,
        };
        _client = new RestClient(options);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private RestRequest AuthRequest(string resource, Method method = Method.Get)
    {
        var req = new RestRequest(resource, method);
        if (!string.IsNullOrEmpty(SessionManager.AccessToken))
            req.AddHeader("Authorization", $"Bearer {SessionManager.AccessToken}");
        return req;
    }

    // ── Auth ─────────────────────────────────────────────────────────────────

    /// <summary>Returns (token, user) on success, (null, null) on failure.</summary>
    public async Task<(string? token, UserInfo? user, string? error)> LoginAsync(string email, string password)
    {
        var req = new RestRequest("/auth/login", Method.Post);
        req.AddJsonBody(new { email, password });

        RestResponse res;
        try
        {
            res = await _client.ExecuteAsync(req);
        }
        catch (Exception ex)
        {
            return (null, null, $"Cannot connect to server: {ex.Message}");
        }

        if (!res.IsSuccessful || res.Content == null)
        {
            var errMsg = TryExtractMessage(res.Content)
                      ?? $"Server error {(int?)res.StatusCode}: {res.ErrorMessage ?? res.Content ?? "No response"}";
            return (null, null, errMsg);
        }

        var wrapper = JsonConvert.DeserializeObject<ApiResponse<LoginResponseData>>(res.Content);
        var data = wrapper?.Data;
        if (data == null) return (null, null, "Unexpected response from server");

        // Only allow cashier / admin roles to log into POS
        var role = data.User.Role;
        if (role != "cashier" && role != "admin" && role != "super_admin" && role != "store_manager")
            return (null, null, "Access denied. Only cashiers can log in to POS.");

        return (data.AccessToken, data.User, null);
    }

    // ── Products ─────────────────────────────────────────────────────────────

    /// <summary>Loads all active products (up to 200). Used to warm local cache.</summary>
    public async Task<List<ApiProduct>> GetAllProductsAsync()
    {
        var req = new RestRequest("/products");
        req.AddQueryParameter("is_active", "true");
        req.AddQueryParameter("take", "200");

        var res = await _client.ExecuteAsync(req);
        if (!res.IsSuccessful || res.Content == null) return new();

        var wrapper = JsonConvert.DeserializeObject<PaginatedApiResponse<ApiProduct>>(res.Content);
        return wrapper?.Data ?? new();
    }

    // ── Categories ────────────────────────────────────────────────────────────

    /// <summary>Loads all active categories.</summary>
    public async Task<List<ApiCategory>> GetCategoriesAsync()
    {
        var req = new RestRequest("/categories");
        req.AddQueryParameter("is_active", "true");

        var res = await _client.ExecuteAsync(req);
        if (!res.IsSuccessful || res.Content == null) return new();

        var wrapper = JsonConvert.DeserializeObject<PaginatedApiResponse<ApiCategory>>(res.Content);
        return wrapper?.Data ?? new();
    }

    // ── Customer lookup ───────────────────────────────────────────────────────

    /// <summary>Searches for a customer by phone number. Returns null if not found.</summary>
    public async Task<ApiCustomer?> GetCustomerByPhoneAsync(string phone)
    {
        var req = AuthRequest("/users");
        req.AddQueryParameter("phone", phone);
        req.AddQueryParameter("take", "1");

        var res = await _client.ExecuteAsync(req);
        if (!res.IsSuccessful || res.Content == null) return null;

        var wrapper = JsonConvert.DeserializeObject<PaginatedApiResponse<ApiCustomer>>(res.Content);
        return wrapper?.Data?.FirstOrDefault();
    }

    // ── Refunds ───────────────────────────────────────────────────────────────

    /// <summary>Marks an order as refunded. Returns null on success, error string on failure.</summary>
    public async Task<string?> ProcessRefundAsync(string orderId, string reason)
    {
        var req = AuthRequest($"/orders/{orderId}/status", Method.Patch);
        req.AddJsonBody(new { status = "refunded", refund_reason = reason });

        var res = await _client.ExecuteAsync(req);
        if (!res.IsSuccessful)
        {
            return TryExtractMessage(res.Content) ?? $"Refund failed ({(int?)res.StatusCode})";
        }
        return null;
    }

    // ── Promo Codes ───────────────────────────────────────────────────────────

    /// <summary>Validates a promo code. Returns null if invalid or error.</summary>
    public async Task<ApiPromoCode?> ValidatePromoCodeAsync(string code)
    {
        var req = AuthRequest($"/promo-codes/{Uri.EscapeDataString(code)}/validate");
        var res = await _client.ExecuteAsync(req);

        if (!res.IsSuccessful || res.Content == null) return null;

        var wrapper = JsonConvert.DeserializeObject<PromoValidateResponse>(res.Content);
        return (wrapper?.Valid == true) ? wrapper.Data : null;
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    /// <summary>Creates a POS order. Returns the order number on success.</summary>
    public async Task<(string? orderNumber, string? error)> CreateOrderAsync(object payload)
    {
        var req = new RestRequest("/orders", Method.Post);
        // Send cashier token if available (optional but good practice)
        if (!string.IsNullOrEmpty(SessionManager.AccessToken))
            req.AddHeader("Authorization", $"Bearer {SessionManager.AccessToken}");
        req.AddJsonBody(payload);

        var res = await _client.ExecuteAsync(req);
        if (!res.IsSuccessful || res.Content == null)
        {
            var msg = TryExtractMessage(res.Content) ?? $"Order creation failed ({(int?)res.StatusCode})";
            return (null, msg);
        }

        dynamic? json = JsonConvert.DeserializeObject(res.Content);
        string? orderNum = json?.data?.order_number;
        return (orderNum ?? "N/A", null);
    }

    /// <summary>Gets today's POS orders (local date, timezone-safe).</summary>
    public async Task<List<ApiOrder>> GetPosOrdersAsync(int take = 200)
    {
        var req = AuthRequest("/orders");
        req.AddQueryParameter("source", "pos");
        req.AddQueryParameter("take", take.ToString());

        // Convert local midnight to UTC so the backend comparison is timezone-correct
        var utcStart = DateTime.Today.ToUniversalTime();
        req.AddQueryParameter("date_from", utcStart.ToString("yyyy-MM-ddTHH:mm:ss"));

        var res = await _client.ExecuteAsync(req);
        if (!res.IsSuccessful || res.Content == null) return new();

        var wrapper = JsonConvert.DeserializeObject<PaginatedApiResponse<ApiOrder>>(res.Content);
        var all = wrapper?.Data ?? new();

        // Client-side guard: keep only orders whose local date is today
        return all.Where(o => o.CreatedAt.ToLocalTime().Date == DateTime.Today).ToList();
    }

    // ── Util ─────────────────────────────────────────────────────────────────

    private static string? TryExtractMessage(string? json)
    {
        if (string.IsNullOrEmpty(json)) return null;
        try
        {
            dynamic? obj = JsonConvert.DeserializeObject(json);
            return obj?.message?.ToString();
        }
        catch { return null; }
    }
}
