using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Onboarding.Models;
using Onboarding.Dto;
using Onboarding.Code;

namespace Onboarding.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class SalesController : ControllerBase
  {
    private readonly OnBoardingContext _context;

    public SalesController(OnBoardingContext context)
    {
      _context = context;
    }

    // GET: api/Sales
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SaleDto>>> GetSales([FromQuery] int pageSize, int pageNum = 1)
    {
      if (_context.Sales == null)
      {
        return NotFound();
      }
      List<SaleDto> saleDtos = new List<SaleDto>();
      var query = _context.Sales
        .Include(s => s.Customer)
        .Include(s => s.Product)
        .Include(s => s.Store)
        .AsQueryable();
      int counts = await query.CountAsync();
      int totalPages = (int)Math.Ceiling(counts / (double)pageSize);
      if (pageNum > totalPages) pageNum = totalPages;
      var sales = await query
          .OrderBy(s => s.Id)
          .Skip((pageNum - 1) * pageSize)
          .Take(pageSize)
          .ToListAsync();
      
      sales.ForEach(async sale =>
      {
        saleDtos.Add(await Mapper.ToSaleDto(sale));
      });
      Response.Headers.Add("TotalPages", totalPages.ToString());
      return saleDtos;
    }

    // GET: api/Sales/5
    [HttpGet("{id}")]
    public async Task<ActionResult<SaleDto>> GetSale(int id)
    {
      if (_context.Sales == null)
      {
        return NotFound();
      }
      var sale = await _context.Sales
          .Include(s => s.Product)
          .Include(s => s.Customer)
          .Include(s => s.Store)
          .FirstOrDefaultAsync(s => s.Id == id);

      if (sale == null)
      {
        return NotFound();
      }


      return await Mapper.ToSaleDto(sale);
    }

    // PUT: api/Sales/5
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPut("{id}")]
    public async Task<IActionResult> PutSale(int id, Sale sale)
    {
      
      if (id != sale.Id)
      {
        return BadRequest();
      }
      Sale preSale = await _context.Sales.FindAsync(sale.Id);
      preSale.ProductId = sale.ProductId;
      preSale.CustomerId = sale.CustomerId;
      preSale.StoreId = sale.StoreId;

      _context.Entry(preSale).State = EntityState.Modified;

      try
      {
        await _context.SaveChangesAsync();
      }
      catch (DbUpdateConcurrencyException)
      {
        if (!SaleExists(id))
        {
          return NotFound();
        }
        else
        {
          throw;
        }
      }

      return NoContent();
    }

    // POST: api/Sales
    // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
    [HttpPost]
    public async Task<ActionResult<SaleDto>> PostSale(Sale sale)
    {
      if (_context.Sales == null)
      {
        return Problem("Entity set 'OnBoardingContext.Sales'  is null.");
      }
      sale.DateSold = DateTime.Now;
      _context.Sales.Add(sale);
      await _context.SaveChangesAsync();

      return CreatedAtAction("GetSale", new { id = sale.Id }, sale);
    }

    // DELETE: api/Sales/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSale(int id)
    {
      if (_context.Sales == null)
      {
        return NotFound();
      }
      var sale = await _context.Sales.FindAsync(id);
      if (sale == null)
      {
        return NotFound();
      }

      _context.Sales.Remove(sale);
      await _context.SaveChangesAsync();

      return NoContent();
    }

    private bool SaleExists(int id)
    {
      return (_context.Sales?.Any(e => e.Id == id)).GetValueOrDefault();
    }
  }
}
