
using API.Entities;

namespace API.Extensions
{
    public static class ProductExtensions
    {
        // The "this" keyword is used to modify the 'query' parameter of the Sort
        // method, indicating that query is an instance of the IQueryable<Product>
        // class on which the method is being called. 
        public static IQueryable<Product> Sort(this IQueryable<Product> query, string orderBy) 
        {
            if (string.IsNullOrWhiteSpace(orderBy)) return query.OrderBy(product => product.Name);
            // Sorting based on the value of the "orderBy"
            query = orderBy switch
            {
                // if the value is price, then sort the products in asecending order
                "price" => query.OrderBy(product => product.Price),
                // if the value is priceDesc, then sort the products in descending order
                "priceDesc" => query.OrderByDescending(product => product.Price),
                // default value - sort the products by name in asecnding order
                _ => query.OrderBy(product => product.Name)
            };
            return query;
        }
    }
}

// An extension class is static class that contains one or more static extension
// methods. The purpose of extension methods is to provide a way to add functionailty
// to existing types without modifiying their source code or creating new derived types.
// public static string Reverse(this string str) {} - extension method signatue
// string original = "Hello World";
// string reversed = original.Reverse();
// We call the Reverse extension method on the string instance passing the original 
// string instance as the first parameter. 

// The "this" keyword is used as modifier for a parameter to indicate that the parameter
// is an instance of the current object