using pos.Models;
using pos.Services;
using pos.Utils;
using pos.Views;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;

namespace pos.ViewModels;

public class MainWindowViewModel : BaseViewModel
{
    // ── Services ──────────────────────────────────────────────────────────────
    private readonly ApiService     _apiService     = ApiService.Instance;
    private readonly ReceiptService _receiptService = new();
    private readonly BarcodeScanner _barcodeScanner = new();

    // Local product cache — loaded from API on startup
    private List<Product> _products = new();

    // ── Observable state ─────────────────────────────────────────────────────
    public ObservableCollection<CartItem>    CartItems         { get; } = new();
    public ObservableCollection<Product>     SearchSuggestions { get; } = new();
    public ObservableCollection<ApiOrder>    TodaysOrders      { get; } = new();
    public ObservableCollection<ApiCategory> Categories        { get; } = new();

    // ── Bindable properties ───────────────────────────────────────────────────
    private string _searchInput        = string.Empty;
    private decimal _discountAmount    = 0;
    private string _promoCode          = string.Empty;
    private string _errorMessage       = string.Empty;
    private bool   _isScannerConnected = false;
    private bool   _isLoadingProducts  = true;
    private bool   _isLoadingOrders    = false;
    private string? _selectedCategoryId = null; // null = All

    public string SearchInput
    {
        get => _searchInput;
        set { if (SetProperty(ref _searchInput, value)) UpdateSearchSuggestions(); }
    }
    public decimal DiscountAmount
    {
        get => _discountAmount;
        set => SetProperty(ref _discountAmount, value);
    }
    public string PromoCode
    {
        get => _promoCode;
        set => SetProperty(ref _promoCode, value);
    }
    public string ErrorMessage
    {
        get => _errorMessage;
        set => SetProperty(ref _errorMessage, value);
    }
    public bool IsScannerConnected
    {
        get => _isScannerConnected;
        set => SetProperty(ref _isScannerConnected, value);
    }
    public bool IsLoadingProducts
    {
        get => _isLoadingProducts;
        set => SetProperty(ref _isLoadingProducts, value);
    }
    public bool IsLoadingOrders
    {
        get => _isLoadingOrders;
        set => SetProperty(ref _isLoadingOrders, value);
    }

    public string? SelectedCategoryId
    {
        get => _selectedCategoryId;
        set
        {
            if (SetProperty(ref _selectedCategoryId, value))
                UpdateSearchSuggestions();
        }
    }

    // ── Computed totals ───────────────────────────────────────────────────────
    public decimal Subtotal  => CartItems.Sum(i => i.Subtotal);
    public decimal TaxAmount => CartItems.Sum(i => i.TaxAmount);
    public decimal Total     => Subtotal + TaxAmount - DiscountAmount;

    // ── Cashier info (shown in header) ────────────────────────────────────────
    public string CashierName => SessionManager.Cashier?.FullName ?? "Cashier";

    // ── Today's order summary stats ───────────────────────────────────────────
    public int     OrderCount     => TodaysOrders.Count;
    public decimal OrdersRevenue  => TodaysOrders.Sum(o => o.Total);

    // ── Commands ──────────────────────────────────────────────────────────────
    public ICommand AddToCartCommand        { get; }
    public ICommand RemoveFromCartCommand   { get; }
    public ICommand IncreaseQuantityCommand { get; }
    public ICommand DecreaseQuantityCommand { get; }
    public ICommand ApplyPromoCommand       { get; }
    public ICommand CompleteSaleCommand     { get; }
    public ICommand ClearCartCommand        { get; }
    public ICommand SelectProductCommand    { get; }
    public ICommand ConnectScannerCommand    { get; }
    public ICommand DisconnectScannerCommand { get; }
    public ICommand RefreshOrdersCommand     { get; }
    public ICommand FilterByCategoryCommand  { get; }
    public ICommand RefundOrderCommand       { get; }

    public MainWindowViewModel()
    {
        AddToCartCommand         = new RelayCommand(_ => AddToCart());
        RemoveFromCartCommand    = new RelayCommand<CartItem>(RemoveFromCart);
        IncreaseQuantityCommand  = new RelayCommand<CartItem>(IncreaseQuantity);
        DecreaseQuantityCommand  = new RelayCommand<CartItem>(DecreaseQuantity);
        ApplyPromoCommand        = new RelayCommand(_ => _ = ApplyPromoAsync());
        CompleteSaleCommand      = new RelayCommand(_ => _ = CompleteSaleAsync());
        ClearCartCommand         = new RelayCommand(_ => ClearCart());
        SelectProductCommand     = new RelayCommand<Product>(SelectProduct);
        ConnectScannerCommand    = new RelayCommand(_ => ConnectScanner());
        DisconnectScannerCommand = new RelayCommand(_ => DisconnectScanner());
        RefreshOrdersCommand     = new RelayCommand(_ => _ = LoadOrdersAsync());
        FilterByCategoryCommand  = new RelayCommand<string?>(id => SelectedCategoryId = id);
        RefundOrderCommand       = new RelayCommand<ApiOrder>(order => _ = RefundOrderAsync(order));

        _barcodeScanner.BarcodeScanned += OnBarcodeScanned;
        _barcodeScanner.ErrorOccurred  += OnScannerError;

        TryAutoConnectScanner();

        // Load data from API asynchronously
        _ = LoadProductsAsync();
        _ = LoadOrdersAsync();
        _ = LoadCategoriesAsync();
    }

    // ── Category loading ──────────────────────────────────────────────────────

    private async Task LoadCategoriesAsync()
    {
        var cats = await _apiService.GetCategoriesAsync();
        Categories.Clear();
        foreach (var c in cats.Where(c => c.IsActive))
            Categories.Add(c);
        OnPropertyChanged(nameof(Categories));
    }

    // ── Refund ────────────────────────────────────────────────────────────────

    private async Task RefundOrderAsync(ApiOrder? order)
    {
        if (order == null) return;

        var dialog = new Views.RefundDialog(order);
        if (dialog.ShowDialog() != true) return;

        ErrorMessage = "Processing refund...";
        var error = await _apiService.ProcessRefundAsync(order.Id, dialog.RefundReason);

        if (error != null)
        {
            ErrorMessage = error;
            return;
        }

        ErrorMessage = string.Empty;
        MessageBox.Show(
            $"Refund processed for Order #{order.OrderNumber}.",
            "Refund Complete",
            MessageBoxButton.OK,
            MessageBoxImage.Information);

        _ = LoadOrdersAsync();
    }

    // ── Product loading ───────────────────────────────────────────────────────

    private async Task LoadProductsAsync()
    {
        IsLoadingProducts = true;
        ErrorMessage = "Loading products from server...";

        var apiProducts = await _apiService.GetAllProductsAsync();

        _products = apiProducts.Select(p => p.ToPosProduct()).ToList();

        ErrorMessage = _products.Count > 0
            ? string.Empty
            : "⚠ Could not load products. Check server connection.";

        IsLoadingProducts = false;
    }

    // ── Cart operations ───────────────────────────────────────────────────────

    private void AddToCart()
    {
        if (string.IsNullOrWhiteSpace(SearchInput)) { ErrorMessage = "Please enter a barcode or product name"; return; }

        ErrorMessage = string.Empty;

        var product = _products.FirstOrDefault(p => p.Barcode == SearchInput && p.IsActive)
                   ?? _products.FirstOrDefault(p => p.IsActive &&
                          (p.Name.Contains(SearchInput, StringComparison.OrdinalIgnoreCase) ||
                           p.Barcode.Contains(SearchInput, StringComparison.OrdinalIgnoreCase)));

        if (product == null) { ErrorMessage = "Product not found"; return; }

        // Size selection — show dialog if product has sizes
        string selectedSize = string.Empty;
        if (product.Sizes.Count > 0)
        {
            var sizeDialog = new SizeSelectionDialog(product.Name, product.Sizes);
            if (sizeDialog.ShowDialog() != true) return;
            selectedSize = sizeDialog.SelectedSize ?? string.Empty;
        }

        // Match existing cart line only if same product AND same size
        var existing = CartItems.FirstOrDefault(i =>
            i.ProductId == product.Id && i.SelectedSize == selectedSize);

        if (existing != null)
        {
            existing.Quantity++;
        }
        else
        {
            CartItems.Add(new CartItem
            {
                Id           = Guid.NewGuid(),
                ProductId    = product.Id,
                ProductName  = product.Name,
                Barcode      = product.Barcode,
                SelectedSize = selectedSize,
                ImageUrl     = product.MainImage,
                UnitPrice    = product.Price,
                Quantity     = 1,
                TaxRate      = product.TaxRate
            });
        }

        SearchInput = string.Empty;
        NotifyTotals();
    }

    private void RemoveFromCart(CartItem? item)
    {
        if (item != null) { CartItems.Remove(item); NotifyTotals(); }
    }

    private void IncreaseQuantity(CartItem? item)
    {
        if (item != null) { item.Quantity++; NotifyTotals(); }
    }

    private void DecreaseQuantity(CartItem? item)
    {
        if (item != null && item.Quantity > 1) { item.Quantity--; NotifyTotals(); }
    }

    private void NotifyTotals()
    {
        OnPropertyChanged(nameof(Subtotal));
        OnPropertyChanged(nameof(TaxAmount));
        OnPropertyChanged(nameof(Total));
    }

    // ── Promo code ────────────────────────────────────────────────────────────

    private async Task ApplyPromoAsync()
    {
        if (string.IsNullOrWhiteSpace(PromoCode)) { ErrorMessage = "Please enter a promo code"; return; }

        ErrorMessage = "Validating promo code...";
        var promo = await _apiService.ValidatePromoCodeAsync(PromoCode);

        if (promo == null) { ErrorMessage = "Invalid or expired promo code"; return; }

        ErrorMessage = string.Empty;
        DiscountAmount = promo.DiscountType == "percentage"
            ? Subtotal * (promo.DiscountValue / 100m)
            : promo.DiscountValue;

        NotifyTotals();
    }

    // ── Complete sale ─────────────────────────────────────────────────────────

    private async Task CompleteSaleAsync()
    {
        if (CartItems.Count == 0) { ErrorMessage = "Cart is empty"; return; }

        ErrorMessage = string.Empty;
        try
        {
            await CompleteSaleInternalAsync();
        }
        catch (Exception ex)
        {
            ErrorMessage = $"Unexpected error: {ex.Message}";
        }
    }

    private async Task CompleteSaleInternalAsync()
    {

        var dialog = new CheckoutDialog();
        if (dialog.ShowDialog() != true) return;

        var customerName  = dialog.CustomerName ?? "Walk-in Customer";
        var customerPhone = dialog.CustomerPhone ?? "03000000000";
        var paymentMethod = dialog.PaymentMethod ?? "cash";
        var nameParts     = customerName.Trim().Split(' ', 2);
        var firstName     = nameParts[0];
        var lastName      = nameParts.Length > 1 ? nameParts[1] : string.Empty;

        // Build the order payload
        var payload = new
        {
            customer_first_name = firstName,
            customer_last_name  = string.IsNullOrEmpty(lastName) ? null : lastName,
            customer_email      = $"pos_{Guid.NewGuid():N}@mirhapret.pos",
            customer_phone      = customerPhone,
            source              = "pos",
            cashier_id          = SessionManager.Cashier?.Id,
            payment_method      = paymentMethod,
            tax_amount          = (double)TaxAmount,
            discount_amount     = (double)DiscountAmount,
            items               = CartItems.Select(i => new
            {
                product_id    = i.ProductId.ToString(),
                product_name  = i.ProductName,
                sku           = i.Barcode,
                quantity      = i.Quantity,
                unit_price    = (double)i.UnitPrice,
                total         = (double)(i.UnitPrice * i.Quantity),
                product_size  = i.SelectedSize,
            }).ToList(),
        };

        ErrorMessage = "Processing sale...";
        var (orderNumber, error) = await _apiService.CreateOrderAsync(payload);

        if (orderNumber == null)
        {
            ErrorMessage = error ?? "Failed to save order";
            return;
        }

        ErrorMessage = string.Empty;

        // Log receipt text to debug output (no printer required)
        var receipt = _receiptService.GenerateReceipt(
            customerName, customerPhone, CartItems,
            Subtotal, TaxAmount, DiscountAmount, Total,
            orderNumber: orderNumber,
            paymentMethod: paymentMethod);
        System.Diagnostics.Debug.WriteLine(_receiptService.GetReceiptAsText(receipt));

        var saleTotal = Total;
        ClearCart();

        MessageBox.Show(
            $"Sale completed!\nOrder #{orderNumber}\nTotal: PKR {saleTotal:N0}",
            "Sale Complete",
            MessageBoxButton.OK,
            MessageBoxImage.Information);

        // Refresh orders list
        _ = LoadOrdersAsync();
    }

    private void ClearCart()
    {
        CartItems.Clear();
        SearchInput    = string.Empty;
        PromoCode      = string.Empty;
        DiscountAmount = 0;
        ErrorMessage   = string.Empty;
        NotifyTotals();
    }

    // ── Orders tab ────────────────────────────────────────────────────────────

    public async Task LoadOrdersAsync()
    {
        IsLoadingOrders = true;
        var orders = await _apiService.GetPosOrdersAsync();

        TodaysOrders.Clear();
        foreach (var o in orders)
            TodaysOrders.Add(o);

        OnPropertyChanged(nameof(OrderCount));
        OnPropertyChanged(nameof(OrdersRevenue));
        IsLoadingOrders = false;
    }

    // ── Search suggestions ────────────────────────────────────────────────────

    private void UpdateSearchSuggestions()
    {
        SearchSuggestions.Clear();
        if (string.IsNullOrWhiteSpace(SearchInput)) return;

        var results = _products
            .Where(p => p.IsActive &&
                (p.Name.Contains(SearchInput, StringComparison.OrdinalIgnoreCase) ||
                 p.Barcode.Contains(SearchInput, StringComparison.OrdinalIgnoreCase)) &&
                (_selectedCategoryId == null || p.CategoryId.ToString() == _selectedCategoryId))
            .Take(6);

        foreach (var p in results) SearchSuggestions.Add(p);
    }

    private void SelectProduct(Product? product)
    {
        if (product == null) return;
        SearchInput = product.Barcode;
        SearchSuggestions.Clear();
        AddToCart();
    }

    // ── Barcode scanner ───────────────────────────────────────────────────────

    private void TryAutoConnectScanner()
    {
        var ports = BarcodeScanner.GetAvailablePorts();
        if (ports.Length == 0) return;
        try { _barcodeScanner.Connect(ports[0]); IsScannerConnected = true; } catch { }
    }

    private void ConnectScanner()
    {
        var ports = BarcodeScanner.GetAvailablePorts();
        if (ports.Length == 0) { ErrorMessage = "No COM ports available"; return; }
        _barcodeScanner.Connect(ports[0]);
        IsScannerConnected = _barcodeScanner.IsConnected;
    }

    private void DisconnectScanner()
    {
        _barcodeScanner.Disconnect();
        IsScannerConnected = false;
    }

    private void OnBarcodeScanned(object? sender, BarcodeScannedEventArgs e)
    {
        Application.Current.Dispatcher.Invoke(() =>
        {
            SearchInput = e.Barcode;
            AddToCart();
        });
    }

    private void OnScannerError(object? sender, string error) => ErrorMessage = error;
}
