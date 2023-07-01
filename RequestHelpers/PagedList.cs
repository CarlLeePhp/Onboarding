namespace Onboarding.RequestHelpers
{
    public class PagedList<T>: List<T>
    {
        public int TotalPages { get; set; }
        public PagedList(List<T> items, int totalPages)
        {
            TotalPages = totalPages;
            AddRange(items);
        }
    }
}
