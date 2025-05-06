using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using TiendasAPI.Data;
using TiendasAPI.DTOs;
using TiendasAPI.Models;
using TiendasAPI.Services;

namespace TiendasAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(ApplicationDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("registrar")]
        public async Task<IActionResult> Registrar(UsuarioRegistroDTO dto)
        {
            // Validar si ya existe el correo
            var existe = await _context.Usuarios.AnyAsync(u => u.Correo == dto.Email);
            if (existe) return BadRequest("Ya existe un usuario con ese correo.");

            var hasher = new PasswordHasher<Usuario>();

            var usuario = new Usuario
            {
                Nombre = dto.Nombre,
                Correo = dto.Email,
                FechaNacimiento = dto.FechaNacimiento,
                Contraseña = "" // Se reemplazará con el hash
            };

            usuario.Contraseña = hasher.HashPassword(usuario, dto.Contraseña);

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok("Usuario registrado exitosamente.");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UsuarioLoginDTO dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Correo == dto.Correo);

            if (usuario == null)
                return Unauthorized("Correo o contraseña incorrectos.");

            var hasher = new PasswordHasher<Usuario>();
            var resultado = hasher.VerifyHashedPassword(usuario, usuario.Contraseña, dto.Contraseña);

            if (resultado != PasswordVerificationResult.Success)
                return Unauthorized("Correo o contraseña incorrectos.");

            var token = _jwtService.GenerarToken(usuario);
            return Ok(new { token });
        }
    }
}
