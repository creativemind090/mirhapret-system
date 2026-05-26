using pos.Models;
using pos.Utils;
using System.Windows.Input;

namespace pos.ViewModels;

public class RefundDialogViewModel : BaseViewModel
{
    private string _refundReason = string.Empty;

    public ICommand ConfirmCommand { get; }
    public ICommand CancelCommand  { get; }

    public event Action<string?>? DialogClosed; // null = cancelled

    public ApiOrder Order { get; }

    public RefundDialogViewModel(ApiOrder order)
    {
        Order = order;
        ConfirmCommand = new RelayCommand(_ => Confirm(), _ => !string.IsNullOrWhiteSpace(RefundReason));
        CancelCommand  = new RelayCommand(_ => DialogClosed?.Invoke(null));
    }

    public string RefundReason
    {
        get => _refundReason;
        set => SetProperty(ref _refundReason, value);
    }

    private void Confirm()
    {
        if (string.IsNullOrWhiteSpace(RefundReason)) return;
        DialogClosed?.Invoke(RefundReason.Trim());
    }
}
