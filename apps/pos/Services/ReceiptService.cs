using pos.Models;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;

namespace pos.Services;

public class ReceiptService
{
    public Receipt GenerateReceipt(
        string customerName,
        string customerPhone,
        ObservableCollection<CartItem> cartItems,
        decimal subtotal,
        decimal taxAmount,
        decimal discountAmount,
        decimal total,
        string orderNumber = "",
        string paymentMethod = "Cash")
    {
        return new Receipt
        {
            OrderNumber   = orderNumber,
            CustomerName  = customerName,
            CustomerPhone = customerPhone,
            PaymentMethod = paymentMethod,
            PurchasedAt   = DateTime.Now,
            Items         = cartItems.ToList(),
            Subtotal      = subtotal,
            TaxAmount     = taxAmount,
            DiscountAmount= discountAmount,
            Total         = total,
        };
    }

    public void PrintReceipt(Receipt receipt)
    {
        var printDialog = new PrintDialog();
        if (printDialog.ShowDialog() != true) return;

        var text = receipt.GetFormattedReceipt();

        // Build a FlowDocument with monospace font (thermal-printer style)
        var doc = new FlowDocument
        {
            FontFamily  = new FontFamily("Courier New"),
            FontSize    = 10,
            PageWidth   = printDialog.PrintableAreaWidth,
            PagePadding = new Thickness(20),
            ColumnWidth = printDialog.PrintableAreaWidth,
        };

        doc.Blocks.Add(new Paragraph(new Run(text))
        {
            LineHeight = 14,
        });

        var paginator = ((IDocumentPaginatorSource)doc).DocumentPaginator;
        printDialog.PrintDocument(paginator, $"Receipt {receipt.OrderNumber}");
    }

    public string GetReceiptAsText(Receipt receipt)
    {
        return receipt.GetFormattedReceipt();
    }
}
