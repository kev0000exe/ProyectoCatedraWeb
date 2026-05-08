using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TiendasApi.Migrations
{
    /// <inheritdoc />
    public partial class AgregarDetallePedidoFinal : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
    name: "DetallesPedidos",
    columns: table => new
    {
        Id = table.Column<int>(type: "int", nullable: false)
            .Annotation("SqlServer:Identity", "1, 1"),
        PedidoId = table.Column<int>(type: "int", nullable: false),
        ProductoId = table.Column<int>(type: "int", nullable: false),
        Cantidad = table.Column<int>(type: "int", nullable: false),
        PrecioUnitario = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_DetallesPedidos", x => x.Id);
        table.ForeignKey(
            name: "FK_DetallesPedidos_Pedidos_PedidoId",
            column: x => x.PedidoId,
            principalTable: "Pedidos",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
        table.ForeignKey(
            name: "FK_DetallesPedidos_Productos_ProductoId",
            column: x => x.ProductoId,
            principalTable: "Productos",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    });

            migrationBuilder.CreateIndex(
                name: "IX_DetallesPedidos_PedidoId",
                table: "DetallesPedidos",
                column: "PedidoId");

            migrationBuilder.CreateIndex(
                name: "IX_DetallesPedidos_ProductoId",
                table: "DetallesPedidos",
                column: "ProductoId");

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
