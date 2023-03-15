

namespace API.RequestHelpers
{
    // When we return products with the pagination information, then the
    // user is going to need to know what the current pages that we have
    // returned, what are the total number of pages, the pagesize and the
    // total count of items avaiable from the list originally after the
    // filters have been applied. 
    public class MetaData
    {
        // Return information about the pagenation to the client
        // alongside the request
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }
}