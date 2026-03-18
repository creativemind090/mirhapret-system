using pos.Services;
using pos.Utils;
using System.Windows.Input;

namespace pos.ViewModels;

public class LoginWindowViewModel : BaseViewModel
{
    private readonly ApiService _apiService = ApiService.Instance;

    private string _email        = string.Empty;
    private string _password     = string.Empty;
    private string _errorMessage = string.Empty;
    private bool   _isLoading    = false;

    public string Email
    {
        get => _email;
        set => SetProperty(ref _email, value);
    }

    public string Password
    {
        get => _password;
        set => SetProperty(ref _password, value);
    }

    public string ErrorMessage
    {
        get => _errorMessage;
        set => SetProperty(ref _errorMessage, value);
    }

    public bool IsLoading
    {
        get => _isLoading;
        set
        {
            SetProperty(ref _isLoading, value);
            OnPropertyChanged(nameof(LoginButtonText));
        }
    }

    public string LoginButtonText => IsLoading ? "Signing in..." : "Sign In";

    public ICommand LoginCommand { get; }

    // Set by the View before closing so App.xaml.cs can read the result
    public Action<bool>? CloseAction { get; set; }

    public LoginWindowViewModel()
    {
        LoginCommand = new RelayCommand(_ => _ = LoginAsync(), _ => !IsLoading);
    }

    private async Task LoginAsync()
    {
        if (string.IsNullOrWhiteSpace(Email) || string.IsNullOrWhiteSpace(Password))
        {
            ErrorMessage = "Please enter your email and password";
            return;
        }

        IsLoading = true;
        ErrorMessage = string.Empty;

        var (token, user, error) = await _apiService.LoginAsync(Email, Password);

        IsLoading = false;

        if (token == null || user == null)
        {
            ErrorMessage = error ?? "Login failed";
            return;
        }

        SessionManager.AccessToken = token;
        SessionManager.Cashier     = user;

        CloseAction?.Invoke(true);
    }
}
