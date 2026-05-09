using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Producto
{
    [Key]
    [Column("id")] // Esto mapea el 'id' minúscula de SQL (image_bb005f)
    public int Id { get; set; }

    [NotMapped]
    public int IdTienda { get; set; }

    public string Nombre { get; set; }
    public decimal Precio { get; set; }
    public int Stock { get; set; }
}
