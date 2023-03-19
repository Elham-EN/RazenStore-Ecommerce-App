
using System.Text.Json;
using API.RequestHelpers;

namespace API.Extensions
{
    public static class HttpExtentions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
            // Allow this headers to be access when resquest by the React client app
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}