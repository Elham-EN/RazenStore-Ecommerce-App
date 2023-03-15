
namespace API.RequestHelpers
{
    // retreieve parameters from the user, need to know what page number 
    // are they interested in getting and how big the page size is going to be
    public class PaginationParams
    {
        // Value is exactly 50 and will not change
        private const int MaxPageSize = 50;
        // By default the page numer is 1 (get the first page)
        public int PageNumber {get; set;} = 1;
        private int _pageSize = 6; // Default value
        // If they request for products more than 50, then set pageSize to 50
        // If they request for products smaller than 50, then set the pageSize
        // to whatever they requested
        public int PageSize // backing field
        {
            get => _pageSize;
            set => _pageSize = value > MaxPageSize ? MaxPageSize : value;
        }
    }
}