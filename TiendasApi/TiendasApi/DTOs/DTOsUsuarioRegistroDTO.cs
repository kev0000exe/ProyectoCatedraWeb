using System.ComponentModel.DataAnnotations;

namespace TiendasAPI.DTOs
{
    public class UsuarioRegistroDTO
    {
        [Required]
        public string Nombre { get; set; }

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Contraseña { get; set; }
    }
}
