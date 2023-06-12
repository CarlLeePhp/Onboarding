using System;
using System.Collections.Generic;

namespace Onboarding.Models
{
    public partial class Product
    {
        public Product()
        {
            Sales = new HashSet<Sale>();
        }

        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal? Price { get; set; }

        public virtual ICollection<Sale> Sales { get; set; }
    }
}
