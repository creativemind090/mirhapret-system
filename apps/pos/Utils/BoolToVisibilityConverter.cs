using System.Globalization;
using System.Windows;
using System.Windows.Data;

namespace pos.Utils;

public class BoolToVisibilityConverter : IValueConverter
{
    public object Convert(object? value, Type targetType, object? parameter, CultureInfo culture)
    {
        bool visible = value is bool b && b;
        // Pass "Invert" as parameter to flip the logic
        if (parameter is string s && s == "Invert") visible = !visible;
        return visible ? Visibility.Visible : Visibility.Collapsed;
    }

    public object ConvertBack(object? value, Type targetType, object? parameter, CultureInfo culture)
        => throw new NotImplementedException();
}
