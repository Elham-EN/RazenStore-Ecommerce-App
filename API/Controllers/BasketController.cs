
using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;   
        }

        // Endpoint: fetch an individual basket.  Specify the name of the
        // route. '/api/GetBasket'
        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            // How do we identify the basket that we're going to for here?
            // Use a cookie, when user create a basket on our server, we're
            // going to return them a buyerId, sent it back to user as cookie
            // and cookies are stored in the user's broweser in storage and for
            // every request and response we use the cookie and it goes backwards
            // and forwards between the client and the server, so we will have 
            // access to the cookie.
            var basket = await RetrieveBasket();
                if (basket == null) return NotFound();
                return MapBasketToDto(basket);
        }

        // Endpoint: add item to the basket
        [HttpPost] // api/basket?productId=2&quantity=3
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get basket first
            var basket = await RetrieveBasket();
            // If current user does not have a basket then create a basket
            if (basket == null) basket = CreateBasket();
            // get product related to the item
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return NotFound();
            // add item to the basket
            basket.AddItem(product, quantity);
            // save changes
            var result = await _context.SaveChangesAsync() > 0;
            // The 'GetBasket' it's going to add a location header to our response
            if (result)  return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        // Endpoint: remove item from the basket
        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get the basket first
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            // remove item or reduce quantity
            basket.RemoveItem(productId, quantity);
            // Save changes to the database
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok();
            return BadRequest(new ProblemDetails{Title = "Problem removing item from the basket"});
        }

        private async Task<Basket> RetrieveBasket() 
        {
            return await _context.Baskets
                // Include the related items with basket (Still not enough because our
                // our items have related property for the Product, so if we want the
                // product infomration then we can include that)
                .Include(i => i.Items)
                // The way the relationship is configured, we got a basket that has 
                // basketItem, then our basketItem have the product
                .ThenInclude(p => p.Product)
                // Which cookies we are interested in (This code on it own is not
                // enough because we have relationship we need to think about), when
                // we return this, this will not include basket items
                .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Basket CreateBasket() 
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions
                {
                    // This cookie is essential to the operation of our application
                    IsEssential = true,
                    // Cookie expire after 30 days
                    Expires = DateTime.Now.AddDays(30),
                };
            // Add cookie to our response that we're going to send back
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            // The property we need is BuyerId when creating new Basket with
            // Empty basket or empty list
            var basket = new Basket{BuyerId = buyerId};
            // Add to the database
            _context.Baskets.Add(basket);
            return basket;
        }

        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto()
                {
                    Id = basket.Id,
                    BuyerId = basket.BuyerId,
                    // project our item into a basket item dto
                    items = basket.Items.Select(item => new BasketItemDto
                    {
                        ProductId = item.ProductId,
                        Name = item.Product.Name,
                        Price = item.Product.Price,
                        PictureUrl = item.Product.PictureUrl,
                        Type = item.Product.Type,
                        Brand = item.Product.Brand,
                        Quantity = item.Quantity
                    }).ToList() // so we get a list basketitem dto
                };
        }
    }
}