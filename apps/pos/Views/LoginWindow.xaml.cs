using pos.ViewModels;
using System.Windows;

namespace pos.Views;

public partial class LoginWindow : Window
{
    private readonly LoginWindowViewModel _vm;

    public LoginWindow()
    {
        InitializeComponent();
        _vm = new LoginWindowViewModel();
        _vm.CloseAction = success =>
        {
            // Must run on UI thread
            Dispatcher.Invoke(() =>
            {
                DialogResult = success;
                Close();
            });
        };
        DataContext = _vm;
        EmailBox.Focus();
    }

    // PasswordBox doesn't support two-way binding natively — bridge it manually
    private void PasswordBox_PasswordChanged(object sender, RoutedEventArgs e)
    {
        _vm.Password = PasswordBox.Password;
        // Keep plain TextBox in sync
        if (PasswordTextBox.Visibility == System.Windows.Visibility.Visible)
            PasswordTextBox.Text = PasswordBox.Password;
    }

    private bool _passwordVisible = false;

    private void EyeButton_Click(object sender, RoutedEventArgs e)
    {
        _passwordVisible = !_passwordVisible;
        if (_passwordVisible)
        {
            PasswordTextBox.Text = PasswordBox.Password;
            PasswordBox.Visibility     = System.Windows.Visibility.Collapsed;
            PasswordTextBox.Visibility = System.Windows.Visibility.Visible;
            EyeButton.Opacity = 1.0;
        }
        else
        {
            PasswordBox.Password       = PasswordTextBox.Text;
            _vm.Password               = PasswordTextBox.Text;
            PasswordTextBox.Visibility = System.Windows.Visibility.Collapsed;
            PasswordBox.Visibility     = System.Windows.Visibility.Visible;
            EyeButton.Opacity = 0.4;
        }
    }
}
