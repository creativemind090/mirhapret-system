using pos.Utils;
using System.Text.RegularExpressions;
using System.Windows.Input;

namespace pos.ViewModels;

public class CheckoutDialogViewModel : BaseViewModel
{
    private string _customerName = string.Empty;
    private string _customerPhone = "+92";
    private string _phoneError = string.Empty;
    private bool _isPhoneValid = false;
    private string _paymentMethod = "cash";

    public ICommand PrintCommand { get; }
    public ICommand CancelCommand { get; }

    public event Action<(string name, string phone, string paymentMethod)>? DialogClosed;

    public CheckoutDialogViewModel()
    {
        PrintCommand = new RelayCommand(_ => Print());
        CancelCommand = new RelayCommand(_ => Cancel());
    }

    public string CustomerName
    {
        get => _customerName;
        set => SetProperty(ref _customerName, value);
    }

    public string CustomerPhone
    {
        get => _customerPhone;
        set
        {
            if (SetProperty(ref _customerPhone, value))
            {
                ValidatePhone();
            }
        }
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
    public bool IsCash       { get => _paymentMethod == "cash";      set { if (value) PaymentMethod = "cash"; } }
    public bool IsCard       { get => _paymentMethod == "card";      set { if (value) PaymentMethod = "card"; } }
    public bool IsEasyPaisa  { get => _paymentMethod == "easypaisa"; set { if (value) PaymentMethod = "easypaisa"; } }
    public bool IsJazzCash   { get => _paymentMethod == "jazzcash";  set { if (value) PaymentMethod = "jazzcash"; } }

    private void ValidatePhone()
    {
        // Pakistani phone number regex: +92 followed by 10 digits (3XX-XXXXXXX format)
        // Accepts: +923001234567, +92 300 1234567, +92-300-1234567, etc.
        var pattern = @"^\+92\d{10}$";
        var cleanPhone = Regex.Replace(CustomerPhone, @"[\s\-]", "");

        if (Regex.IsMatch(cleanPhone, pattern))
        {
            IsPhoneValid = true;
            PhoneError = string.Empty;
        }
        else
        {
            IsPhoneValid = false;
            if (CustomerPhone.Length < 13)
            {
                PhoneError = "Phone must be +92 followed by 10 digits";
            }
            else
            {
                PhoneError = "Invalid Pakistani phone number";
            }
        }
    }

    private void Print()
    {
        if (string.IsNullOrWhiteSpace(CustomerName))
        {
            PhoneError = "Customer name is required";
            return;
        }

        if (!IsPhoneValid)
        {
            return;
        }

        DialogClosed?.Invoke((CustomerName, CustomerPhone, PaymentMethod));
    }

    private void Cancel()
    {
        DialogClosed?.Invoke((string.Empty, string.Empty, string.Empty));
    }
}
