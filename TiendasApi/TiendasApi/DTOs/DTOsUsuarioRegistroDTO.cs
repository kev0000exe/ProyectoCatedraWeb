using System.ComponentModel.DataAnnotations;
namespace TiendasAPI.DTOs
{
    public class UsuarioRegistroDTO
    {
        public string Nombre { get; set; }

        public DateTime FechaNacimiento { get; set; }
        public string Email { get; set; }
        public string Contraseña { get; set; }
    }
}
