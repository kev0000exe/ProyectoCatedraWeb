using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TiendasAPI.Models
{
    public class Pedido
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [Column("id_usuario")]
        public int UsuarioId { get; set; }

        [Required]
        [Column("id_producto")]
        public int ProductoId { get; set; }

        [Required]
        [Column("cantidad")]
        public int Cantidad { get; set; }

        [Column("estado")]
        public string Estado { get; set; } = "Pendiente";

        [Column("fecha")]
        public DateTime Fecha { get; set; } = DateTime.Now;

        [Column("total")]
        public decimal Total { get; set; }
    }
}