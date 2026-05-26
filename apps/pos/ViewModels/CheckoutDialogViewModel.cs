using pos.Services;
using pos.Utils;
using System.Text.RegularExpressions;
using System.Windows.Input;

namespace pos.ViewModels;

public class CheckoutDialogViewModel : BaseViewModel
{
    private readonly ApiService _api = ApiService.Instance;

    private string _customerName    = string.Empty;
    private string _customerPhone   = "+92";
    private string _phoneError      = string.Empty;
    private bool   _isPhoneValid    = false;
    private string _paymentMethod   = "cash";
    private bool   _isLookingUp     = false;
    private string _lookupMessage   = string.Empty;

    public ICommand PrintCommand  { get; }
    public ICommand CancelCommand { get; }
    public ICommand LookupCommand { get; }

    public event Action<(string name, string phone, string paymentMethod)>? DialogClosed;

    public CheckoutDialogViewModel()
    {
        PrintCommand  = new RelayCommand(_ => Print());
        CancelCommand = new RelayCommand(_ => Cancel());
        LookupCommand = new RelayCommand(_ => _ = LookupCustomerAsync(), _ => IsPhoneValid && !IsLookingUp);
    }

    public string CustomerName
    {
        get => _customerName;
        set => SetProperty(ref _customerName, value);
    }

    public string CustomerPhone
    {
        get => _customerPhone;
        set { if (SetProperty(ref _customerPhone, value)) { ValidatePhone(); LookupMessage = string.Empty; } }
    }

    public string PhoneError
    {
        get => _phoneError;
        set => SetProperty(ref _phoneError, value);
    }

    public bool IsPhoneValid
    {
        get => _isPhoneValid;
        set => SetProperty(ref _isPhoneValid, value);
    }

    public bool IsLookingUp
    {
        get => _isLookingUp;
        set => SetProperty(ref _isLookingUp, value);
    }

    public string LookupMessage
    {
        get => _lookupMessage;
        set => SetProperty(ref _lookupMessage, value);
    }

    public string PaymentMethod
    {
        get => _paymentMethod;
        set
        {
            if (SetProperty(ref _paymentMethod, value))
            {
                OnPropertyChanged(nameof(IsCash));
                OnPropertyChanged(nameof(IsCard));
                OnPropertyChanged(nameof(IsEasyPaisa));
                OnPropertyChanged(nameof(IsJazzCash));
            }
        }
    }

    // Convenience bool properties for radio-button two-way binding
    public bool IsCash      { get => _paymentMethod == "cash";      set { if (value) PaymentMethod = "cash"; } }
    public bool IsCard      { get => _paymentMethod == "card";      set { if (value) PaymentMethod = "card"; } }
    public bool IsEasyPaisa { get => _paymentMethod == "easypaisa"; set { if (value) PaymentMethod = "easypaisa"; } }
    public bool IsJazzCash  { get => _paymentMethod == "jazzcash";  set { if (value) PaymentMethod = "jazzcash"; } }

    private void ValidatePhone()
    {
        var pattern    = @"^\+92\d{10}$";
        var cleanPhone = Regex.Replace(CustomerPhone, @"[\s\-]", "");

        if (Regex.IsMatch(cleanPhone, pattern))
        {
            IsPhoneValid = true;
            PhoneError   = string.Empty;
        }
        else
        {
            IsPhoneValid = false;
            PhoneError   = CustomerPhone.Length < 13
                ? "Phone must be +92 followed by 10 digits"
                : "Invalid Pakistani phone number";
        }
    }

    private async Task LookupCustomerAsync()
    {
        var cleanPhone = Regex.Replace(CustomerPhone, @"[\s\-]", "");
        IsLookingUp    = true;
        LookupMessage  = "Looking up customer...";

        var customer = await _api.GetCustomerByPhoneAsync(cleanPhone);

        IsLookingUp = false;

        if (customer != null)
        {
            CustomerName  = customer.FullName;
            LookupMessage = $"✓ Found: {customer.FullName}";
        }
        else
        {
            LookupMessage = "No existing customer found — enter name manually";
        }
    }

    private void Print()
    {
        if (string.IsNullOrWhiteSpace(CustomerName))
        {
            PhoneError = "Customer name is required";
            return;
        }

        if (!IsPhoneValid) return;

        DialogClosed?.Invoke((CustomerName, CustomerPhone, PaymentMethod));
    }

    private void Cancel()
    {
        DialogClosed?.Invoke((string.Empty, string.Empty, string.Empty));
    }
}
