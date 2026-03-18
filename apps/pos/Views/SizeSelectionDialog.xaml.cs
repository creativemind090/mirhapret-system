using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace pos.Views;

public partial class SizeSelectionDialog : Window
{
    public string? SelectedSize { get; private set; }

    public SizeSelectionDialog(string productName, List<string> sizes)
    {
        InitializeComponent();
        HeaderText.Text = productName;

        foreach (var size in sizes)
        {
            var btn = new Button
            {
                Content     = size,
                Width       = 52,
                Height      = 52,
                Margin      = new Thickness(4),
                FontSize    = 13,
                FontWeight  = FontWeights.Bold,
                Background  = Brushes.White,
                Foreground  = Brushes.Black,
                BorderBrush = new SolidColorBrush(Color.FromRgb(0, 0, 0)),
                BorderThickness = new Thickness(1),
                Cursor      = System.Windows.Input.Cursors.Hand,
            };
            btn.Click += (_, _) =>
            {
                SelectedSize = size;
                DialogResult = true;
                Close();
            };
            SizePanel.Children.Add(btn);
        }
    }

    private void Cancel_Click(object sender, RoutedEventArgs e)
    {
        DialogResult = false;
        Close();
    }
}
