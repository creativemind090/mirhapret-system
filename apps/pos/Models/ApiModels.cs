using Newtonsoft.Json;

namespace pos.Models;

// ── Generic API wrapper ──────────────────────────────────────────────────────

public class ApiResponse<T>
{
    [JsonProperty("message")] public string Message { get; set; } = string.Empty;
    [JsonProperty("data")]    public T?     Data    { get; set; }
}

public class PaginatedApiResponse<T>
{
    [JsonProperty("message")] public string    Message    { get; set; } = string.Empty;
    [JsonProperty("data")]    public List<T>   Data       { get; set; } = new();
}

// ── Auth ─────────────────────────────────────────────────────────────────────

public class LoginResponseData
{
    [JsonProperty("access_token")]  public string   AccessToken  { get; set; } = string.Empty;
    [JsonProperty("refresh_token")] public string   RefreshToken { get; set; } = string.Empty;
    [JsonProperty("user")]          public UserInfo User         { get; set; } = new();
}

public class UserInfo
{
    [JsonProperty("id")]         public string Id        { get; set; } = string.Empty;
    [JsonProperty("email")]      public string Email     { get; set; } = string.Empty;
    [JsonProperty("first_name")] public string FirstName { get; set; } = string.Empty;
    [JsonProperty("last_name")]  public string LastName  { get; set; } = string.Empty;
    [JsonProperty("role")]       public string Role      { get; set; } = string.Empty;

    public string FullName => $"{FirstName} {LastName}".Trim();
}

// ── Product ──────────────────────────────────────────────────────────────────

public class ApiProduct
{
    [JsonProperty("id")]              public string        Id             { get; set; } = string.Empty;
    [JsonProperty("name")]            public string        Name           { get; set; } = string.Empty;
    [JsonProperty("sku")]             public string        Sku            { get; set; } = string.Empty;
    [JsonProperty("barcode")]         public string?       Barcode        { get; set; }
    [JsonProperty("price")]           public decimal       Price          { get; set; }
    [JsonProperty("tax_rate")]        public decimal       TaxRate        { get; set; }
    [JsonProperty("is_active")]       public bool          IsActive       { get; set; }
    [JsonProperty("description")]     public string?       Description    { get; set; }
    [JsonProperty("available_sizes")] public List<string>  AvailableSizes { get; set; } = new();
    [JsonProperty("image_url")]       public string?       ImageUrl       { get; set; }
    [JsonProperty("images")]          public List<string>? Images         { get; set; }
    [JsonProperty("category_id")]     public string?       CategoryId     { get; set; }

    public string EffectiveBarcode => !string.IsNullOrEmpty(Barcode) ? Barcode : Sku;
    public string EffectiveImage   => ImageUrl ?? Images?.FirstOrDefault() ?? string.Empty;

    public Product ToPosProduct() => new()
    {
        Id          = Guid.TryParse(Id, out var g) ? g : Guid.NewGuid(),
        Name        = Name,
        Description = Description ?? string.Empty,
        Price       = Price,
        TaxRate     = TaxRate > 1 ? TaxRate / 100m : TaxRate,
        Barcode     = EffectiveBarcode,
        IsActive    = IsActive,
        Sizes       = AvailableSizes,
        MainImage   = EffectiveImage,
        CategoryId  = Guid.TryParse(CategoryId, out var cg) ? cg : Guid.Empty,
    };
}

// ── Category ─────────────────────────────────────────────────────────────────

public class ApiCategory
{
    [JsonProperty("id")]        public string Id       { get; set; } = string.Empty;
    [JsonProperty("name")]      public string Name     { get; set; } = string.Empty;
    [JsonProperty("is_active")] public bool   IsActive { get; set; }
}

// ── Customer ──────────────────────────────────────────────────────────────────

public class ApiCustomer
{
    [JsonProperty("id")]         public string  Id        { get; set; } = string.Empty;
    [JsonProperty("first_name")] public string  FirstName { get; set; } = string.Empty;
    [JsonProperty("last_name")]  public string? LastName  { get; set; }
    [JsonProperty("phone")]      public string  Phone     { get; set; } = string.Empty;
    [JsonProperty("email")]      public string  Email     { get; set; } = string.Empty;

    public string FullName => $"{FirstName} {LastName}".Trim();
}

// ── Promo ────────────────────────────────────────────────────────────────────

public class ApiPromoCode
{
    [JsonProperty("id")]             public string  Id            { get; set; } = string.Empty;
    [JsonProperty("code")]           public string  Code          { get; set; } = string.Empty;
    [JsonProperty("discount_type")]  public string  DiscountType  { get; set; } = string.Empty;
    [JsonProperty("discount_value")] public decimal DiscountValue { get; set; }
    [JsonProperty("is_active")]      public bool    IsActive      { get; set; }
}

public class PromoValidateResponse
{
    [JsonProperty("data")]  public ApiPromoCode? Data  { get; set; }
    [JsonProperty("valid")] public bool          Valid { get; set; }
}

// ── Order (for display in Orders tab) ────────────────────────────────────────

public class ApiOrder
{
    [JsonProperty("id")]                 public string  Id                { get; set; } = string.Empty;
    [JsonProperty("order_number")]       public string  OrderNumber       { get; set; } = string.Empty;
    [JsonProperty("customer_first_name")]public string  CustomerFirstName { get; set; } = string.Empty;
    [JsonProperty("customer_last_name")] public string? CustomerLastName  { get; set; }
    [JsonProperty("customer_phone")]     public string  CustomerPhone     { get; set; } = string.Empty;
    [JsonProperty("total")]              public decimal Total             { get; set; }
    [JsonProperty("subtotal")]           public decimal Subtotal          { get; set; }
    [JsonProperty("tax_amount")]         public decimal TaxAmount         { get; set; }
    [JsonProperty("discount_amount")]    public decimal DiscountAmount    { get; set; }
    [JsonProperty("status")]             public string  Status            { get; set; } = string.Empty;
    [JsonProperty("payment_method")]     public string? PaymentMethod     { get; set; }
    [JsonProperty("created_at")]         public DateTime CreatedAt        { get; set; }

    public string CustomerName => $"{CustomerFirstName} {CustomerLastName}".Trim();
    public string FormattedTotal => $"PKR {Total:N0}";
    public string FormattedTime => CreatedAt.ToLocalTime().ToString("hh:mm tt");
}
