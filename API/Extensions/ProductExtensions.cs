
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

        public static IQueryable<Product> Search(this IQueryable<Product> query, string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm)) return query;
            var lowerCaseSearchTerm = searchTerm.Trim().ToLower();
            // query for the product name and return that product
            return query.Where(product => product.Name.ToLower().Contains(lowerCaseSearchTerm));
        }

         public static IQueryable<Product> Filter(this IQueryable<Product> query, string brands, 
            string types)
        {
            var brandList = new List<string>();
            var typeList = new List<string>();

             if (!string.IsNullOrEmpty(brands))
            {
                // AddRange adds all elements of the new List object to the end of the brandList.
                // ToList is called on resulting array of substrings to convert it into a List
                // Split is called on brands, split the string into array of substrings, with 
                // each substrings being separated by a comma
                brandList.AddRange(brands.ToLower().Split(",").ToList());
            }

             if (!string.IsNullOrEmpty(types))
            {
                typeList.AddRange(types.ToLower().Split(",").ToList());
            }

            query = query.Where(product => brandList.Count == 0 || 
                brandList.Contains(product.Brand.ToLower()));
            
            query = query.Where(product => typeList.Count == 0 || 
                typeList.Contains(product.Type.ToLower()));

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