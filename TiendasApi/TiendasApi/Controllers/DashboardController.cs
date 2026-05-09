using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TiendasAPI.Data;   // <--- Verifica que sea TiendasAPI o TiendasApi
using TiendasAPI.Models; // <--- Cambié esto para que coincida con tu Pedido.cs

namespace TiendasApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("generar-pedidos-reales")]
        public async Task<IActionResult> GenerarPedidosReales()
        {
            try
            {
                // Traemos la data real
                var usuarios = await _context.Usuarios.ToListAsync();
                var productos = await _context.Productos.ToListAsync();

                if (!usuarios.Any() || !productos.Any())
                    return BadRequest("No hay usuarios o productos en la base de datos.");

                var random = new Random();
                var nuevosPedidos = new List<Pedido>();

                foreach (var u in usuarios)
                {
                    int cuantasCompras = random.Next(1, 4);
                    for (int i = 0; i < cuantasCompras; i++)
                    {
                        var prodAlAzar = productos[random.Next(productos.Count)];

                        // CORRECCIÓN AQUÍ: Usamos Id (Mayúscula) porque así está en tu Pedido.cs
                        nuevosPedidos.Add(new Pedido
                        {
                            UsuarioId = u.Id,      // 'u.id' viene de tu SQL image_bb0381
                            ProductoId = prodAlAzar.Id, // 'prodAlAzar.id' viene de SQL image_bb005f
                            Cantidad = random.Next(1, 5),
                            Estado = "Completado",
                            Fecha = DateTime.Now.AddDays(-random.Next(0, 15)),
                            Total = (decimal)(random.NextDouble() * 50 + 10)
                        });
                    }
                }

                _context.Pedidos.AddRange(nuevosPedidos);
                await _context.SaveChangesAsync();

                return Ok(new { mensaje = $"¡Listo! Se crearon {nuevosPedidos.Count} pedidos." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }

        [HttpGet("resumen")]
        public async Task<IActionResult> GetResumen()
        {
            var inicioMes = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            // Filtramos usando 'Fecha' (Mayúscula como en tu Pedido.cs)
            var pedidosDelMes = await _context.Pedidos
                .Where(p => p.Fecha >= inicioMes)
                .ToListAsync();

            decimal gananciasMes = pedidosDelMes.Sum(p => p.Total);
            int pedidosTotales = await _context.Pedidos.CountAsync();
            int clientesTotales = await _context.Usuarios.CountAsync();

            decimal ticketProm = pedidosDelMes.Count > 0 ? gananciasMes / pedidosDelMes.Count : 0;

            return Ok(new
            {
                ganancias = gananciasMes,
                clientes = clientesTotales,
                pedidos = pedidosTotales,
                ticket = Math.Round(ticketProm, 2)
            });
        }
    }
}