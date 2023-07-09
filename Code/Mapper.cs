using Microsoft.EntityFrameworkCore;
using Onboarding.Dto;
using Onboarding.Models;
using System.Globalization;

namespace Onboarding.Code
{
    public static class Mapper
    {
        public static async Task<SaleDto> ToSaleDto(Sale sale)
        {
            CultureInfo culture = new CultureInfo("en-GB");
            SaleDto saleDto = new SaleDto
            {
                Id = sale.Id,
                DateSold = sale.DateSold?.ToString("D"),
                CustomerId = sale.CustomerId,
                ProductId = sale.ProductId,
                StoreId = sale.StoreId,
                CustomerName = sale.Customer.Name,
                ProductName = sale.Product.Name,
                StoreName = sale.Store.Name
            };

            return saleDto;
        }
    }
}
