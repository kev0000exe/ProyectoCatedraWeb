namespace TiendasAPI.Models
{
    using global::TiendasApi.Models.TiendasApi.Models;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;

    namespace TiendasApi.Models
    {
        public class Pedido
        {
            [Key]
            public int Id { get; set; }

            [Required]
            public int UsuarioId { get; set; }

            [Required]
            public DateTime Fecha { get; set; } = DateTime.Now;

            [Required]
            [Column(TypeName = "decimal(18,2)")]
            public decimal Total { get; set; }

            
            [ForeignKey("UsuarioId")]
            public virtual Usuario? Usuario { get; set; }

            public virtual ICollection<DetallePedido> Detalles { get; set; } = new List<DetallePedido>();
        }
    }
}