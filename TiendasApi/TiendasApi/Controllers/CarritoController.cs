using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TiendasApi.Models.TiendasApi.Models;
using TiendasAPI.Data;
using TiendasAPI.Models;

[Route("api/[controller]")]
[ApiController]
//[Authorize] // Solo usuarios logueados pueden comprar
public class CarritoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CarritoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("finalizar-compra")]
    public async Task<IActionResult> FinalizarComprare([FromBody] List<DetallePedidoDTO> items)
    {
        // 1. Obtener el ID del usuario desde el Token (como hicimos en GetPerfil)
        // var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        // if (!int.TryParse(userIdString, out int userId)) return Unauthorized();
        int userId = 1; // ID temporal para la prueba

        // 2. Crear la cabecera del Pedido
        var nuevoPedido = new Pedido
        {
            UsuarioId = 1,
            ProductoId = items[0].ProductoId,
            Cantidad = items[0].Cantidad,
            Estado = "Completado",
            Fecha = DateTime.Now,
            // Calculamos el total: Cantidad * Precio
            Total = items.Sum(x => x.Cantidad * x.PrecioUnitario)
        };
        _context.Pedidos.Add(nuevoPedido);
        await _context.SaveChangesAsync(); // Guardamos para generar el Id del pedido

        // 3. Crear los detalles vinculados a ese ID de pedido
        foreach (var item in items)
        {
            var detalle = new DetallePedido
            {
                PedidoId = nuevoPedido.Id,
                ProductoId = item.ProductoId,
                Cantidad = item.Cantidad,
                PrecioUnitario = item.PrecioUnitario
            };
            _context.DetallesPedidos.Add(detalle);
        }

        await _context.SaveChangesAsync();
        return Ok(new { mensaje = "Compra realizada con éxito", pedidoId = nuevoPedido.Id });
    }
}

// Clase temporal para recibir los datos del carrito
public class DetallePedidoDTO
{
    public int ProductoId { get; set; }
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}