using pos.Models;
using pos.ViewModels;
using System.Windows;

namespace pos.Views;

public partial class RefundDialog : Window
{
    public string RefundReason { get; private set; } = string.Empty;

    public RefundDialog(ApiOrder order)
    {
        InitializeComponent();
        var viewModel = new RefundDialogViewModel(order);
        DataContext = viewModel;
        viewModel.DialogClosed += (reason) =>
        {
            if (reason != null)
            {
                RefundReason = reason;
                DialogResult = true;
            }
            else
            {
                DialogResult = false;
            }
            Close();
        };
    }
}
