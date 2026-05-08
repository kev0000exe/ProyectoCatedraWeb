using System.ComponentModel.DataAnnotations.Schema; // Esto va hasta arriba

namespace TiendasAPI.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Contraseña { get; set; } = string.Empty;

        // AQUÍ VA LA MAGIA, justo arriba de la propiedad que ya tenías
        [Column("tipo_usuario")]
        public string? TipoUsuario { get; set; }

        public string? Correo { get; set; }

        public DateTime? FechaNacimiento { get; set; }
    }
}