using Microsoft.AspNetCore.Mvc;
using TiendasAPI.Data;
using TiendasAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using TiendasAPI.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;

namespace TiendasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;



        public UsuariosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            return await _context.Usuarios.ToListAsync();
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return usuario;
        }

        // POST: api/Usuarios
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {

            if (!string.IsNullOrEmpty(usuario.Contraseña))
            {
                usuario.Contraseña = BCrypt.Net.BCrypt.HashPassword(usuario.Contraseña);
            }


            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUsuario", new { id = usuario.Id }, usuario);
        }

        // PUT: api/Usuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.Id)
            {
                return BadRequest();
            }

            _context.Entry(usuario).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginDTO dto)
        {
            var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == dto.Correo);

            if (usuario == null)
                return Unauthorized("Correo o contraseña incorrectos.");


            if (!BCrypt.Net.BCrypt.Verify(dto.Contraseña, usuario.Contraseña))
                return Unauthorized("Correo o contraseña incorrectos.");

            // Crear el JWT
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim(ClaimTypes.Name, usuario.Nombre)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("TuSuperSecretaClaveJWT123!"));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "tuApp",
                audience: "tuApp",
                claims: claims,
                expires: DateTime.Now.AddHours(2),
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);


            return Ok(new
            {
                token = tokenString,
                nombre = usuario.Nombre,
                id = usuario.Id
            });
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar([FromBody] UsuarioRegistroDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (string.IsNullOrWhiteSpace(dto.Email))
                return BadRequest("El campo Email es obligatorio.");

            if (await _context.Usuarios.AnyAsync(u => u.Email == dto.Email))
                return BadRequest("El email ya está registrado.");

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Email = dto.Email,
                Correo = dto.Email,
                TipoUsuario = "Cliente",
                FechaNacimiento = dto.FechaNacimiento,

                Contraseña = BCrypt.Net.BCrypt.HashPassword(dto.Contraseña)
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensaje = "Usuario registrado correctamente." });
        }

        [HttpGet("obtener-todos")]
        public async Task<IActionResult> ObtenerTodos()
        {
            var lista = await _context.Usuarios
                .Select(u => new {
                    u.Id,
                    u.Nombre,
                    u.Email,
                    TipoUsuario = u.TipoUsuario ?? "Normal",
                    // Esto busca en la tabla Pedidos y suma en tiempo real
                    TotalGastado = _context.Pedidos.Where(p => p.UsuarioId == u.Id).Sum(p => (decimal?)p.Total) ?? 0,
                    CantidadPedidos = _context.Pedidos.Count(p => p.UsuarioId == u.Id),
                    UltimoPedido = _context.Pedidos.Where(p => p.UsuarioId == u.Id).Max(p => (DateTime?)p.Fecha)
                })
                .ToListAsync();

            return Ok(lista);
        }

        [HttpGet("perfil")]
        [Authorize]
        public async Task<IActionResult> GetPerfil()
        {
            // 1. Extraemos el ID del usuario directamente desde su Token
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized("Token inválido o expirado");

            // 2. Buscamos a ese usuario en la base de datos
            var usuario = await _context.Usuarios.FindAsync(userId);

            if (usuario == null)
                return NotFound("Usuario no encontrado");

            // 3. Le devolvemos sus datos
            return Ok(new
            {
                id = usuario.Id,
                nombre = usuario.Nombre,
                email = usuario.Email,
                tipoUsuario = usuario.TipoUsuario
            });
        }
    }
}
    
