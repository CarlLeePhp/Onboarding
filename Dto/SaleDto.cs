namespace Onboarding.Dto
{
    public class SaleDto
    {
        public int Id { get; set; }
        public string DateSold { get; set; }
        public int? CustomerId { get; set; }
        public int? ProductId { get; set; }
        public int? StoreId { get; set; }

        public string CustomerName { get; set; }
        public string ProductName { get; set; }
        public string StoreName { get; set; }
    }
}
