using pos.Views;
using System.Windows;

namespace pos;

public partial class App : Application
{
    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        AppDomain.CurrentDomain.UnhandledException += (s, ex) =>
        {
            MessageBox.Show($"Unhandled Exception: {ex.ExceptionObject}", "Error",
                MessageBoxButton.OK, MessageBoxImage.Error);
        };

        // Prevent auto-shutdown when the login dialog closes
        ShutdownMode = ShutdownMode.OnExplicitShutdown;

        var login = new LoginWindow();
        bool authenticated = login.ShowDialog() == true;

        if (!authenticated)
        {
            Shutdown();
            return;
        }

        // Restore normal shutdown behaviour before showing main window
        ShutdownMode = ShutdownMode.OnMainWindowClose;

        var main = new MainWindow();
        MainWindow = main;
        main.Show();
    }
}
