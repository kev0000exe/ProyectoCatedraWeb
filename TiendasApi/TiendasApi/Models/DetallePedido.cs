namespace TiendasApi.Models
{
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using TiendasAPI.Models;
    using TiendasAPI.Models.TiendasApi.Models;

    namespace TiendasApi.Models
    {
        public class DetallePedido
        {
            [Key]
            public int Id { get; set; }

            [Required]
            public int PedidoId { get; set; }

            [Required]
            public int ProductoId { get; set; }

            [Required]
            public int Cantidad { get; set; }

            [Required]
            [Column(TypeName = "decimal(18,2)")]
            public decimal PrecioUnitario { get; set; }

       
            [ForeignKey("PedidoId")]
            public virtual Pedido? Pedido { get; set; }

            [ForeignKey("ProductoId")]
            public virtual Producto? Producto { get; set; }
        }
    }
}