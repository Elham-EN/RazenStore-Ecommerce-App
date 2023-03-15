
// Extend the List class we get from .net into a PagedList class which
// we can add the metadata to, so that when we return a list of products
// to the client, we can also return the pagination information.
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    // This PageList class can be a type of T (Generic, can be any type)
    // This class will have all the properties of the List class
    public class PagedList<T> : List<T>
    {
        public MetaData MetaData { get; set; }
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            // Create the metadata that we are going to return with this PageList
            MetaData = new MetaData
            {
                TotalCount = count,
                PageSize = pageSize,
                CurrentPage = pageNumber,
                // Calcuate the total pages. Cast to int. For example we've got 18
                // products in DB, the page size was 10, then we know that we would
                // have two pages, 18 items each page has a size of 10 items that 
                // create 2 pages. Celiing is going to give us the result of count=18
                // divided by pageSize=10, give us 1.8 and rounded it up and give 2
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            // Add items for our list, so when we create new instance of our pageList
            // we're going to pass in list of items, to count the page number. 
            // and when we return from this PagedList, we wil all of our metadata and items
            AddRange(items);
        }
        public static async Task<PagedList<T>> ToPagedList(IQueryable<T> query, 
            int pageNumber, int pageSize)
        {
            // Get the total count of items after the sorting and filtering has been applied
            // Execute query against the database, to find the total count of items
            var count = await query.CountAsync();
            // Use Pagination operator to skip a certain amount. So if they were on pageNumber=1
            // and pageSize=10, then to get the first 10 items, we need our pageNumber-1*pageSize
            // give us 0 because don't want to skip anything since we are on page 1 and need 10 items
            // then specify "Take" to take pageSize. (query against the database)
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}